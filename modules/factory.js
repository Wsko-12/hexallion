
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
  },

  waterStation: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:5,
    storage:2,
    //полная цена производства
    price:COASTS.resources.water.productionPrice,
    resource:'water',
  },

  sandMine: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:4,
    storage:2,
    //полная цена производства
    price:COASTS.resources.sand.productionPrice,
    resource:'sand',
  },

  steelMill: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:7,
    storage:2,
    //полная цена производства
    price:COASTS.resources.steel.productionPrice,
    resource:'steel',
  },
};
module.exports = factoriesConfig;
