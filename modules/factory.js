
const COASTS = require('./coasts.js');


const factoriesConfig = {
  sawmill: {
    mining:true,
    //минимум 4 из-за прокачки
    speed:4,
    storage:2,
    //полная цена производства
    price:COASTS.resources.wood.productionPrice,
    resource:'wood',
  },
};
module.exports = factoriesConfig;
