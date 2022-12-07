
const COASTS = {
  buildings: {
    road: 5000,
    bridge: 7500,

    sandMine: 12000,
    waterStation: 15100,
    sawmill: 14100,
    steelMill: 34800,
    oilWell: 49350,
    goldMill: 66200,


    oilRefinery: 64100,
    petrochemicalPlant:55875,
    paperFactory:47950,
    glassFactory:9800,
    cementFactory:31000,
    buildingProductsFactory:78150,
    jewelryFactory:141800,
    furnitureFactory:48900,



  },

  trucks: {
    //сколько грузовиков всего в игре
    count: 26,
    coast: 10000,
  },

  products: {
    sand: {
      price: 8400,
      sailSpeed: 75,
      productionPrice: 2400,
      raw: null,
    },
    water: {
      price: 12550,
      sailSpeed: 55,
      productionPrice: 5000,
      raw: null,
    },
    wood: {
      price: 17800,
      sailSpeed: 40,
      productionPrice: 8400,
      raw: null,
    },
    steel: {
      price: 27500,
      sailSpeed: 30,
      productionPrice: 15900,
      raw: null,
    },

    oil: {
      price: 33000,
      sailSpeed: 20,
      productionPrice: 18900,
      raw: null,
    },


    gold: {
      price: 43500,
      sailSpeed: 15,
      productionPrice: 26950,
      raw: null,
    },


    petrol: {
      price: 18600,
      sailSpeed: 3,
      raw: ['oil'],
    },

    glue:{
      price:15800,
      sailSpeed:4,
      raw:['oil']
    },

    dye:{
      price:15300,
      sailSpeed:4,
      raw:['oil']
    },

    rubber:{
      price:14800,
      sailSpeed:4,
      raw:['oil']
    },

    plastic:{
      price:16300,
      sailSpeed:6,
      raw:['oil']
    },

    paper:{
      price:15400,
      sailSpeed:6,
      raw:['wood']
    },

    cardboard:{
      price:21000,
      sailSpeed:6,
      raw:['glue']
    },


    glass:{
      price:4100,
      sailSpeed:4,
      raw:['sand']
    },

    cement:{
      price:13000,
      sailSpeed:6,
      raw:['water','sand']
    },
    sheetSteel:{
      price:24600,
      sailSpeed:5,
      raw:['steel']
    },
    buildingComponents:{
      price:31200,
      sailSpeed:5,
      raw:['wood','glass','cement'],
    },
    jewelry:{
      price:61300,
      sailSpeed:7,
      raw:['gold'],
    },
    furnitureWood:{
      price:16700,
      sailSpeed:5,
      raw:['wood',],
    },
    furniturePlastic:{
      price:22100,
      sailSpeed:5,
      raw:['plastic'],
    },



  },
};



const FACTORIES = {
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
    speed: 5,
    storage: 2,
    //полная цена производства
    price: COASTS.products.steel.productionPrice,
    product: 'steel',
    count: 8,
  },

  oilWell: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 6,
    storage: 2,
    //полная цена производства
    price: COASTS.products.oil.productionPrice,
    product: 'oil',
    count: 14,
  },

  goldMill: {
    category: 'mining',
    //минимум 4 из-за прокачки
    speed: 7,
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


  buildingProductsFactory:{
    category: 'factory',
    storage: 2,
    speed: 5,
    products: [
      {
        name: 'buildingComponents',
        //цена всего производства
        price: 11700,
        raw: ['wood','glass','cement'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'sheetSteel',
        //цена всего производства
        price: 9100,
        raw: ['steel'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 5000,
    count: 10,
  },

  jewelryFactory:{
    category: 'factory',
    storage: 2,
    speed: 8,
    products: [
      {
        name: 'jewelry',
        //цена всего производства
        price: 28000,
        raw: ['gold',],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 14000,
    count: 10,
  },

  furnitureFactory:{
    category: 'factory',
    storage: 2,
    speed: 5,
    products: [
      {
        name: 'furnitureWood',
        //цена всего производства
        price: 6700,
        raw: ['wood'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
      {
        name: 'furniturePlastic',
        //цена всего производства
        price: 11700,
        raw: ['plastic'],
        //сколько приозведется ресурса за раз
        productionVolume: 2,
      },
    ],
    //цена простоя
    downtimeCost: 4100,
    count: 10,
  },




};
export {FACTORIES}
