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
      this.sendNotification();

      this.hitBoxMesh =  new THREE.Mesh(MAIN.game.scene.assets.geometries.truckHitBox.clone(),MAIN.game.scene.hitBoxMaterial);
      this.hitBoxMesh.position.set(position.x,position.y,position.z);
      MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);
      this.hitBoxMesh.userData.position = this.hitBoxMesh.position;
      this.hitBoxMesh.userData.onClick = this.showCard;


    };

  };

  showCard(){
    console.log('show truck card',this);
  };

  sendNotification(){
      console.log('send truck notification',this);
  };


};
export{
  Truck
};
