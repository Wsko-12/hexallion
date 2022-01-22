
const COASTS = require('./coasts.js');


const factoriesConfig = {
  sawmill: {
    category:'mining',
    //минимум 4 из-за прокачки
    speed:6,
    storage:2,
    //полная цена производства
    price:COASTS.products.wood.productionPrice,
    product:'wood',
    count:10,
  },

  waterStation: {
    category:'mining',
    //минимум 4 из-за прокачки
    speed:5,
    storage:2,
    //полная цена производства
    price:COASTS.products.water.productionPrice,
    product:'water',
    count:12,
  },

  sandMine: {
    category:'mining',
    //минимум 4 из-за прокачки
    speed:4,
    storage:2,
    //полная цена производства
    price:COASTS.products.sand.productionPrice,
    product:'sand',
    count:14,
  },

  steelMill: {
    category:'mining',
    //минимум 4 из-за прокачки
    speed:7,
    storage:2,
    //полная цена производства
    price:COASTS.products.steel.productionPrice,
    product:'steel',
    count:8,
  },

  goldMill: {
    category:'mining',
    //минимум 4 из-за прокачки
    speed:8,
    storage:2,
    //полная цена производства
    price:COASTS.products.gold.productionPrice,
    product:'gold',
    count:4,
  },

  oilWell:{
    category:'mining',
    //минимум 4 из-за прокачки
    speed:4,
    storage:2,
    //полная цена производства
    price:COASTS.products.oil.productionPrice,
    product:'oil',
    count:14,
  },






  oilRefinery:{
    category:'factory',
    storage:3,
    speed:5,
    products:[
      {
        name:'plastic',
        price:24000,
        raw:['wood'], //!!!!!! ЗАМЕНИТЬ НА OIL
        //сколько приозведется ресурса за раз
        productionVolume:2,
      }
    ],
    //цена простоя
    downtimeCost:12000,
    count:10,

  },








};
module.exports = factoriesConfig;
