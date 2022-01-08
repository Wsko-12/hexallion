
const COASTS = require('./coasts.js');


const factoriesConfig = {
  sawmill: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:6,
    storage:2,
    //полная цена производства
    price:COASTS.resources.wood.productionPrice,
    resource:'wood',
    count:10,
  },

  waterStation: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:5,
    storage:2,
    //полная цена производства
    price:COASTS.resources.water.productionPrice,
    resource:'water',
    count:12,
  },

  sandMine: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:4,
    storage:2,
    //полная цена производства
    price:COASTS.resources.sand.productionPrice,
    resource:'sand',
    count:14,
  },

  steelMill: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:7,
    storage:2,
    //полная цена производства
    price:COASTS.resources.steel.productionPrice,
    resource:'steel',
    count:8,
  },

  goldMill: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:8,
    storage:2,
    //полная цена производства
    price:COASTS.resources.gold.productionPrice,
    resource:'gold',
    count:4,
  },
};
module.exports = factoriesConfig;
