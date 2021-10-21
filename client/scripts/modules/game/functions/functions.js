
/*
 * В этом модуле описаны функции происходящие во время игры
 */


import {
  MAIN
} from '../../../main.js';
import {
  Factory
} from '../gameObjects/factory/factory.js';


const FUNCTIONS = {
  //trigger at socket.js MAIN.socket.on('GAME_applyBuilding')
  applyBuilding(data){
    // data = {
    //     ceilIndex: ceil.indexes,
    //     sector: sector,
    //     building: building,
    //   }
    const ceil = MAIN.game.data.map[data.ceilIndex.z][data.ceilIndex.x];
    if(ceil.sectors[data.sector] === null){
      ceil.buildOnSector(data.sector,data.building);
    };
  },


  endTurn(){
    const data = {
      player:MAIN.userData.login,
      gameID:MAIN.game.commonData.id,
    };
    MAIN.socket.emit('GAME_endTurn',data);
  },

  buildFactory(configs){
    //происходит, когда игрок строит себе фабрику
    // trigger socket.js   MAIN.socket.on('GAME_buildFactory')
    /*
      data = {
        building: "sawmill"
        ceilIndex: {z: 5, x: 5}
        id: "sawmill_dVXiJM"
        sector: 5
      }
    */

    const factory = new Factory(configs);
    MAIN.game.playerData.factories[factory.id] = factory;
  },


};

export {FUNCTIONS};
