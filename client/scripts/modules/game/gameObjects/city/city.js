import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';

class City{
  constructor(properties){
    this.name = properties.name;
    this.position = properties.position;
    this.category = 'city';
    this.storage = this.createStorage();
    this.priceNotification = null;
    this.balance = properties.balance;
    this.fieldCeil = properties.fieldCeil;
  };
  createStorage(){
    const storage = {};

    for(let product in MAIN.game.configs.products){
      const thisProduct = MAIN.game.configs.products[product];

      //касается только данного реесурса
      const prodStore = {};

      //его линия прогресса
      prodStore.line = [];
      for(let i = 0;i<thisProduct.sailSpeed;i++){
        prodStore.line.push(0);
      };

      //максимальная цена ресурса
      prodStore.maxPrice = thisProduct.price;



      //массив цен на данный этап ресурса
      prodStore.prices = [];
      prodStore.line.forEach((item, i) => {
        //harder city price
        // const discount =(1 - ((i+1)/prodStore.line.length)) + (0.10 - 0.10 * (i+1)/prodStore.line.length);
        const discount = 1 - (i+1)/prodStore.line.length;

        let price = Math.round(prodStore.maxPrice - prodStore.maxPrice*discount);
        if(price < 0){
          price = 0
        };
        prodStore.prices[i] = price;
      });

      storage[product] = prodStore;
    };
    return storage;
  };

  getCurrentProductPrice(product){
    let price = 0;
    const firstFullCeilIndex = this.storage[product].line.indexOf(1);
    if(firstFullCeilIndex === -1){
      price = this.storage[product].prices[this.storage[product].prices.length - 1];
    }else if(firstFullCeilIndex === 0){
      return 0;
    }else{
      price = this.storage[product].prices[firstFullCeilIndex - 1];
    };
    if(this.balance != null){
      if(price >= this.balance){
        price = this.balance;
      };
    };
    return price;
  };


  turn(){
    for(let productStore in this.storage){
      const thisProductStore = this.storage[productStore];
      thisProductStore.line.pop();
      thisProductStore.line.unshift(0);
    };
  };


  // showPrice(product){
  //   this.priceNotification = document.querySelector(`#${this.name}_priceNotification`);
  //   const price = this.getCurrentProductPrice(product.name);
  //   const qualityPrice = Math.round(price + price*((product.quality*15)*0.01));
  //
  //   this.priceNotification.innerHTML = '$'+qualityPrice;
  // };


  // updatePricePosition(){
  //   const priceDiv = this.priceNotification;
  //
  //   const tempV = new THREE.Vector3(this.position.x, 0.5, this.position.z);
  //
  //   tempV.project(MAIN.renderer.camera);
  //
  //   // convert the normalized position to CSS coordinates
  //   const x = (tempV.x * .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
  //   const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;
  //
  //   // move the elem to that position
  //   priceDiv.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  // };

};





export {
  City
};
