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

];





export {
  ATLAS
};
