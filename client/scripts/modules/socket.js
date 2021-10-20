/*
 * Это модуль по всем приходящим запросам сокета
 */

import {
  MAIN
} from '../main.js';

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

    MAIN.socket.on('GAME_generate', function(roomData) {
      //Происходит когда пользователь хозяин комнаты и нужное кол-во игроков собрано
      MAIN.pages.loading.changeTitle('Room is ready');
      MAIN.pages.loading.changeComment('Game generation');
      MAIN.game.generation.start(roomData);
    });

    MAIN.socket.on('GAME_data', function(gameData) {
      //Происходит, когда вся gameData сгенерирована

      MAIN.game.data = {};
      MAIN.game.commonData = gameData;
      MAIN.game.commonData.queue = null;
      MAIN.game.playerData.login = MAIN.userData.login;


      MAIN.game.scene.assets.load().then((result) => {
        MAIN.renderer.init();
        MAIN.game.scene.create().then((result)=>{
          MAIN.pages.loading.close();
          //события должны начать проверяться после того, как все будет готово. сообщаем, что все готово
          MAIN.interface.init();
          MAIN.interface.startedCheckEvents = true;
          // MAIN.game.events.init();
          if(gameData.turnBasedGame){
              MAIN.interface.game.turn.init();
          };
          MAIN.interface.game.credit.showChooseCreditMenu();
        });
      });
    });

    MAIN.socket.on('GAME_changeBalance', function(balance) {
      MAIN.interface.game.balance.change(balance);
    });

    MAIN.socket.on('GAME_applyBuilding', function(data) {
        //Происходит, кто-то из игроков что-то строит
        // ceilMenu.js CEIL_MENU.sendBuildRequest();
        // data = {
        //     player: MAIN.userData.login,
        //     gameID: MAIN.game.commonData.id,
        //     build: {
        //     ceilIndex: ceil.indexes,
        //     sector: sector,
        //     building: building,
        //   },
          MAIN.game.functions.applyBuilding(data);
    });

    //происходит когда игрок выбрал себе кредит
    MAIN.socket.on('GAME_applyCredit', function(credit) {

      MAIN.game.playerData.balance = credit.amount;
      MAIN.game.playerData.credit = credit;

      document.querySelector('#chooseCreditMenuSection').remove();
      MAIN.interface.game.balance.init(MAIN.game.playerData.balance);
    });

    MAIN.socket.on('GAME_creditChanges',function(data){
      MAIN.game.playerData.credit.deferment = data.deferment;
      MAIN.game.playerData.credit.pays = data.pays;
      console.log(MAIN.game.playerData.credit);
    })

    //происходит, когда меняется ход игрока
    MAIN.socket.on('GAME_reciveTurn', function(data) {
      MAIN.game.commonData.turnsPaused = false;
      if(MAIN.game.commonData.turnBasedGame){
        MAIN.game.commonData.queue = data.currentTurn;
        if(data.currentTurn === MAIN.game.playerData.login){
          if(  MAIN.game.playerData.balance > 0){
            //пусть endTurn приходит с сервера
            // setTimeout(()=>{
            //   MAIN.game.functions.endTurn();
            // },data.turnTime);
          }else{
            MAIN.game.functions.endTurn();
          };
        };
        MAIN.interface.game.turn.makeTimer(data.turnTime/1000,data.currentTurn);
      };
    });

    MAIN.socket.on('GAME_pasedTurn',()=>{
      MAIN.game.commonData.turnsPaused = true;
      MAIN.interface.game.turn.makeNote('turns paused');
    });

  };
};

  export {
    SOCKET
  };
