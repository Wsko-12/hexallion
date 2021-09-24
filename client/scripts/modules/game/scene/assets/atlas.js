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
];
ATLAS.textures = [
  {
    name:'table_color',
    folder:'',
    file:'table_color.jpg',
  },
  {
    name:'table_normal',
    folder:'',
    file:'table_normal.jpg',
  },
  {
    name:'table_roughness',
    folder:'',
    file:'table_roughness.jpg',
  },
  {
    name:'table_bump',
    folder:'',
    file:'table_bump.png',
  },
  {
    name:'ceils_color',
    folder:'',
    file:'ceils_color.png',
  },
  {
    name:'ceils_normal',
    folder:'',
    file:'ceils_normal.png',
  },

  { name:'toonGradient',
    folder:'',
    file:'toonGradient.png',
  },
  { name:'waterMat',
    folder:'',
    file:'waterMat.jpg',
  },

  { name:'water_normal',
    folder:'',
    file:'water_normal.jpg',
  },

];





export {
  ATLAS
};
