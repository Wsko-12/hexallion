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
      MAIN.game.scene.assets.load().then((result) => {
        MAIN.renderer.init();
        MAIN.game.scene.create();
      });
    });

    let req = 0;
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

    };
  };

  export {
    SOCKET
  };
