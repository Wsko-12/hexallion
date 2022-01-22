import {
  MAIN
} from '../../../../main.js';
import {
  CONFIGS
} from './factoriesConfig.js';

import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';

//Этот модуль создает фабрику, с которой игрок будет взаимодействовать

class Factory {
  constructor(properties) {
    // properties = {
    //   id: "sawmill_dVXiJM"
    //   building: "sawmill"
    //   ceilIndex: {z: 5, x: 5}
    //
    //   sector: 5
    // }

    this.id = properties.id;
    this.settingsSetted = false;
    this.category = properties.category;
    //просто подраздел ('sawmill', 'waterStation')
    this.type = properties.building;
    this.number = properties.number;
    this.fieldCeil = MAIN.game.data.map[properties.ceilIndex.z][properties.ceilIndex.x];

    this.product = properties.product;
    this.sector = properties.sector;
    this.position = this.fieldCeil.getSectorPosition(properties.sector);
    this.fieldCeil.sectorsData[properties.sector] = this;

    const fieldCeil = MAIN.game.data.map[properties.ceilIndex.z][properties.ceilIndex.x];


    this.notification = null;
    this.hitBoxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4,0.4,0.4),MAIN.game.scene.hitBoxMaterial);
    this.hitBoxMesh.name = this.id + '_hitBox';
    this.hitBoxMesh.position.set(  this.position.x,  0.2,  this.position.z);
    this.hitBoxMesh.rotation.y = ((this.sector*(-60) - 30) * Math.PI/180);
    this.hitBoxMesh.userData.position = this.position;
    this.hitBoxMesh.userData.onClick = function(){
      fieldCeil.sectorsData[properties.sector].onClick();
    };
    MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);

    if(!this.settingsSetted){
      this.createNotification();
    };






  };

  onClick(){
    //происходит при клике на сектор этой фабрики
    //на хитбокс фабрики
    //и на всплывающее уведомление
    MAIN.interface.game.factory.showMenu(this);
    MAIN.interface.game.camera.moveCameraTo(this.hitBoxMesh.position);
  };
  clearNotification(){
    if(this.notification){
      this.notification.remove();
      this.notification = null;
    };
  };

  createNotification(type){
    //можно поменять их на спрайты
    if(this.notification){
      this.notification.remove();
    };

    const id = generateId('notification',6);
    let notification = `<div class="factoryNotification" id="${id}"><span class="span-notification">!</span></div>`;

    if(type === 'resourceReady'){
      notification = `<div class="factoryNotification" id="${id}"><span class="span-notification">✓</span></div>`
    };

    if(type === 'storrageFull'){
      notification = `<div class="factoryNotification redNotification" id="${id}"><span class="span-notification">!</span></div>`;
    };



    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd',notification);
    this.notification = document.querySelector(`#${id}`);
    const that = this;
    const onclickFunction = function(){
      if(!MAIN.interface.game.trucks.turningInterfase){
        that.hitBoxMesh.userData.onClick();
      };
    };


    MAIN.interface.deleteTouches(this.notification);


    this.notification.onclick = onclickFunction;
    this.notification.ontouchstart = onclickFunction;
  };

  updateNotificationPosition(){
    if(this.notification){
      const tempV = new THREE.Vector3(this.position.x,0.2,this.position.z);

      // this.hitBoxMesh.updateWorldMatrix(true, false);
      // this.hitBoxMesh.getWorldPosition(tempV);

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.project(MAIN.renderer.camera);

      // convert the normalized position to CSS coordinates
      const x = (tempV.x *  .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
      const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

      // move the elem to that position
      this.notification.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    };
  };


  applySettings(settings){
    this.settingsSetted = true;
    this.settings = settings;
    // console.log(this)
  };

  applyUpdates(updates){
    if(this.category === 'mining'){
      this.settings.productLine = updates.productLine;
      this.settings.storage = updates.storage;

      if(!this.settings.storage.includes(0)){
          this.createNotification('storrageFull');
          return;
      };


      if(this.settings.storage.includes(1)){
        if(this.notification === null){
          this.createNotification('resourceReady');
        };
      };
    };

    if(this.category === 'factory'){
      
    };
  };
};

export {
  Factory
};
