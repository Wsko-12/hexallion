import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';

class City {
  constructor(properties) {
    this.name = properties.name;
    this.position = properties.position;
    this.category = 'city';
    this.storage = this.createStorage();
    this.priceNotification = null;
    this.balance = properties.balance;
    this.fieldCeil = properties.fieldCeil;
  };
  createStorage() {
    const storage = {};

    for (let product in MAIN.game.configs.products) {
      const thisProduct = MAIN.game.configs.products[product];
      const prodStore = {
        price:thisProduct.price,
        fullness:0,
        speed:thisProduct.sailSpeed,
      };
      storage[product] = prodStore;

      // //касается только данного реесурса
      // const prodStore = {};
      //
      // //его линия прогресса
      // prodStore.line = [];
      // for (let i = 0; i < thisProduct.sailSpeed; i++) {
      //   prodStore.line.push(0);
      // };
      //
      // //максимальная цена ресурса
      // prodStore.maxPrice = thisProduct.price;
      //
      //
      //
      // //массив цен на данный этап ресурса
      // prodStore.prices = [];
      // prodStore.line.forEach((item, i) => {
      //   //harder city price
      //   // const discount =(1 - ((i+1)/prodStore.line.length)) + (0.10 - 0.10 * (i+1)/prodStore.line.length);
      //   const discount = 1 - (i + 1) / prodStore.line.length;
      //
      //   let price = Math.round(prodStore.maxPrice - prodStore.maxPrice * discount);
      //   if (price < 0) {
      //     price = 0
      //   };
      //   prodStore.prices[i] = price;
      // });
      //
      // storage[product] = prodStore;
    };
    return storage;
  };

  getCurrentProductPrice(product) {
    if(product.name){
      //если передаем объект
      const storage = this.storage[product.name];

      const discount = Math.round((storage.price*storage.fullness)/100);
      const price = storage.price - discount;
      const qualityBonus = Math.round(price * ((product.quality * 15)/100));
      const finalPrice = price+qualityBonus;
      if (this.balance != null) {
        if (finalPrice >= this.balance) {
          return this.balance;
        };
      };
      return finalPrice;
    }else{
      //если передали строку
      const storage = this.storage[product];
      const discount = Math.round((storage.price*storage.fullness)/100);
      const price = storage.price - discount;
      if (this.balance != null) {
        if (price >= this.balance) {
          return this.balance;
        };
      };
      return price;
    };
    // let price = 0;
    // const firstFullCeilIndex = this.storage[product].line.indexOf(1);
    // if (firstFullCeilIndex === -1) {
    //   price = this.storage[product].prices[this.storage[product].prices.length - 1];
    // } else if (firstFullCeilIndex === 0) {
    //   return 0;
    // } else {
    //   price = this.storage[product].prices[firstFullCeilIndex - 1];
    // };
    // if (this.balance != null) {
    //   if (price >= this.balance) {
    //     price = this.balance;
    //   };
    // };
    // return price;
  };

  applyUpdates(data){
    this.storage = data.storage;
    this.balance = data.balance;
    MAIN.interface.game.city.openMenu();

  };

};





export {
  City
};
