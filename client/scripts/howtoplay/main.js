
import {
  GAME
} from './modules/game/game.js';
import {
  RENDERER
} from './modules/renderer/renderer.js';
import {
  INTERFACE
} from './modules/interface/interface.js';
import {
  TUTORIAL
} from './modules/tutorial/tutorial.js';

const MAIN = {};
MAIN.game = GAME;
MAIN.renderer = RENDERER;
MAIN.interface = INTERFACE;
MAIN.tutorial = TUTORIAL;
MAIN.init = function(){
  MAIN.game.scene.assets.load().then((res)=>{
    MAIN.renderer.init();
    const map = [
      'meadow', 'meadow', 'steelMine', 'mountain', 'meadow',
      'meadow', 'meadow', 'meadow', 'meadow', 'meadow',
      'forest', 'meadow', 'meadow', 'sand', 'forest',
      'meadow', 'meadow', 'oilMine', 'meadow', 'meadow',
      'sea', 'forest', 'Southcity', 'goldMine', 'sea',
      'forest', 'Westown', 'oilMine', 'meadow', 'meadow',
      'mountain', 'forest', 'meadow', 'meadow', 'mountain',
       'meadow', 'oilMine', 'meadow', 'sand', 'sea',
       'forest', 'sea', 'sand', 'sand', 'meadow',
       'meadow', 'sea', 'forest', 'meadow', 'meadow',
       'steelMine', 'meadow', 'meadow', 'meadow', 'goldMine',
       'meadow', 'forest', 'forest', 'forest', 'mountain',
       'meadow', 'meadow', 'meadow', 'oilMine', 'sea',
       'meadow', 'sand', 'sand', 'mountain', 'sand',
       'meadow', 'steelMine', 'sand', 'forest', 'mountain',
       'forest', 'sea', 'meadow', 'steelMine', 'forest',
       'meadow', 'Northfield', 'meadow', 'meadow', 'meadow',
        'sea', 'meadow', 'forest', 'sea', 'forest', 'forest'];

    const gameData = {
      mapArray:map,
      playerColors:['#757575'],
      cities:{},
      commonData:{
        factoriesCount:{
          buildingProductsFactory: 10,
          cementFactory: 10,
          furnitureFactory: 10,
          glassFactory: 10,
          goldMill: 4,
          jewelryFactory: 10,
          oilRefinery: 10,
          oilWell: 14,
          paperFactory: 10,
          petrochemicalPlant: 10,
          sandMine: 14,
          sawmill: 10,
          steelMill: 8,
          waterStation: 12,
        },
      },
      playerData:{
        factories:{},
        trucks:{},
        tax:{value:0,procent:0}
      },
    };
    MAIN.gameData = gameData;
    MAIN.game.scene.create();
    MAIN.interface.init();
    MAIN.interface.startedCheckEvents = true;
    MAIN.tutorial.start();
    console.log(MAIN)

  });
};
MAIN.init();

export {MAIN};
