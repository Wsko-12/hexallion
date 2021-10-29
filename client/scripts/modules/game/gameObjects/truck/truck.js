import {
  MAIN
} from '../../../../main.js';

import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';


class Truck {
  constructor(properties){
    this.id = properties.id;
    this.player = properties.player;
    this.resource = null;
    this.place = {z:0,x:0};
    //сообщает, что можно ходить этим грузовиком
    this.ready = false;
    this.object3D = null;
    this.hitBoxMesh = null;
  };

  placeOnMap(indexes){
    this.place = indexes;
    const position = MAIN.game.functions.getScenePositionByCeilIndex(indexes);


    this.object3D = new THREE.Mesh(MAIN.game.scene.assets.geometries.truck.clone(),MAIN.game.scene.mainMaterial);

    this.object3D.position.set(position.x,position.y,position.z);
    MAIN.game.scene.trucksGroup.add(this.object3D);

    this.object3D.castShadow = true;
    this.object3D.receiveShadow = true;

    this.ready = true;
    if(this.player === MAIN.game.data.playerData.login){
      this.hitBoxMesh =  new THREE.Mesh(MAIN.game.scene.assets.geometries.truckHitBox.clone(),MAIN.game.scene.hitBoxMaterial);
      this.hitBoxMesh.position.set(position.x,position.y,position.z);
      MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);
      this.hitBoxMesh.userData.position = this.hitBoxMesh.position;
      const that = this;
      this.hitBoxMesh.userData.onClick = function(){
        that.showCard();
      };
      this.createNotification();
    };

  };

  showCard(){
    MAIN.interface.game.trucks.openCard(this);
    MAIN.interface.game.camera.moveCameraTo(this.hitBoxMesh.position);
  };

  createNotification(){
    //можно поменять их на спрайты
    if(this.notification){
      this.notification.remove();
    }
    const id = generateId('notification',6);
    const notification = `<div class="gameSceneNotification" id="${id}">!</div>`

    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd',notification);
    this.notification = document.querySelector(`#${id}`);
    const that = this;
    const onclickFunction = function(){
       that.showCard();
    };
    this.notification.onclick = onclickFunction;
    this.notification.ontouchstart = onclickFunction;
    //высылка уведомлений
  };

  updateNotificationPosition(){
    if(this.notification){
      const tempV = new THREE.Vector3(this.hitBoxMesh.position.x,0.2,this.hitBoxMesh.position.z);

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

  clearNotification(){
    if(this.notification){
      this.notification.remove();
      this.notification = null;
    };
  };

};
export{
  Truck
};
