import {
  MAIN
} from '../../../../main.js';

import {
  resouresBase
} from '../resource/resource.js';

class City{
  constructor(properties){
    this.name = properties.name;


    this.storage = this.createStorage();
  };
  createStorage(){
    const storage = {};

    for(let resource in resouresBase){
      const thisResource = resouresBase[resource];

      //касается только данного реесурса
      const resStore = {};

      //его линия прогресса
      resStore.line = [];
      for(let i = 0;i<thisResource.sailSpeed;i++){
        resStore.line.push(0);
      };

      //максимальная цена ресурса
      resStore.maxPrice = thisResource.price;



      //массив цен на данный этап ресурса
      resStore.prices = [];
      resStore.line.forEach((item, i) => {
        const discount = 1 - (i+1)/resStore.line.length;
        const price = Math.round(resStore.maxPrice - resStore.maxPrice*discount);
        if(price < 0){
          price = 0
        };
        resStore.prices[i] = price;
      });

      storage[resource] = resStore;
    };
    return storage;
  };

  getCurrentResourcePrice(resoure){
    const firstFullCeilIndex = this.storage[resoure].line.indexOf(1);
    if(firstFullCeilIndex === -1){
      return this.storage[resoure].maxPrice;
    }else if(firstFullCeilIndex === 0){
      return 0;
    }else{
      return this.storage[resoure].prices[firstFullCeilIndex - 1];
    };
  };

  turn(){
    for(let resourceStore in this.storage){
      const thisResourceStore = this.storage[resourceStore];
      thisResourceStore.line.pop();
      thisResourceStore.line.unshift(0);
    };
  };





};





export {
  City
};
