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
    this.cardOpened = false;
  };

  placeOnMap(indexes){
    this.place = indexes;
    const position = MAIN.game.functions.getScenePositionByCeilIndex(indexes);


    this.object3D = new THREE.Mesh(MAIN.game.scene.assets.geometries.truck.clone(),MAIN.game.scene.mainMaterial);

    this.object3D.position.set(position.x,position.y,position.z);
    MAIN.game.scene.trucksGroup.add(this.object3D);
    MAIN.game.data.map[this.place.z][this.place.x].roadEmpty = true;
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




  turn(){
    this.ready = false;
    this.cardOpened = true;
    MAIN.interface.game.trucks.closeMenu();
    const value = Math.floor(1 + Math.random() * (6 + 1 - 1));
    const that = this;
    function diceAnimate(){
      document.querySelector('#truckDice').style.display = 'block';
      const diceDiv = document.querySelector('#truckDiceInner');
      diceDiv.style.transitionDuration = '0s';
      diceDiv.style.opacity = 1;

      let animateCount = 0;
      function animate(){
        that.clearNotification();
        animateCount++;
        diceDiv.style.top = -Math.round(Math.random()*5) * 100 + '%';
        if(animateCount < 10){
          setTimeout(animate,100);
        }else{
          //continue function
          that.clearNotification();
          diceDiv.style.top = -(value-1) * 100 + '%';
          setTimeout(function(){
            diceDiv.style.transitionDuration = '2s';
            diceDiv.style.opacity = 0.3;
          },100);
          // setTimeout(function(){
          //   document.querySelector('#truckDice').style.display = 'none';
          // },2000);


          //STOPED HERE
          MAIN.interface.dobleClickFunction.standard = false;
          MAIN.interface.dobleClickFunction.function = function(object3D){
            MAIN.game.functions.findPath(value,that,object3D.userData);
          };
        };
      };
      animate();
    };
    diceAnimate();
  };

};
export{
  Truck
};
