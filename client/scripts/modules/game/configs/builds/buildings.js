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
      eng: 'Road',
      ru: 'Дорога',
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
      eng: 'Bridge',
      ru: 'Мост',
    },
    buttonColor: '#303030',

  },
  sawmill: {
    name: 'Sawmill',
    description: 'Производство досок',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['forest'],
    coast: 14100,
    product: 'wood',
    category: 'mining',
    title: {
      eng: 'Sawmill',
      ru: 'Лесопилка',
    },
    buttonColor: '#887265',
  },


  waterStation: {
    name: 'Water station',
    description: 'Производство чистой воды',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['sea'],
    coast: 15100,
    product: 'water',
    category: 'mining',
    title: {
      eng: 'Water station',
      ru: 'Станция водоочистки',
    },
    buttonColor: '#ADCCD0',
  },

  sandMine: {
    name: 'Sand mine',
    description: 'Добыча песка',
    ceil: ['sand'],
    nearCeil: ['all'],
    coast: 12000,
    product: 'sand',
    category: 'mining',
    title: {
      eng: 'Sand mine',
      ru: 'Песчаный карьер',
    },
    buttonColor: '#E3DAB9',
  },

  steelMill: {
    name: 'Steel mill',
    description: 'Добыча и производство стали',
    ceil: ['steelMine'],
    nearCeil: ['all'],
    coast: 34800,
    product: 'steel',
    category: 'mining',
    title: {
      eng: 'Steel mill',
      ru: 'Завод стали',
    },
    buttonColor: '#AEACAA',
  },

  goldMill: {
    name: 'Gold mill',
    description: 'Добыча и производство золота',
    ceil: ['goldMine'],
    nearCeil: ['all'],
    coast: 66200,
    product: 'gold',
    category: 'mining',
    title: {
      eng: 'Gold mill',
      ru: 'Золотодобывающий рудник',
    },
    buttonColor: '#F9D761',
  },

  oilWell: {
    name: 'Oil well',
    description: 'Добыча нефти',
    ceil: ['oilMine'],
    nearCeil: ['all'],
    coast: 49350,
    product: 'oil',
    category: 'mining',
    title: {
      eng: 'Oil well',
      ru: 'Нефтяная вышка',
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
      eng: 'Oil refinery',
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
      eng: 'Petrochemical plant',
      ru: 'Нефтехим завод',
    },
    buttonColor: '#454758',
  },

  paperFactory: {
    name: 'Paper factory',
    description: 'Бумажный завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 47950,
    product: ['paper','cardboard'],
    raw: ['wood','glue'],
    category: 'factory',
    title: {
      eng: 'Paper factory',
      ru: 'Картонажная фабрика',
    },
    buttonColor: '#cbbab3',
  },

  glassFactory: {
    name: 'Glass factory',
    description: 'Стекольный завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 9800,
    product: ['glass'],
    raw: ['sand',],
    category: 'factory',
    title: {
      eng: 'Glass factory',
      ru: 'Стекольный завод',
    },
    buttonColor: '#b2c9cb',
  },

  cementFactory: {
    name: 'Cement factory',
    description: 'Цементный завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 31000,
    product: ['cement'],
    raw: ['sand','water'],
    category: 'factory',
    title: {
      eng: 'Cement factory',
      ru: 'Цементный завод',
    },
    buttonColor: '#aaaaaa',
  },

  buildingProductsFactory: {
    name: 'Building Products Factory',
    description: 'Завод строй материалов',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 78150,
    product: ['sheetSteel','buildingComponents'],
    raw: ['wood','cement','glass','steel'],
    category: 'factory',
    title: {
      eng: 'Building Products Factory',
      ru: 'Завод строй материалов',
    },
    buttonColor: '#7e5a5a',
  },

  jewelryFactory: {
    name: 'Jewelry Factory',
    description: 'ювелирный завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 141800,
    product: ['jewelry'],
    raw: ['gold'],
    category: 'factory',
    title: {
      eng: 'Jewelry Factory',
      ru: 'Ювелирный завод',
    },
    buttonColor: '#f5d948',
  },

  furnitureFactory: {
    name: 'Furniture Factory',
    description: 'мебельный завод',
    ceil: ['meadow', 'sand', 'steelMine', 'goldMine', 'oilMine'],
    nearCeil: ['all'],
    coast: 48900,
    product: ['furnitureWood','furniturePlastic'],
    raw: ['wood','plastic'],
    category: 'factory',
    title: {
      eng: 'Furniture Factory',
      ru: 'Мебельный завод',
    },
    buttonColor: '#797353',
  },
};
export {
  BUILDINGS
};
