/*
 * Это модуль по всем приходящим запросам сокета
 */

import {
  MAIN
} from '../main.js';
import {
  PLAYER_DATA
} from './game/playerData/playerData.js';

const SOCKET = {
  init,
};

function init() {
  if (MAIN.socket) {

    MAIN.socket.on('DEV_GAMEPLAY',()=>{
      /*ДЛЯ ОДНОГО ИГРОКА*/
     // чтобы быстро перейти к созданию сцены
       const data = {
         login:generateId('p',5)
       };
       MAIN.userData = {
         login:data.login,
       };
       MAIN.socket.emit('auth',data);

      /*ДЛЯ ОДНОГО ИГРОКА*/
    });




    MAIN.socket.on('AUTH_false', (data) => {
      MAIN.pages.auth.showError(data.reason, data.password);
    });




    MAIN.socket.on('AUTH_true', (data) => {
      MAIN.userData = {
        login:data.login,
        inRoom:false,
      };
      document.title += ` | ${data.login}`;
      MAIN.pages.rooms.showPage();
    });


    MAIN.socket.on('LOBBY_sendRoomsData', (data) => {
      MAIN.pages.rooms.updatePage(data);
    });


    MAIN.socket.on('LOBBY_updateRoom', (roomData) => {
      MAIN.pages.rooms.updateRoom(roomData);
    });


    MAIN.socket.on('LOBBY_joinedToRoom', (roomId) => {
      MAIN.userData.inRoom = roomId;
    });

    MAIN.socket.on('LOBBY_leaveRoom', () => {
      MAIN.userData.inRoom = false;
    });

    MAIN.socket.on('LOBBY_deleteRoom', (roomId) => {
      MAIN.pages.rooms.deleteRoom(roomId);
    });





    MAIN.socket.on('ROOM_ready', function(ROOM) {
      //Происходит, когда нужное кол-во игроков собрано
      MAIN.pages.loading.changeTitle('Room is ready');
      MAIN.pages.loading.changeComment('Waiting for game generation');
    });


    //поменял на генерацию на сервере
    // MAIN.socket.on('GAME_generate', function(roomData) {
    //   //Происходит когда пользователь хозяин комнаты и нужное кол-во игроков собрано
    //   MAIN.pages.loading.changeTitle('Room is ready');
    //   MAIN.pages.loading.changeComment('Game generation');
    //   MAIN.game.generation.start(roomData);
    // });
    MAIN.socket.on('GAME_over', () => {
      alert('Game over');
      MAIN.game.functions.endTurn();
      MAIN.game.data.playerData.gameOver = true;
    });
    MAIN.socket.on('GAME_data', function(gameData) {
      //Происходит, когда вся gameData сгенерирована

      MAIN.game.data = gameData;
      MAIN.game.data.cities = {};
      MAIN.game.data.playerData = new PLAYER_DATA(MAIN.userData.login);

      MAIN.game.scene.assets.load().then((result) => {
        MAIN.renderer.init();
        MAIN.game.scene.create().then((result) => {
          MAIN.pages.loading.close();
          //события должны начать проверяться после того, как все будет готово. сообщаем, что все готово
          MAIN.interface.init();
          MAIN.interface.startedCheckEvents = true;
          // MAIN.game.events.init();
          if (gameData.commonData.turnBasedGame) {
            MAIN.interface.game.turn.init();
          };
          MAIN.interface.game.credit.showChooseCreditMenu();
        });
      });
    });

    MAIN.socket.on('GAME_turn_action', function(balance) {
      //происходит на каждом тике или ходе
      MAIN.game.data.playerData.turnAction();
    });



    MAIN.socket.on('GAME_changeBalance', function(balance) {
      MAIN.interface.game.balance.change(balance);
    });

    MAIN.socket.on('GAME_applyBuilding', function(data) {
      //Происходит, кто-то из игроков что-то строит
      //просто размещает объект на сцене
      // ceilMenu.js CEIL_MENU.sendBuildRequest();
      /*data = {
        player:MAIN.userData.login,
        gameID:MAIN.game.commonData.id,
        build:{
          ceilIndex:ceil.indexes,
          sector:sector,
          building:building,
        }
      */

      MAIN.game.functions.applyBuilding(data);
      //отбовляем в общем числе построек
      if(MAIN.game.data.commonData.factoriesCount[data.build.building]){
        MAIN.game.data.commonData.factoriesCount[data.build.building] -= 1;
      };
    });

    //происходит когда игрок выбрал себе кредит
    MAIN.socket.on('GAME_applyCredit', function(credit) {
      MAIN.game.data.playerData.balance = credit.amount;
      MAIN.game.data.playerData.credit = credit;
      MAIN.game.data.playerData.credit.allPays = credit.pays;
      document.querySelector('#chooseCreditMenuSection').remove();
      MAIN.interface.game.balance.init(MAIN.game.data.playerData.balance);
    });



    MAIN.socket.on('GAME_creditChanges', function(data) {
      MAIN.game.data.playerData.credit.deferment = data.deferment;
      MAIN.game.data.playerData.credit.pays = data.pays;
      MAIN.interface.game.balance.updateCreditHistory();
    });

    MAIN.socket.on('GAME_taxValue', function(data) {
      MAIN.game.data.playerData.tax.value = data.value;
      MAIN.game.data.playerData.tax.procent = data.procent;
      MAIN.game.data.playerData.tax.earn = data.earn;
    });



    //происходит, когда меняется ход игрока
    MAIN.socket.on('GAME_reciveTurn', function(data) {
      MAIN.game.data.commonData.turnsPaused = false;
      if (MAIN.game.data.commonData.turnBasedGame) {
        MAIN.game.data.commonData.queue = data.currentTurn;
        if (data.currentTurn === MAIN.game.data.playerData.login) {
          if (MAIN.game.data.playerData.gameOver) {
            MAIN.game.functions.endTurn();
          };
        };
        MAIN.interface.game.turn.makeTimer(data.turnTime / 1000, data);
      };
    });

    MAIN.socket.on('GAME_pasedTurn', () => {
      MAIN.game.data.commonData.turnsPaused = true;
      MAIN.interface.game.turn.makeNote('turns paused');
    });

    MAIN.socket.on('GAME_BalanceMessage', (data) => {
      MAIN.interface.game.balance.addBalanceMessage(data.message, data.amount);
    });


    //происходит, когда игрок строит фабрику
    // эта функция по сути создает только класс фабрики
    MAIN.socket.on('GAME_buildFactory', (data) => {
      MAIN.game.functions.buildFactory(data);
    });

    MAIN.socket.on('GAME_factory_newSettings', (data) => {
      //происходит, когда с сервера приходят настройки на фабрику
      if(MAIN.game.data.playerData.factories[data.id]){
        MAIN.game.data.playerData.factories[data.id].applySettings(data);
      };
    });


    //обновление всех фабрик
    MAIN.socket.on('GAME_factoryList_updates',(data) => {
      for(let factory in data){
        MAIN.game.data.playerData.factories[factory].applyUpdates(data[factory]);
      };
      MAIN.interface.game.factory.updateFactoryMenu();
    });

    //обновление только одной
    MAIN.socket.on('GAME_factory_update',(data)=>{
      MAIN.game.data.playerData.factories[data.id].applyUpdates(data);
      MAIN.interface.game.factory.updateFactoryMenu();
    });


    MAIN.socket.on('GAME_truck_playerBoughtTruck',(data)=>{
      //происходит, когда кто-то покупает грузовик
      MAIN.game.data.commonData.trucks.count = data.trucksCount;
      MAIN.interface.game.trucks.changeTrucksCount();
      MAIN.game.functions.applyTruckPurchase(data);
    });




    MAIN.socket.on('GAME_truck_loaded',(data) => {
        //происходит, когда кто-то загружает грузовик
        /*
          data = {
            player:this.player.login,
            truckID:this.id,
            product:{
              name:this.product.name,
              quality:this.product.quality,
            },
          };
        */

        if(MAIN.game.data.commonData.trucks.all[data.truckID]){
          MAIN.game.data.commonData.trucks.all[data.truckID].product = data.product;
        };

    });

    MAIN.socket.on('GAME_truck_ceilFull',(cords)=>{
      //происходит, когда игрок загружает грузовик, а клетка уже занята
      MAIN.game.data.map[cords.z][cords.x].showCeilFullByTruck();
    });

    MAIN.socket.on('GAME_truck_place',(data)=>{
      //происходит, когда игрок загружает грузовик, и он размещается на карте

      // const data = {
      //   autosend: false
      //   game: "Game_FraPKW"
      //   id: "Truck_SIkSCq"
      //   player: "p_CvWHlz"
      //   positionIndexes: {x: 5, z: 7}
      //   product: {
      //             factory: "waterStation_2cfZyI"
      //             game: "Game_FraPKW"
      //             id: "Product_water_HfUnX2"
      //             name: "water"
      //             player: "p_CvWHlz"
      //             quality: 0
      //             truck: "Truck_SIkSCq"
      //           }
      //   truckNumber: 26
      // }
      if(MAIN.game.data.commonData.trucks.all[data.id]){
        const thisTruck = MAIN.game.data.commonData.trucks.all[data.id];
        thisTruck.placeOnMap(data);
      };

    });


    //происходит, когда кто-то высылает грузовик
    MAIN.socket.on('GAME_truck_sending',(data)=>{
      if(MAIN.game.data.commonData.trucks.all[data.truck]){
        const thisTruck = MAIN.game.data.commonData.trucks.all[data.truck];
        thisTruck.moveAlongWay(data);
      };
    });


    MAIN.socket.on('GAME_truck_clear',(truckID)=>{
      //происходит, когда игрок загружает грузовик, и он размещается на карте
      /*
      const data = {
        player:this.player.login,
        truckID:this.id,
        place:factory.ceilIndex,
      };
      */

      if(MAIN.game.data.commonData.trucks.all[truckID]){
        const thisTruck = MAIN.game.data.commonData.trucks.all[truckID];
        thisTruck.clear();
      };
    });



    //происходит, когда на сервере обновляется город
    MAIN.socket.on('GAME_city_update',(data)=>{
      for(let city in MAIN.game.data.cities){
        const thisCity = MAIN.game.data.cities[city];
        thisCity.applyUpdates(data[city]);
      };

      // for(let city in MAIN.game.data.cities){
      //   const thisCity = MAIN.game.data.cities[city];
      //   for(let prod in thisCity.storage){
      //     thisCity.storage[prod].line = data[city][prod];
      //   };
      //   thisCity.balance = data[city].balance;
      // };
      //
      // if(MAIN.interface.game.city.cardOpened){
      //   MAIN.interface.game.city.openMenu(MAIN.interface.game.city.cardOpened);
      // };
      //
      // //если во время хода грузовика приходит обнова, то обновляем уведомления цен в городе
      // if(MAIN.interface.game.path.neederOfProduct.length > 0){
      //   MAIN.interface.game.path.updateCityPrise();
      // };
      // if(document.querySelector('#balanceHistory_productsInCirculation')){
      //   document.querySelector('#balanceHistory_productsInCirculation').innerHTML = MAIN.interface.game.balance.calculateProductsWorth();
      // };
    });

    //происходит, когда кто-то продает ресурс в город
    MAIN.socket.on('GAME_city_updateOne',(data)=>{
      const thisCity = MAIN.game.data.cities[data.name];
      thisCity.applyUpdates(data);


      // for(let prod in data.storage){
      //   MAIN.game.data.cities[data.name].storage[prod].line = data.storage[prod];
      // };
      //
      // MAIN.game.data.cities[data.name].balance = data.balance;
      //
      //
      // if(MAIN.interface.game.city.cardOpened){
      //   MAIN.interface.game.city.openMenu(MAIN.interface.game.city.cardOpened);
      // };
      //
      // //если во время хода грузовика приходит обнова, то обновляем уведомления цен в городе
      // if(MAIN.interface.game.city.priceShow){
      //   MAIN.interface.game.city.showCityPrices(MAIN.interface.game.city.priceShow);
      // };
      //
      // if(document.querySelector('#balanceHistory_productsInCirculation')){
      //   document.querySelector('#balanceHistory_productsInCirculation').innerHTML = MAIN.interface.game.balance.calculateProductsWorth();
      // };
    });











  };
};

export {
  SOCKET
};
