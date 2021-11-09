import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';
import {
  resouresBase
} from '../resource/resource.js';

class City{
  constructor(properties){
    this.name = properties.name;
    this.position = properties.position;


    this.storage = this.createStorage();
    this.priceNotification = null;
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


  showPrice(resource){
    this.priceNotification = document.querySelector(`#${this.name}_priceNotification`);
    const price = this.getCurrentResourcePrice(resource.name);
    const qualityPrice = Math.round(price + price*((resource.quality*15)*0.01));

    this.priceNotification.innerHTML = '$'+qualityPrice;
  };


  updatePricePosition(){
    const priceDiv = this.priceNotification;

    const tempV = new THREE.Vector3(this.position.x, 0.5, this.position.z);

    tempV.project(MAIN.renderer.camera);

    // convert the normalized position to CSS coordinates
    const x = (tempV.x * .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
    const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

    // move the elem to that position
    priceDiv.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
  };

};





export {
  City
};
