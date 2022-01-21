
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








};
module.exports = factoriesConfig;
