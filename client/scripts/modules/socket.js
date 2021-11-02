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

    MAIN.socket.on('GAME_data', function(gameData) {
      //Происходит, когда вся gameData сгенерирована

      MAIN.game.data = gameData;
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

      MAIN.game.functions.applyBuilding(data.build);
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
    })

    //происходит, когда меняется ход игрока
    MAIN.socket.on('GAME_reciveTurn', function(data) {
      MAIN.game.data.commonData.turnsPaused = false;
      if (MAIN.game.data.commonData.turnBasedGame) {
        MAIN.game.data.commonData.queue = data.currentTurn;
        if (data.currentTurn === MAIN.game.data.playerData.login) {
          if (MAIN.game.data.playerData.balance > 0) {
          } else {
            MAIN.game.functions.endTurn();
          };
        };
        MAIN.interface.game.turn.makeTimer(data.turnTime / 1000, data.currentTurn);
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
      MAIN.game.data.playerData.factories[data.factoryID].applyUpdates(data.updates);
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
            resoure:{
              name:this.resource.name,
              quality:this.resoure.quality,
            },
          };
        */

        if(MAIN.game.data.commonData.trucks.all[data.truckID]){
          MAIN.game.data.commonData.trucks.all[data.truckID].resource = data.resoure;
        };

    });

    MAIN.socket.on('GAME_truck_ceilFull',(cords)=>{
      //происходит, когда игрок загружает грузовик, а клетка уже занята
      console.log('ceil empty',cords);
    });

    MAIN.socket.on('GAME_truck_place',(data)=>{
      //происходит, когда игрок загружает грузовик, и он размещается на карте
      /*
      const data = {
        player:this.player.login,
        truckID:this.id,
        place:factory.ceilIndex,
      };
      */

      if(MAIN.game.data.commonData.trucks.all[data.truckID]){
        const thisTruck = MAIN.game.data.commonData.trucks.all[data.truckID];
        thisTruck.placeOnMap(data.place);
      };
    });


    //происходит, когда кто-то высылает грузовик
    MAIN.socket.on('GAME_truck_sending',(data)=>{
      if(MAIN.game.data.commonData.trucks.all[data.truckID]){
        const thisTruck = MAIN.game.data.commonData.trucks.all[data.truckID];
        thisTruck.moveAlongWay(data);
      };
    });

  };
};

export {
  SOCKET
};
