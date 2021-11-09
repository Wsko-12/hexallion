import {
  MAIN
} from '../../../../main.js';

import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';


class Truck {
  constructor(properties) {
    this.id = properties.id;
    this.player = properties.player;
    this.truckNumber = properties.truckNumber;
    this.resource = null;
    this.place = {
      z: 0,
      x: 0
    };
    //сообщает, что можно ходить этим грузовиком
    this.ready = true;

    this.object3D = null;
    this.hitBoxMesh = null;
    this.cardOpened = false;
    this.onMap = false;
  };

  placeOnMap(indexes) {
    this.onMap = true;
    this.place = indexes;
    const position = MAIN.game.functions.getScenePositionByCeilIndex(indexes);


    this.object3D = new THREE.Mesh(MAIN.game.scene.assets.geometries.truck.clone(), MAIN.game.scene.mainMaterial);

    this.object3D.position.set(position.x, position.y, position.z);
    MAIN.game.scene.trucksGroup.add(this.object3D);
    MAIN.game.data.map[this.place.z][this.place.x].roadEmpty = true;
    this.object3D.castShadow = true;
    this.object3D.receiveShadow = true;

    this.ready = true;
    if (this.player === MAIN.game.data.playerData.login) {
      this.hitBoxMesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.truckHitBox.clone(), MAIN.game.scene.hitBoxMaterial);
      this.hitBoxMesh.position.set(position.x, position.y, position.z);
      MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);
      this.hitBoxMesh.userData.position = this.hitBoxMesh.position;
      const that = this;
      this.hitBoxMesh.userData.onClick = function() {
        that.showCard();
      };
      this.createNotification();
    };

  };

  showCard() {
    MAIN.interface.game.trucks.openCard(this);
    MAIN.interface.game.camera.moveCameraTo(this.hitBoxMesh.position);
  };

  createNotification() {
    //можно поменять их на спрайты
    if (this.notification) {
      this.notification.remove();
    }
    const id = generateId('notification', 6);
    const notification = `<div class="truckNotification" id="${id}">!</div>`

    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd', notification);
    this.notification = document.querySelector(`#${id}`);
    const that = this;
    const onclickFunction = function(){
      that.showCard();
    };
    MAIN.interface.deleteTouches(this.notification);

    this.notification.onclick = onclickFunction;
    this.notification.ontouchstart = onclickFunction;
    //высылка уведомлений
  };

  updateNotificationPosition() {
    if (this.notification) {
      const tempV = new THREE.Vector3(this.hitBoxMesh.position.x, 0.2, this.hitBoxMesh.position.z);

      // this.hitBoxMesh.updateWorldMatrix(true, false);
      // this.hitBoxMesh.getWorldPosition(tempV);

      // get the normalized screen coordinate of that position
      // x and y will be in the -1 to +1 range with x = -1 being
      // on the left and y = -1 being on the bottom
      tempV.project(MAIN.renderer.camera);

      // convert the normalized position to CSS coordinates
      const x = (tempV.x * .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
      const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

      // move the elem to that position
      this.notification.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    };
  };

  clearNotification() {
    if (this.notification) {
      this.notification.remove();
      this.notification = null;
    };
  };

  clear(){
    this.clearNotification();
    this.onMap = false;
    this.resource = null;
    this.place = {
      z: 0,
      x: 0
    };
    //сообщает, что можно ходить этим грузовиком
    this.ready = true;

    this.object3D.removeFromParent();
    this.hitBoxMesh.removeFromParent();

    this.object3D.geometry.dispose();
    this.hitBoxMesh.geometry.dispose();


    this.object3D = null;
    this.hitBoxMesh = null;
  };


  turn() {
    this.ready = false;
    this.cardOpened = true;
    MAIN.interface.game.trucks.closeMenu();
    const value = Math.floor(1 + Math.random() * (6 + 1 - 1));
    const that = this;

    function diceAnimate() {
      document.querySelector('#truckDice').style.display = 'block';
      const diceDiv = document.querySelector('#truckDiceInner');
      diceDiv.style.transitionDuration = '0s';
      diceDiv.style.opacity = 1;

      let animateCount = 0;

      function animate() {
        that.clearNotification();
        animateCount++;
        diceDiv.style.top = -Math.round(Math.random() * 5) * 100 + '%';
        if (animateCount < 10) {
          setTimeout(animate, 100);
        } else {
          //continue function
          that.clearNotification();
          diceDiv.style.top = -(value - 1) * 100 + '%';
          setTimeout(function() {
            diceDiv.style.transitionDuration = '2s';
            diceDiv.style.opacity = 0.3;
          }, 100);
          // setTimeout(function(){
          //   document.querySelector('#truckDice').style.display = 'none';
          // },2000);

          if (value < 6) {

            MAIN.interface.game.city.showCityPrices(that.resource);



            MAIN.interface.dobleClickFunction.standard = false;
            MAIN.interface.dobleClickFunction.function = function(object3D) {
              MAIN.game.functions.findPath(value, that, object3D.userData);
            };
          } else {
            setTimeout(function() {
              document.querySelector('#truckDice').style.display = 'none';
            }, 1500);
          };

        };
      };
      animate();
    };
    diceAnimate();
  };




  moveAlongWay(data) {
    //указывает, что последняя точка является городом, в который надо продать ресурс
    let lastPointIsNeededCity = false;
    let city = null;
    //указываем, что грузовик уехал
    MAIN.game.data.map[data.path[0].z][data.path[0].x].roadEmpty = false;
    //занимаем финальную точку
    const lastPoint = data.path[data.path.length - 1];
    MAIN.game.data.map[lastPoint.z][lastPoint.x].roadEmpty = true;


    //если финальная точка город
    if( MAIN.game.data.map[lastPoint.z][lastPoint.x].cityCeil){
      //освобождаем ее
      MAIN.game.data.map[lastPoint.z][lastPoint.x].roadEmpty = false;

      //если этот город тотт, что нужен был игроку
      if(data.playerMoveToCity){
        if(MAIN.game.data.map[lastPoint.z][lastPoint.x].type === data.playerMoveToCity){
          lastPointIsNeededCity = true;
        };
      };

    };


    this.place = {
      z: lastPoint.z,
      x: lastPoint.x
    };

    const that = this;

    function animate() {
      //индех, на какой из точек находится грузовик
      let pathIndex = 0;
      //индех, на каком прогрессе находится грузовик В КЛЕТКЕ
      let moveIndex = 0;
      let maxRadius = Math.sqrt(3);

      function move() {
        moveIndex += 1;
        if (pathIndex < data.path.length) {
          const centerCeilIndexes = data.path[pathIndex];
          const fieldCeil = MAIN.game.data.map[centerCeilIndexes.z][centerCeilIndexes.x];

          const position = {
            x: fieldCeil.position.x,
            y: fieldCeil.position.y,
            z: fieldCeil.position.z
          };
          //передвижение грузовика
          if (pathIndex === 0) {
            if (moveIndex > 5) {
              const radius = (moveIndex - 5) * (maxRadius / 10);
              const nextCenterCeilIndexes = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCenterCeilIndexes.z][nextCenterCeilIndexes.x];
              const angleIndex = fieldCeil.neighbours.indexOf(nextCeil);
              const angle = angleIndex * 60 - 60;
              position.x += Math.cos(angle * (Math.PI / 180)) * radius;
              position.z += Math.sin(angle * (Math.PI / 180)) * radius;
            };
          } else if (pathIndex === data.path.length - 1) {
            if (moveIndex < 5) {
              const radius = (5 - moveIndex) * (maxRadius / 10);
              const previousCenterCeilIndexes = data.path[pathIndex - 1];
              const previousCeil = MAIN.game.data.map[previousCenterCeilIndexes.z][previousCenterCeilIndexes.x];
              const angleIndex = fieldCeil.neighbours.indexOf(previousCeil);
              const angle = angleIndex * 60 - 60;
              position.x += Math.cos(angle * (Math.PI / 180)) * radius;
              position.z += Math.sin(angle * (Math.PI / 180)) * radius;
            };
          } else {
            if (moveIndex < 5) {
              const radius = (5 - moveIndex) * (maxRadius / 10);
              const previousCenterCeilIndexes = data.path[pathIndex - 1];
              const previousCeil = MAIN.game.data.map[previousCenterCeilIndexes.z][previousCenterCeilIndexes.x];
              const angleIndex = fieldCeil.neighbours.indexOf(previousCeil);
              const angle = angleIndex * 60 - 60;
              position.x += Math.cos(angle * (Math.PI / 180)) * radius;
              position.z += Math.sin(angle * (Math.PI / 180)) * radius;
            };
            if (moveIndex === 5) {
              position.x = fieldCeil.position.x;
              position.z = fieldCeil.position.z;
            };

            if (moveIndex > 5) {
              const radius = (moveIndex - 5) * (maxRadius / 10);
              const nextCenterCeilIndexes = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCenterCeilIndexes.z][nextCenterCeilIndexes.x];
              const angleIndex = fieldCeil.neighbours.indexOf(nextCeil);
              const angle = angleIndex * 60 - 60;
              position.x += Math.cos(angle * (Math.PI / 180)) * radius;
              position.z += Math.sin(angle * (Math.PI / 180)) * radius;
            };
          };

          // вращение грузовика по Y
          //сдесь походу можно только задавать этот "вектор" когда трак в середине клетки
          if (pathIndex === 0) {
            if (moveIndex > 5) {
              const nextCeilIndex = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCeilIndex.z][nextCeilIndex.x];
              const angleIndex = fieldCeil.neighbours.indexOf(nextCeil);
              const angle = angleIndex * -60;
              that.object3D.rotation.y = angle * (Math.PI / 180);
              if(that.hitBoxMesh){
                that.hitBoxMesh.rotation.y = angle * (Math.PI / 180);
              };
            }
          } else if (pathIndex === data.path.length - 1) {

          } else {
            if (moveIndex > 5) {
              const nextCeilIndex = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCeilIndex.z][nextCeilIndex.x];
              const angleIndex = fieldCeil.neighbours.indexOf(nextCeil);
              const angle = angleIndex * -60;
              that.object3D.rotation.y = angle * (Math.PI / 180);
              if(that.hitBoxMesh){
                that.hitBoxMesh.rotation.y = angle * (Math.PI / 180);
              };

            }
          };

          //позиция по Y
          let sectorName = null;
          if (pathIndex === 0) {
            if (moveIndex > 5) {
              const nextCeilIndex = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCeilIndex.z][nextCeilIndex.x];
              const sectorIndex = fieldCeil.neighbours.indexOf(nextCeil);

              sectorName = fieldCeil.sectors[sectorIndex];

            } else {
              if (fieldCeil.type === 'sea') {
                sectorName = 'bridgeStraight';
              } else {
                sectorName = 'road';
              };
            };
          } else if (pathIndex === data.path.length - 1) {

            if (moveIndex < 5) {
              const previousCenterCeilIndexes = data.path[pathIndex - 1];
              const previousCeil = MAIN.game.data.map[previousCenterCeilIndexes.z][previousCenterCeilIndexes.x];
              const sectorIndex = fieldCeil.neighbours.indexOf(previousCeil);
              sectorName = fieldCeil.sectors[sectorIndex];
            } else {
              if (fieldCeil.type === 'sea') {
                sectorName = 'bridgeStraight';
              } else {
                sectorName = 'road';
              };
            };

          } else {
            if (moveIndex < 5) {
              const previousCenterCeilIndexes = data.path[pathIndex - 1];
              const previousCeil = MAIN.game.data.map[previousCenterCeilIndexes.z][previousCenterCeilIndexes.x];
              const sectorIndex = fieldCeil.neighbours.indexOf(previousCeil);
              sectorName = fieldCeil.sectors[sectorIndex];
            };
            if (moveIndex === 5) {
              if (fieldCeil.type === 'sea') {
                sectorName = 'bridgeStraight';
              } else {
                sectorName = 'road';
              };
            };
            if (moveIndex > 5) {
              const nextCeilIndex = data.path[pathIndex + 1];
              const nextCeil = MAIN.game.data.map[nextCeilIndex.z][nextCeilIndex.x];
              const sectorIndex = fieldCeil.neighbours.indexOf(nextCeil);
              sectorName = fieldCeil.sectors[sectorIndex];
            };
          };

          if (sectorName === 'road') {
            position.y = 0;
          } else if (sectorName === 'bridgeStraight') {
            position.y = 0.2;
          } else {
            let shift = 0;
            if (moveIndex < 5) {
              shift = moveIndex / 5;
            } else {
              shift = Math.abs(10 - moveIndex) / 5
            };
            position.y = shift * 0.2;
          };

          //в принципе, наклон когда движется под горку можно не писать, так как его все равно не видно



          that.object3D.position.set(position.x, position.y, position.z);
          if(that.hitBoxMesh){
            that.hitBoxMesh.position.set(position.x, position.y, position.z);
          };



          if (moveIndex === 10) {
            moveIndex = 0;
            pathIndex++;
          };
          setTimeout(() => {
            move();
          }, 25)
        }else{
          if(lastPointIsNeededCity){

            if(that.player === MAIN.game.data.playerData.login){
              const sendData = {
                gameID:MAIN.game.data.commonData.id,
                player:that.player,
                truckID:that.id,
                city:data.playerMoveToCity,
              };
              MAIN.socket.emit('GAME_resource_sell',sendData)
            };
          };
        };
      };
      move();
    };
    animate();

  };
};
export {
  Truck
};
