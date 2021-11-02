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
    this.type = properties.building;
    this.fieldCeil = MAIN.game.data.map[properties.ceilIndex.z][properties.ceilIndex.x];
    this.settingsSetted = false;
    this.sector = properties.sector;
    this.position = this.fieldCeil.getSectorPosition(properties.sector);
    this.fieldCeil.sectorsData[properties.sector] = this;

    const fieldCeil = MAIN.game.data.map[properties.ceilIndex.z][properties.ceilIndex.x];


    this.notification = null;
    this.hitBoxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4,0.4,0.4),MAIN.game.scene.hitBoxMaterial);
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

  setSettings(){
    //интерфейс по настройке фабрики
    console.log('set settings',this);
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

  createNotification(){
    //можно поменять их на спрайты
    if(this.notification){
      this.notification.remove();
    }
    const id = generateId('notification',6);
    const notification = `<div class="factoryNotification" id="${id}">!</div>`

    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd',notification);
    this.notification = document.querySelector(`#${id}`);
    const onclickFunction = this.hitBoxMesh.userData.onClick;
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

  update(updates){

  };

  applySettings(settings){
    this.settingsSetted = true;
    this.settings = settings;
  };

  applyUpdates(updates){
    this.settings.productLine = updates.productLine;
    this.settings.storage = updates.storage;
    if(!this.settings.storage.includes(0)){
      if(this.notification === null){
        this.createNotification();
      };
    };
  };
};

export {
  Factory
};
