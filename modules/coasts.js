//antiCheat
const coasts = {
  buildings: {
    road: 5000,
    bridge: 7500,

    sandMine: 5900,
    waterStation: 11600,
    sawmill: 26100,
    steelMill: 39000,
    oilWell: 31500,
    goldMill: 89300,


    oilRefinery: 64100,
  },

  trucks: {
    //сколько грузовиков всего в игре
    count: 26,
    coast: 10000,
  },

  products: {
    sand: {
      price: 3900,
      sailSpeed: 3,
      productionPrice: 1700,
      raw: null,
    },
    water: {
      price: 9700,
      sailSpeed: 6,
      productionPrice: 4400,
      raw: null,
    },
    wood: {
      price: 17400,
      sailSpeed: 7,
      productionPrice: 8000,
      raw: null,
    },
    steel: {
      price: 27300,
      sailSpeed: 8,
      productionPrice: 12700,
      raw: null,
    },

    oil: {
      price: 21000,
      sailSpeed: 7,
      productionPrice: 9300,
      raw: null,
    },


    gold: {
      price: 59500,
      sailSpeed: 11,
      productionPrice: 28000,
      raw: null,
    },


    petrol: {
      price: 18600,
      sailSpeed: 3,
      raw: ['oil'],
    },

  },
};
module.exports = coasts;
