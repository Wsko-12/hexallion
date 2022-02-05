const COASTS = require('./coasts.js');


const factoriesConfig = {
  sandMine: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 4,
    storage: 2,
    //полная цена производства
    price: COASTS.products.sand.productionPrice,
    product: 'sand',
    count: 14,
  },

  waterStation: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 5,
    storage: 2,
    //полная цена производства
    price: COASTS.products.water.productionPrice,
    product: 'water',
    count: 12,
  },


  sawmill: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 6,
    storage: 2,
    //полная цена производства
    price: COASTS.products.wood.productionPrice,
    product: 'wood',
    count: 10,
  },


  steelMill: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 7,
    storage: 2,
    //полная цена производства
    price: COASTS.products.steel.productionPrice,
    product: 'steel',
    count: 8,
  },

  oilWell: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 4,
    storage: 2,
    //полная цена производства
    price: COASTS.products.oil.productionPrice,
    product: 'oil',
    count: 14,
  },

  goldMill: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 8,
    storage: 2,
    //полная цена производства
    price: COASTS.products.gold.productionPrice,
    product: 'gold',
    count: 4,
  },








  oilRefinery: {
    category: 'factory',
    storage: 2,
    speed: 5,
    products: [{
      name: 'petrol',
      //цена всего производства
      price: 11700,
      raw: ['oil'],
      //сколько приозведется ресурса за раз
      productionVolume: 2,
    }, ],
    //цена простоя
    downtimeCost: 6000,
    count: 10,

  },


  petrochemicalPlant: {
    category: 'factory',
    storage: 2,
    speed: 5,
    products: [
      {
        name: 'plastic',
        //цена всего производства
        price: 9300,
        raw: ['oil'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'glue',
        //цена всего производства
        price: 8900,
        raw: ['oil'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'dye',
        //цена всего производства
        price: 8500,
        raw: ['oil'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'rubber',
        //цена всего производства
        price: 8100,
        raw: ['oil'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 6000,
    count: 10,

  },

  paperFactory: {
    category: 'factory',
    storage: 2,
    speed: 5,
    products: [
      {
        name: 'paper',
        //цена всего производства
        price: 5400,
        raw: ['wood'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'cardboard',
        //цена всего производства
        price: 3500,
        raw: ['wood','glue'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 2500,
    count: 10,
  },

  glassFactory: {
    category: 'factory',
    storage: 2,
    speed: 4,
    products: [
      {
        name: 'glass',
        //цена всего производства
        price: 1700,
        raw: ['sand'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 850,
    count: 10,
  },

  cementFactory: {
    category: 'factory',
    storage: 2,
    speed: 4,
    products: [
      {
        name: 'cement',
        //цена всего производства
        price: 5300,
        raw: ['sand','water'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 850,
    count: 10,
  },








};
module.exports = factoriesConfig;
