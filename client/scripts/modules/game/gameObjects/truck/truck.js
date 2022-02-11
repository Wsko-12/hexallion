import {
  MAIN
} from '../../../../main.js';

import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';


class Truck {
  constructor(properties) {
    this.id = properties.id;
    this.player = properties.player;
    this.truckNumber = properties.truckNumber;
    this.product = null;

    this.place = {
      z: 0,
      x: 0
    };
    //сообщает, что можно ходить этим грузовиком
    this.ready = true;
    //bug fix с двойной отправкой
    this.sended = false;

    this.object3D = null;

    this.hitBoxMesh = null;
    this.cardOpened = false;
    this.onMap = false;



    this.autosend = false;
    // MAIN.game.functions.autosending.turn();
  };

  placeOnMap(data) {

    // const data = {
    //   autosend: false
    //   game: "Game_FraPKW"
    //   id: "Truck_SIkSCq"
    //   player: "p_CvWHlz"
    //   positionIndexes: {x: 5, z: 7}
    //   product: {
    //             factory: "waterStation_2cfZyI"
    //             game: "Game_FraPKW"
    //             id: "Product_water_HfUnX2"
    //             name: "water"
    //             player: "p_CvWHlz"
    //             quality: 0
    //             truck: "Truck_SIkSCq"
    //           }
    //   truckNumber: 26
    // }
    this.onMap = true;
    this.sended = false;
    this.place = data.positionIndexes;
    this.product = data.product;
    this.autosend = data.autosend;

    const position = MAIN.game.functions.getScenePositionByCeilIndex(data.positionIndexes);

    // this.object3D = new THREE.Mesh(MAIN.game.scene.assets.geometries[`truck_${this.product.name}`].clone(), MAIN.game.scene.mainMaterial);
    this.object3D = new THREE.Mesh(MAIN.game.scene.assets.geometries[`truck_water`].clone(), MAIN.game.scene.mainMaterial);

    this.object3D.name = this.id;

    this.object3D.position.set(position.x, position.y, position.z);
    MAIN.game.scene.trucksGroup.add(this.object3D);
    MAIN.game.data.map[this.place.z][this.place.x].roadEmpty = this;
    this.object3D.castShadow = true;
    this.object3D.receiveShadow = true;

    this.ready = true;
    if (this.player === MAIN.game.data.playerData.login) {
      this.hitBoxMesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.truckHitBox.clone(), MAIN.game.scene.hitBoxMaterial);
      this.hitBoxMesh.name = this.id + '_hitBox';
      this.hitBoxMesh.position.set(position.x, position.y, position.z);
      MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);
      this.hitBoxMesh.userData.position = this.hitBoxMesh.position;
      const that = this;
      this.hitBoxMesh.userData.onClick = function() {
        that.showCard();
      };
      if (!this.autosend) {
        this.createNotification();
      };
    };



    if (data.player === MAIN.game.data.playerData.login) {
      if (!this.autosend) {
        this.turn();
      } else {
        this.autosendTurn();
      };
    };

  };

  showCard() {
    MAIN.interface.game.trucks.openCard(this);
    MAIN.interface.game.camera.moveCameraTo(this.hitBoxMesh.position);
  };

  async autosendTurn() {
    this.ready = false;
    // MAIN.game.functions.autosending.turn();
    const sendData = {
      game: MAIN.game.data.commonData.id,
      player: MAIN.game.data.playerData.login,
      truck: this.id,
      product: this.product.id,
      autosend: this.autosend,
    };
    const value = Math.floor(1 + Math.random() * (6 + 1 - 1));

    /* c объездом пробок */
    if (value < 6) {
      const lastPoint = this.autosend.fullPath[this.autosend.fullPath.length - 1];
      const finalCeil = MAIN.game.data.map[lastPoint.z][lastPoint.x];
      const startCeil = MAIN.game.data.map[this.place.z][this.place.x];
      let finalObject;
      if (finalCeil.cityCeil) {
        finalObject = finalCeil.city;
      } else {
        finalCeil.sectorsData.forEach((sector, i) => {
          if (sector) {
            if (sector.id === this.autosend.finalObject) {
              finalObject = sector;
            };
          };
        });
      };

      const pathData = {
        autosend: true,
        finish: finalCeil,
        start: startCeil,
        value: null,
        dontCheckTrafficJam: false,
        finalObject: finalObject,
      };




      MAIN.game.functions.pathFinder(pathData).then((path) => {
        if (path) {
          const pathIndexes = [];
          path.forEach((ceil, i) => {
            pathIndexes.push(ceil.indexes);
          });
          this.autosend.lastValue = value;
          this.autosend.cuttedPath = MAIN.game.functions.cutPath(pathIndexes, value);
          sendData.path = this.autosend.cuttedPath;

          const lastPointFullPathIndexes = sendData.autosend.fullPath[sendData.autosend.fullPath.length - 1];
          const lastPointCuttedPathIndexes = this.autosend.cuttedPath[this.autosend.cuttedPath.length - 1];


          if (lastPointFullPathIndexes.x === lastPointCuttedPathIndexes.x && lastPointFullPathIndexes.z === lastPointCuttedPathIndexes.z) {
            sendData.autosend.finished = true;
          };
          MAIN.socket.emit('GAME_truck_send', sendData);
        } else {
          //тут выкинуть предупреждение, что грузовик застрял
          console.log('truck stuck');
        };
      });
    };
    /* ///c объездом пробок */


    /* без объезда пробок */
    // this.autosend.lastValue = value;
    // if (value < 6) {
    //   this.autosend.cuttedPath = MAIN.game.functions.cutPath(this.autosend.fullPath, value);
    //   sendData.path = this.autosend.cuttedPath;
    //   if (sendData.autosend.fullPath.length === this.autosend.cuttedPath.length) {
    //     sendData.autosend.finished = true;
    //   };
    //   this.autosend.fullPath = this.autosend.fullPath.slice(this.autosend.cuttedPath.length - 1);
    //
    //   MAIN.socket.emit('GAME_truck_send', sendData);
    // } else {
    //   // MAIN.game.functions.autosending.turn();
    // };

    /* /// без объезда пробок */
  };

  createNotification() {
    //можно поменять их на спрайты
    if (this.notification) {
      this.notification.remove();
    }
    const id = generateId('notification', 6);
    const notification = `<div class="truckNotification" id="${id}"><span class="span-notification">!</span></div>`

    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd', notification);
    this.notification = document.querySelector(`#${id}`);
    const that = this;
    const onclickFunction = function() {
      if (!MAIN.interface.game.trucks.turningInterfase) {
        that.showCard();
      };
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

  clear() {
    this.clearNotification();
    this.onMap = false;
    this.product = null;
    this.autosend = null;
    //clear map for  destroy truck button
    if (MAIN.game.data.map[this.place.z]) {
      if (MAIN.game.data.map[this.place.z][this.place.x]) {
        MAIN.game.data.map[this.place.z][this.place.x].roadEmpty = false;
      };
    };



    this.place = {
      z: null,
      x: null
    };
    //сообщает, что можно ходить этим грузовиком
    this.ready = true;
    this.sended = false;



    //bug fix
    if (this.object3D) {
      this.object3D.removeFromParent();
      this.object3D.geometry.dispose();
    };

    if (this.hitBoxMesh) {
      this.hitBoxMesh.removeFromParent();
      this.hitBoxMesh.geometry.dispose();
    };

    this.object3D = null;
    this.hitBoxMesh = null;
    // MAIN.game.functions.autosending.turn();
  };

  destroyRequest() {
    const data = {
      gameID: MAIN.game.data.commonData.id,
      player: this.player,
      truckID: this.id,
    };
    MAIN.socket.emit('GAME_truck_destroy', data);
  };

  turn() {
    if (this.ready) {
      this.ready = false;
      MAIN.interface.game.trucks.turningInterfase = true;
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

            if (value < 6) {
              const data = {
                truck: that,
                value: value,
              };
              MAIN.interface.game.path.showWhereProductIsNeeded(data);
              document.querySelector('#truckCancelButton').style.display = 'flex';

              MAIN.interface.dobleClickFunction.standard = false;
              MAIN.interface.dobleClickFunction.function = async function(object3D) {
                const pathData = {
                  start: MAIN.game.data.map[that.place.z][that.place.x],
                  finish: object3D.userData,
                  value: value,
                  autosend: false,
                  finalObject: object3D.userData.cityCeil ? object3D.userData.city : null,
                  truck: that,
                  dontCheckTrafficJam: false,
                };
                MAIN.interface.game.path.hideButtons();

                MAIN.game.functions.pathFinder(pathData).then((result) => {
                  if (result) {
                    pathData.path = result;
                    MAIN.game.scene.path.show(pathData).then((data) => {
                      data.cuttedPath = MAIN.game.functions.cutPath(data.path, data.value);
                      MAIN.interface.game.path.showActionsButton(data);
                    });
                  } else {
                    MAIN.game.scene.path.clear();
                  };
                });
              };
            } else {
              MAIN.interface.game.trucks.turningInterfase = false;
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

  };

  moveAlongWay(data) {
    // const sendData = {
    //   autosend:false,
    //   truck: this.id,
    //   path: data.path,
    //   sell:data.sell,
    //   delivery:data.delivery,
    // };


    //указываем, что грузовик уехал
    MAIN.game.data.map[data.path[0].z][data.path[0].x].roadEmpty = false;
    //занимаем финальную точку
    const lastPoint = data.path[data.path.length - 1];
    //если грузовик ЕДЕТ на последнюю точку
    if (!data.sell && !data.delivery) {
      if (!MAIN.game.data.map[lastPoint.z][lastPoint.x].cityCeil) {
        MAIN.game.data.map[lastPoint.z][lastPoint.x].roadEmpty = this;
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
              if (that.hitBoxMesh) {
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
              if (that.hitBoxMesh) {
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

          if (sectorName === 'road' || fieldCeil.type === 'Westown' || fieldCeil.type === 'Northfield' || fieldCeil.type === 'Southcity') {
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


          if (that.object3D) {
            that.object3D.position.set(position.x, position.y, position.z);
          };
          if (that.hitBoxMesh) {
            that.hitBoxMesh.position.set(position.x, position.y, position.z);
          };



          if (moveIndex === 10) {
            moveIndex = 0;
            pathIndex++;
          };
          setTimeout(() => {
            if (that.object3D) {
              move();
            };
          }, 25);
        } else {

          // if(data.selling){
          //   if(that.player === MAIN.game.data.playerData.login){
          //     const sendData = {
          //       gameID:MAIN.game.data.commonData.id,
          //       player:that.player,
          //       truckID:that.id,
          //       city:data.city,
          //     };
          //     MAIN.socket.emit('GAME_product_sell',sendData)
          //   };
          // };
          if (that.player === MAIN.game.data.playerData.login) {
            if (that.autosend) {
              if (that.autosend.finished) {
                if (that.autosend.sell) {
                  const sendData = {
                    game: MAIN.game.data.commonData.id,
                    player: that.player,
                    truck: that.id,
                    city: that.autosend.finalObject,
                    product: that.product.id,
                  };
                  MAIN.socket.emit('GAME_product_sell', sendData);
                };
                if (that.autosend.delivery) {
                  const sendData = {
                    game: MAIN.game.data.commonData.id,
                    player: that.player,
                    truck: that.id,
                    factory: that.autosend.finalObject,
                    product: that.product.id,
                  };
                  MAIN.socket.emit('GAME_product_delivery', sendData);
                };
              };
              return;
            };
            if (data.sell) {
              const sendData = {
                game: MAIN.game.data.commonData.id,
                player: that.player,
                truck: that.id,
                city: data.finalObject,
                product: that.product.id,
              };
              MAIN.socket.emit('GAME_product_sell', sendData);
            };
            if (data.delivery) {
              const sendData = {
                game: MAIN.game.data.commonData.id,
                player: that.player,
                truck: that.id,
                factory: data.finalObject,
                product: that.product.id,
              };
              MAIN.socket.emit('GAME_product_delivery', sendData);
            };

          };

        };
      };
      move();
    };
    animate();






  };

  getProductPriceData() {
    if (this.product) {
      if (this.product != 1) {
        return [{
          name: this.product.name,
          quality: this.product.quality,
        }];
      };
    };
    return [];
  };

};
export {
  Truck
};
