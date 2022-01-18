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
  },

  trucks : {
    //сколько грузовиков всего в игре
    count: 26,
    coast: 10000,
  },





  resources:{
    sand:{
      price:8000,
      sailSpeed:5,
      productionPrice:3000,
    },
    water:{
      price:15000,
      sailSpeed:6,
      productionPrice:7000,
    },
    wood:{
      price:24000,
      sailSpeed:7,
      productionPrice:11000,
    },
    steel:{
      price:43000,
      sailSpeed:8,
      productionPrice:20000,
    },
    gold:{
      price:89000,
      sailSpeed:9,
      productionPrice:40000,

    },


  },
};
module.exports = coasts;
