import {
  MAIN
} from '../../../../main.js';




/*категории продуктов*/
/*
  raw - сырье
  construction - стройматериалы
  hardware - хоз товары
*/

const PRODUCTS = {
  sand: {
    price: 8400,
    sailSpeed: 1,
    category: 'raw',
    manufacture: ['sandMine'],
    //где является ингредиентом
    ingrediend: ['glass', 'concrete', 'ceramic'],
    //из чего производится
    raws: null,

    lang: {
      ru: 'песок',
      eng: 'sand',
    },

  },

  water: {
    price: 12550,
    sailSpeed: 2,
    category: 'raw',

    manufacture: ['waterStation'],
    ingrediend: ['bottledWater', 'concrete', 'ceramic'],
    raws: null,

    lang: {
      ru: 'вода',
      eng: 'water',
    },

  },

  wood: {
    price: 17800,
    sailSpeed: 2,
    category: 'raw',


    manufacture: ['sawmill'],
    ingrediend: ['paper', 'furniture', 'tools', 'cardboard'],
    raws: null,

    lang: {
      ru: 'древесина',
      eng: 'wood',
    },

  },

  steel: {
    price: 27500,
    sailSpeed: 3,
    category: 'raw',

    manufacture: ['steelMill'],
    ingrediend: ['furniture', 'tools', 'metal'],
    raws: null,

    lang: {
      ru: 'сталь',
      eng: 'steel',
    },
  },

  oil: {
    price: 33000,
    sailSpeed: 5,
    category: 'raw',
    manufacture: ['oilWell'],
    //где является ингредиентом
    ingrediend: ['plastic', 'petrol', 'rubber', 'glue','dye'],
    //из чего производится
    raws: null,

    lang: {
      ru: 'нефть',
      eng: 'oil',
    },

  },

  gold: {
    price: 43500,
    sailSpeed: 6,
    category: 'raw',

    manufacture: ['goldMill'],
    ingrediend: ['electricalComponents', 'jewelry'],
    raws: null,

    lang: {
      ru: 'золото',
      eng: 'gold',
    },
  },

  petrol: {
    price: 18600,
    sailSpeed: 3,
    category: 'hardware',
    manufacture: ['oilRefinery'],
    //где является ингредиентом
    ingrediend: null,
    //из чего производится
    raws: ['oil'],

    lang: {
      ru: 'бензин',
      eng: 'petrol',
    },
  },

  glue: {
    price: 15800,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['petrochemicalPlant'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['oil'],

    lang: {
      ru: 'клей',
      eng: 'glue',
    },
  },

  dye: {
    price: 15300,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['petrochemicalPlant'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['oil'],

    lang: {
      ru: 'краситель',
      eng: 'dye',
    },
  },

  rubber: {
    price: 14800,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['petrochemicalPlant'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['oil'],

    lang: {
      ru: 'резина',
      eng: 'rubber',
    },
  },

  plastic: {
    price: 16300,
    sailSpeed: 6,
    category: 'hardware',
    manufacture: ['petrochemicalPlant'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['oil'],

    lang: {
      ru: 'пластик',
      eng: 'plastic',
    },
  },


  paper: {
    price: 15400,
    sailSpeed: 6,
    category: 'hardware',
    manufacture: ['paperFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['wood'],

    lang: {
      ru: 'бумага',
      eng: 'paper',
    },
  },

  cardboard: {
    price: 21000,
    sailSpeed: 6,
    category: 'hardware',
    manufacture: ['paperFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['wood','glue'],

    lang: {
      ru: 'картон',
      eng: 'cardboard',
    },
  },

  glass: {
    price: 4100,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['glassFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['sand'],

    lang: {
      ru: 'стекло',
      eng: 'glass',
    },
  },

  cement: {
    price: 13000,
    sailSpeed: 6,
    category: 'hardware',
    manufacture: ['cementFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['sand','water'],

    lang: {
      ru: 'цемент',
      eng: 'cement',
    },
  },

  buildingComponents: {
    price: 31200,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['buildingProductsFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['glass','wood','cement'],

    lang: {
      ru: 'строй материалы',
      eng: 'building materials',
    },
  },

  sheetSteel: {
    price: 24600,
    sailSpeed: 4,
    category: 'hardware',
    manufacture: ['buildingProductsFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['steel'],

    lang: {
      ru: 'листовая сталь',
      eng: 'sheet steel',
    },
  },

  jewelry: {
    price: 61300,
    sailSpeed: 7,
    category: 'hardware',
    manufacture: ['jewelryFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['gold'],

    lang: {
      ru: 'ювелирные украшения',
      eng: 'jewelry',
    },
  },

  furnitureWood: {
    price: 16700,
    sailSpeed: 5,
    category: 'hardware',
    manufacture: ['furnitureFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['wood'],

    lang: {
      ru: 'Деревянная мебель',
      eng: 'Wood furniture',
    },
  },

  furniturePlastic: {
    price: 22100,
    sailSpeed: 5,
    category: 'hardware',
    manufacture: ['furnitureFactory'],
    //где является ингредиентом
    ingrediend: [],
    //из чего производится
    raws: ['plastic'],

    lang: {
      ru: 'Пластиковая мебель',
      eng: 'Plastic furniture',
    },
  },



};
export {
  PRODUCTS
};
