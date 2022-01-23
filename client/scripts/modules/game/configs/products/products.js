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
  sand:{
    price:8000,
    sailSpeed:5,
    category:'raw',
    manufacture:['sandMine'],
    //где является ингредиентом
    ingrediend:['glass','concrete','ceramic'],
    //из чего производится
    raws: null,

    lang:{
      ru:'песок',
      eng:'sand',
    },

  },

  water:{
    price:15000,
    sailSpeed:6,
    category:'raw',

    manufacture:['waterStation'],
    ingrediend:['bottledWater','concrete','ceramic'],
    raws: null,

    lang:{
      ru:'вода',
      eng:'water',
    },

  },

  wood:{
    price:24000,
    sailSpeed:7,
    category:'raw',


    manufacture:['sawmill'],
    ingrediend:['paper','furniture','tools','cardboard'],
    raws: null,

    lang:{
      ru:'древесина',
      eng:'wood',
    },

  },

  steel:{
    price:43000,
    sailSpeed:8,
    category:'raw',

    manufacture:['steelMill'],
    ingrediend:['furniture','tools','metal'],
    raws: null,

    lang:{
      ru:'сталь',
      eng:'steel',
    },
  },

  gold:{
    price:89000,
    sailSpeed:9,
    category:'raw',

    manufacture:['goldMill'],
    ingrediend:['electricalComponents','jewelry'],
    raws: null,

    lang:{
      ru:'золото',
      eng:'gold',
    },
  },

  oil:{
    price:8000,
    sailSpeed:5,
    category:'raw',
    manufacture:['oilWell'],
    //где является ингредиентом
    ingrediend:['plastic','petrol','rubber','glue'],
    //из чего производится
    raws: null,

    lang:{
      ru:'нефть',
      eng:'oil',
    },

  },

  petrol:{
    price:8000,
    sailSpeed:5,
    category:'hardware',
    manufacture:['oilRefinery'],
    //где является ингредиентом
    ingrediend:null,
    //из чего производится
    raws: ['oil'],

    lang:{
      ru:'бензин',
      eng:'petrol',
    },

  },


};
export {
  PRODUCTS
};
