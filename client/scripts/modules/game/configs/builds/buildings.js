

//Этот кофиг по всем постройкам что и рядом с чем можно строить
import {
  MAIN
} from '../../../../main.js';



const BUILDINGS = {
  road:{
    ceil:['meadow','sea'],
    nearCeil:['meadow','sea','Westown','Southcity','Northfield'],
  },
  sawmill:{
    ceil:['meadow'],
    nearCeil:['forest'],
  },
  waterStation:{
    ceil:['meadow'],
    nearCeil:['sea'],
  },
  field:{
    ceil:['meadow'],
    nearCeil:['all'],
  },
};
export {
  BUILDINGS
};
