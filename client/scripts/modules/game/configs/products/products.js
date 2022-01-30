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
    price: 3900,
    sailSpeed: 3,
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
    price: 9700,
    sailSpeed: 6,
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
    price: 17400,
    sailSpeed: 7,
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
    price: 27300,
    sailSpeed: 8,
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
    price: 21000,
    sailSpeed: 6,
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
    price: 59500,
    sailSpeed: 11,
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


};
export {
  PRODUCTS
};
