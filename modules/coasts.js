//antiCheat
const coasts = {
  buildings: {
    road:5000,
    bridge:7500,

    sawmill:19500,
    waterStation:12000,
    sandMine:7500,
    steelMill:34500,
  },

  trucks : {
    //сколько грузовиков всего в игре
    count: 20,
    coast: 10000,
  },





  resources:{
    wood:{
      price:24000,
      sailSpeed:7,
      productionPrice:11000,
    },
    water:{
      price:15000,
      sailSpeed:6,
      productionPrice:7000,
    },
    sand:{
      price:8000,
      sailSpeed:5,
      productionPrice:3000,
    },
    steel:{
      price:43000,
      sailSpeed:8,
      productionPrice:20000,
    },


  },
};
module.exports = coasts;
