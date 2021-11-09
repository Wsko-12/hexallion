

//Этот кофиг по всем постройкам что и рядом с чем можно строить
import {
  MAIN
} from '../../../../main.js';

//в этом конфиге вся инфа ТОЛЬКО по постройке, на каких клетках мможно строить, сколько стоит постройка и тд;

const BUILDINGS = {
  road:{
    name:'Road',
    description:'Дорога для транспорта',
    ceil:['meadow'],
    nearCeil:['meadow','sea','Westown','Southcity','Northfield'],
    coast:5000,
  },

  bridge:{
    name:'Bridge',
    description:'Мост для транспорта',
    ceil:['sea'],
    nearCeil:['meadow','sea','Westown','Southcity','Northfield'],
    coast:7500,
  },
  sawmill:{
    name:'Sawmill',
    description:'Производство досок',
    ceil:['meadow'],
    nearCeil:['forest'],
    coast:19500,
  },
  // waterStation:{
  //   name:'Water station',
  //   description:'Производство чистой воды',
  //   ceil:['meadow'],
  //   nearCeil:['sea'],
  // },
  // field:{
  //   name:'Field',
  //   description:'Поле для выращивания сельскохозяйственных культур',
  //   ceil:['meadow'],
  //   nearCeil:['all'],
  // },
};
export {
  BUILDINGS
};
