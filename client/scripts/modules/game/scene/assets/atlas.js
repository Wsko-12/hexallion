/*
* В этом модуле атлас всех файлов для загрузки
*/



import {
  MAIN
} from '../../../../main.js';

const ATLAS = {};



ATLAS.modelsPath = './scripts/modules/game/scene/assets/models/';
ATLAS.texturePath = './scripts/modules/game/scene/assets/textures/';


ATLAS.models = [
  // { name:'hex',
  //   folder:'',
  //   file:'hex.glb',
  // },
  // { name:'waterCeil',
  //   folder:'',
  //   file:'waterCeil.glb',
  // },
  // { name:'waterCeilBottom',
  //   folder:'',
  //   file:'waterCeilBottom.glb',
  // },

  // { name:'forestCeil',
  //   folder:'',
  //   file:'forestCeil.glb',
  // },
  { name:'tableBorders',
    folder:'',
    file:'tableBorders.glb',
  },

  { name:'forestCeil',
    folder:'ceils/',
    file:'forestCeil.glb',
  },
  { name:'meadowCeil',
    folder:'ceils/',
    file:'meadowCeil.glb',
  },
  { name:'meadowDecor_0',
    folder:'ceils/meadowDecor/',
    file:'meadowDecor_0.glb',
  },
  { name:'meadowDecor_1',
    folder:'ceils/meadowDecor/',
    file:'meadowDecor_1.glb',
  },
  { name:'meadowDecor_2',
    folder:'ceils/meadowDecor/',
    file:'meadowDecor_2.glb',
  },
  { name:'meadowDecor_3',
    folder:'ceils/meadowDecor/',
    file:'meadowDecor_3.glb',
  },
  { name:'meadowDecor_4',
    folder:'ceils/meadowDecor/',
    file:'meadowDecor_4.glb',
  },








  { name:'steelMineCeil',
    folder:'ceils/',
    file:'steelMineCeil.glb',
  },
  { name:'sandCeil',
    folder:'ceils/',
    file:'sandCeil.glb',
  },
  { name:'waterCeil',
    folder:'ceils/',
    file:'waterCeil.glb',
  },
  { name:'waterBottom',
    folder:'ceils/',
    file:'waterBottom.glb',
  },
  { name:'mountainCeil',
    folder:'ceils/',
    file:'mountainCeil.glb',
  },
  { name:'westownCeil',
    folder:'ceils/',
    file:'westownCeil.glb',
  },
  { name:'westownLight',
    folder:'ceils/',
    file:'westownLight.glb',
  },
  { name:'northfieildCeil',
    folder:'ceils/',
    file:'northfieildCeil.glb',
  },
  { name:'northfieildLight',
    folder:'ceils/',
    file:'northfieildLight.glb',
  },
  { name:'southcityCeil',
    folder:'ceils/',
    file:'southcityCeil.glb',
  },
  { name:'southcityLight',
    folder:'ceils/',
    file:'southcityLight.glb',
  },
  { name:'hitboxCeil',
    folder:'ceils/hitboxes/',
    file:'hitboxCeil.glb',
  },
  { name:'cityHitBox',
    folder:'ceils/hitboxes/',
    file:'cityHitBox.glb',
  },
  { name:'forestHitBox',
    folder:'ceils/hitboxes/',
    file:'forestHitBox.glb',
  },
  { name:'mountainHitBox',
    folder:'ceils/hitboxes/',
    file:'mountainHitBox.glb',
  },
  { name:'hexsectorTemporaryMesh',
    folder:'ceils/',
    file:'hexsectorTemporaryMesh.glb',
  },


  { name:'roadCenter',
    folder:'buildings/',
    file:'roadCenter.glb',
  },
  { name:'road',
    folder:'buildings/',
    file:'road.glb',
  },

  { name:'roadLight',
    folder:'buildings/',
    file:'roadLight.glb',
  },

  { name:'roadDecor1',
    folder:'buildings/',
    file:'roadDecor1.glb',
  },
  { name:'roadDecor2',
    folder:'buildings/',
    file:'roadDecor2.glb',
  },
  { name:'roadDecor3',
    folder:'buildings/',
    file:'roadDecor3.glb',
  },
  { name:'roadDecor4',
    folder:'buildings/',
    file:'roadDecor4.glb',
  },

  { name:'bridge',
    folder:'buildings/',
    file:'bridge.glb',
  },
  { name:'bridgeCentral',
    folder:'buildings/',
    file:'bridgeCentral.glb',
  },
  { name:'bridgeBorder',
    folder:'buildings/',
    file:'bridgeBorder.glb',
  },
  { name:'bridgeStraight',
    folder:'buildings/',
    file:'bridgeStraight.glb',
  },
  { name:'bridgeStraightLight',
    folder:'buildings/',
    file:'bridgeStraightLight.glb',
  },
  { name:'bridgeLight',
    folder:'buildings/',
    file:'bridgeLight.glb',
  },

  { name:'cityStorage',
    folder:'buildings/',
    file:'cityStorage.glb',
  },




  { name:'factoryBottom',
    folder:'buildings/',
    file:'factoryBottom.glb',
  },

  { name:'sawmill',
    folder:'buildings/',
    file:'sawmill.glb',
  },
  { name:'sawmillLight',
    folder:'buildings/',
    file:'sawmillLight.glb',
  },

  { name:'truck',
    folder:'truck/',
    file:'truck.glb',
  },

  { name:'truckHitBox',
    folder:'truck/',
    file:'truckHitBox.glb',
  },


  { name:'waterStation',
    folder:'buildings/',
    file:'waterStation.glb',
  },

  { name:'sandMine',
    folder:'buildings/',
    file:'sandMine.glb',
  },
  { name:'steelMill',
    folder:'buildings/',
    file:'steelMill.glb',
  },
  { name:'goldMill',
    folder:'buildings/',
    file:'goldMill.glb',
  },


  { name:'pathMarker_road',
    folder:'path/',
    file:'pathMarker_road.glb',
  },
  { name:'pathMarker_bridge',
    folder:'path/',
    file:'pathMarker_bridge.glb',
  },
  { name:'pathMarker_bridgeStraight',
    folder:'path/',
    file:'pathMarker_bridgeStraight.glb',
  },

  { name:'emptyGeometry',
    folder:'',
    file:'emptyGeometry.glb',
  },


];
ATLAS.textures = [
  { name:'sceneEnvMap',
    folder:'scene/',
    file:'sceneEnvMap.jpg',
  },
  { name:'ceils_color',
    folder:'ceils/',
    file:'ceils_color.png',
  },
  { name:'lights',
    folder:'ceils/',
    file:'lights.png',
  },
  { name:'ceils',
    folder:'ceils/',
    file:'ceils.png',
  },

];





export {
  ATLAS
};
