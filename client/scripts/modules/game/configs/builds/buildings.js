//Этот кофиг по всем постройкам что и рядом с чем можно строить
import {
  MAIN
} from '../../../../main.js';

//в этом конфиге вся инфа ТОЛЬКО по постройке, на каких клетках мможно строить, сколько стоит постройка и тд;

const BUILDINGS = {
  road: {
    name: 'Road',
    description: 'Дорога для транспорта',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['meadow', 'sea', 'Westown', 'Southcity', 'Northfield', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    coast: 5000,


    title: {
      eng: 'road',
      ru: 'дорога',
    },
    //для ceilMenu
    buttonColor: '#303030',

  },

  bridge: {
    name: 'Bridge',
    description: 'Мост для транспорта',
    ceil: ['sea'],
    nearCeil: ['meadow', 'sea', 'Westown', 'Southcity', 'Northfield', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    coast: 7500,

    title: {
      eng: 'bridge',
      ru: 'мост',
    },
    buttonColor: '#303030',

  },
  sawmill: {
    name: 'Sawmill',
    description: 'Производство досок',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['forest'],
    coast: 26100,
    product: 'wood',
    category: 'mining',
    title: {
      eng: 'sawmill',
      ru: 'лесопилка',
    },
    buttonColor: '#887265',
  },


  waterStation: {
    name: 'Water station',
    description: 'Производство чистой воды',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['sea'],
    coast: 11600,
    product: 'water',
    category: 'mining',
    title: {
      eng: 'water station',
      ru: 'станция водоочистки',
    },
    buttonColor: '#ADCCD0',
  },

  sandMine: {
    name: 'Sand mine',
    description: 'Добыча песка',
    ceil: ['sand'],
    nearCeil: ['all'],
    coast: 5900,
    product: 'sand',
    category: 'mining',
    title: {
      eng: 'sand mine',
      ru: 'песчаный карьер',
    },
    buttonColor: '#E3DAB9',
  },

  steelMill: {
    name: 'Steel mill',
    description: 'Добыча и производство стали',
    ceil: ['steelMine'],
    nearCeil: ['all'],
    coast: 39000,
    product: 'steel',
    category: 'mining',
    title: {
      eng: 'steel mill',
      ru: 'завод стали',
    },
    buttonColor: '#AEACAA',
  },

  goldMill: {
    name: 'Gold mill',
    description: 'Добыча и производство золота',
    ceil: ['goldMine'],
    nearCeil: ['all'],
    coast: 89300,
    product: 'gold',
    category: 'mining',
    title: {
      eng: 'gold mill',
      ru: 'завод золота',
    },
    buttonColor: '#F9D761',
  },

  oilWell: {
    name: 'Oil well',
    description: 'Добыча нефти',
    ceil: ['oilMine'],
    nearCeil: ['all'],
    coast: 31500,
    product: 'oil',
    category: 'mining',
    title: {
      eng: 'oil well',
      ru: 'нефтяная вышка',
    },
    buttonColor: '#454758',

  },


  oilRefinery: {
    name: 'Oil refinery',
    description: 'Переработка нефти',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 64100,
    product: ['petrol'],
    raw: ['oil'],
    category: 'factory',
    title: {
      eng: 'oil refinery',
      ru: 'Переработка нефти',
    },
    buttonColor: '#454758',
  },



  petrochemicalPlant: {
    name: 'Petrochemical plant',
    description: 'Нефтехим завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 55875,
    product: ['glue','dye','rubber','plastic'],
    raw: ['oil'],
    category: 'factory',
    title: {
      eng: 'petrochemical plant',
      ru: 'Нефтехим завод',
    },
    buttonColor: '#454758',
  },
};
export {
  BUILDINGS
};
