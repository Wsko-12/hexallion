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
  { name:'hex',
    folder:'',
    file:'hex.glb',
  },
  { name:'waterCeil',
    folder:'',
    file:'waterCeil.glb',
  },
  { name:'waterCeilBottom',
    folder:'',
    file:'waterCeilBottom.glb',
  },
  { name:'tableBorders',
    folder:'',
    file:'tableBorders.glb',
  },
  { name:'forestCeil',
    folder:'',
    file:'forestCeil.glb',
  },
];
ATLAS.textures = [
  { name:'sceneEnvMap',
    folder:'scene/',
    file:'sceneEnvMap.jpg',
  },
  { name:'common_color',
    folder:'ceils/',
    file:'common_color.png',
  },
];





export {
  ATLAS
};
