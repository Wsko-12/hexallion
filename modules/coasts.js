//antiCheat
const coasts = {
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
      sailSpeed: 1,
      productionPrice: 2400,
      raw: null,
    },
    water: {
      price: 12550,
      sailSpeed: 2,
      productionPrice: 5000,
      raw: null,
    },
    wood: {
      price: 17800,
      sailSpeed: 2,
      productionPrice: 8400,
      raw: null,
    },
    steel: {
      price: 27500,
      sailSpeed: 3,
      productionPrice: 15900,
      raw: null,
    },

    oil: {
      price: 33000,
      sailSpeed: 5,
      productionPrice: 18900,
      raw: null,
    },


    gold: {
      price: 43500,
      sailSpeed: 6,
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
module.exports = coasts;
