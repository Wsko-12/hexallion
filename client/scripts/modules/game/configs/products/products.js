import {
  MAIN
} from '../../../../main.js';




/*категории продуктов*/
/*
  raw - сырье
  construction - стройматериалы




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


};
export {
  PRODUCTS
};
