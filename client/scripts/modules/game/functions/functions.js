
/*
 * В этом модуле описаны функции происходящие во время игры
 */


import {
  MAIN
} from '../../../main.js';
import {
  Factory
} from '../gameObjects/factory/factory.js';

import {
  Truck
} from '../gameObjects/truck/truck.js';



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
      gameID:MAIN.game.data.commonData.id,
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
    MAIN.game.data.playerData.factories[factory.id] = factory;
  },

  applyTruckPurchase(data){
    //происходит, когда любой игрок покупает грузовик
    // trigger socket.js   MAIN.socket.on('GAME_truck_playerBoughtTruck')

    /*
    data = {
      player:data.player,
      truckID:truck.id,
      trucksCount:game.trucks.count,
    };
    */

    const properties = {
      player:data.player,
      id:data.truckID,
    };


    const truck = new Truck(properties);

    MAIN.game.data.commonData.trucks.all[truck.id] = truck;

    if(data.player === MAIN.game.data.playerData.login){
      MAIN.game.data.playerData.trucks[truck.id] = truck;


      //подразумевается, что он все еще в меню, поэтому делаем реопен
      MAIN.interface.game.trucks.openMenu();
    };

  },


};

export {FUNCTIONS};
