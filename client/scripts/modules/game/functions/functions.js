
/*
 * В этом модуле описаны функции происходящие во время игры
 */


import {
  MAIN
} from '../../../main.js';


const FUNCTIONS = {
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




};

export {FUNCTIONS};
