//antiCheat
const coasts = {
  buildings: {
    road:5000,
    bridge:7500,
    sawmill:19500,
    waterStation:12000,
    sandMine:7500,
    steelMill:34500,
    goldMill:73500,

    oilWell:7500,
    oilRefinery:7500,
  },

  trucks : {
    //сколько грузовиков всего в игре
    count: 26,
    coast: 10000,
  },





  products:{
    sand:{
      price:8000,
      sailSpeed:5,
      productionPrice:3000,
      raw:null,
    },
    water:{
      price:15000,
      sailSpeed:6,
      productionPrice:7000,
      raw:null,
    },
    wood:{
      price:24000,
      sailSpeed:7,
      productionPrice:11000,
      raw:null,
    },
    steel:{
      price:43000,
      sailSpeed:8,
      productionPrice:20000,
      raw:null,
    },
    gold:{
      price:89000,
      sailSpeed:9,
      productionPrice:40000,
      raw:null,
    },
    oil:{
      price:8000,
      sailSpeed:5,
      productionPrice:3000,
      raw:null,
    },

    petrol:{
      price:8000,
      sailSpeed:5,
      raw:['oil'],
    },


  },
};
module.exports = coasts;
