import {
  MAIN
} from '../../../../main.js';

import * as THREE from '../../../../../libs/ThreeJsLib/build/three.module.js';

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
    

    this.id = properties.id || generateId(`${properties.build.building}`,5);
    
    this.settingsSetted = false;
    this.category = MAIN.game.configs.buildings[properties.build.building].category;
    //просто подраздел ('sawmill', 'waterStation')
    this.type = properties.build.building;
    this.number = MAIN.gameData.commonData.factoriesCount[properties.build.building];
    this.fieldCeil = MAIN.gameData.map[properties.build.ceilIndex.z][properties.build.ceilIndex.x];

    this.product = MAIN.game.configs.buildings[properties.build.building].product;
    this.sector = properties.build.sector;
    this.position = this.fieldCeil.getSectorPosition(properties.build.sector);
    this.fieldCeil.sectorsData[properties.build.sector] = this;

    const fieldCeil = MAIN.gameData.map[properties.build.ceilIndex.z][properties.build.ceilIndex.x];


    this.notification = null;
    this.hitBoxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.4, 0.4, 0.4), MAIN.game.scene.hitBoxMaterial);
    this.hitBoxMesh.name = this.id + '_hitBox';
    this.hitBoxMesh.position.set(this.position.x, 0.2, this.position.z);
    this.hitBoxMesh.rotation.y = ((this.sector * (-60) - 30) * Math.PI / 180);
    this.hitBoxMesh.userData.position = this.position;
    this.hitBoxMesh.userData.onClick = function() {
      fieldCeil.sectorsData[properties.build.sector].onClick();
    };
    MAIN.game.scene.hitBoxGroup.add(this.hitBoxMesh);

    if (!this.settingsSetted) {
      this.createNotification();
    };

    this.paused = false;
    this.autosend = {
      add:function(parameters){
        const direction = {
          mode:parameters.mode,
          finalObject:parameters.finalObject || null,
          final:parameters.final || null,
        };
        this.list[parameters.product].directions.push(direction);
      },
      remove:function(parameters){
        // parameters ={
        //   product:factory.product,
        //   index:i,
        // }
        this.list[parameters.product].directions.splice(parameters.index,1);
        if(this.list[parameters.product].current >= this.list[parameters.product].directions.length){
          this.list[parameters.product].current = 0;
        };
      },
      // ????
      changeCurrent:function(parameters){
        // parameters ={
        //   product:factory.product,
        //   index:i,
        // }
        this.list[parameters.product].current = parameters.index;
      },
      list:null,
    };
  };

  onClick() {
    //происходит при клике на сектор этой фабрики
    //на хитбокс фабрики
    //и на всплывающее уведомление

    if(MAIN.tutorial.step === 'building_3'){
      MAIN.tutorial.factory_1();
    };
    MAIN.interface.game.factory.showMenu(this);
    MAIN.interface.game.camera.moveCameraTo(this.hitBoxMesh.position);
    if(MAIN.tutorial.step === 'steps_2'){
      MAIN.tutorial.factory_2();
    }
  };
  clearNotification() {
    if (this.notification) {
      this.notification.remove();
      this.notification = null;
    };
  };

  createNotification(type) {
    //можно поменять их на спрайты
    if (this.notification) {
      this.notification.remove();
    };

    const id = generateId('notification', 6);
    let notification = `<div class="factoryNotification" id="${id}"><span class="span-notification">!</span></div>`;

    if (type === 'resourceReady') {
      notification = `<div class="factoryNotification" id="${id}"><span class="span-notification">✓</span></div>`
    };

    if (type === 'storrageFull') {
      notification = `<div class="factoryNotification redNotification" id="${id}"><span class="span-notification">!</span></div>`;
    };



    document.querySelector('#sceneNotifications').insertAdjacentHTML('beforeEnd', notification);
    this.notification = document.querySelector(`#${id}`);
    const that = this;
    const onclickFunction = function() {
      if (!MAIN.interface.game.trucks.turningInterfase) {
        that.hitBoxMesh.userData.onClick();
      };
    };


    MAIN.interface.deleteTouches(this.notification);


    this.notification.onclick = onclickFunction;
    this.notification.ontouchstart = onclickFunction;
  };

  updateNotificationPosition() {
    if (this.notification) {
      const tempV = new THREE.Vector3(this.position.x, 0.2, this.position.z);

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


  applySettings(settings) {
    this.clearNotification();
    this.settingsSetted = true;
    this.settings = settings;


    if(this.category === 'mining'){
      this.autosend.list = {
        [this.product]:{
          current:0,
          directions:[],
        },
      };
    }else if(this.category === 'factory'){
      this.autosend.list = {};
      this.settings.products.forEach((product, i) => {
        this.autosend.list[product.name] = {
          current:0,
          directions:[],
        };
      });
    };
  };

  applyUpdates(updates) {
    this.settings.paused = updates.paused;
    this.settings.productLine = updates.productLine;
    this.settings.storage = updates.storage;
    this.settings.productSelected = updates.productSelected;
    this.settings.productInProcess = updates.productInProcess;

    if (this.category === 'factory') {
      for (let product in this.settings.rawStorage) {
        this.settings.rawStorage[product] = updates.rawStorage[product];
      };
    };
  };

  setProductSelected(product) {
    this.settings.productSelected = product;
    MAIN.interface.game.factory.updateFactoryMenu();
    if(MAIN.tutorial.step === 'factory_9' && product === 'paper'){
      MAIN.tutorial.delivery_1();
    };
    this.turn(true);
  };

  sendProduct(index, auto) {
    //factory interface -> showFactoryMenu -> factory.sendProduct(i);
    if (!auto) {
      //сначала проверяем есть ли грузовики
      //если есть, то проверяем есть ли свободный
      //если нет там и там то открываем меню грузовиков и передаем туда параметр загрузки грузовика
      // if (MAIN.game.data.commonData.turnBasedGame) {
      //   if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login) {
      //     MAIN.interface.game.factory.showFactoryError('turn');
      //     return;
      //   };
      // };

      if (this.fieldCeil.checkRoadEmpty()) {
        const truckOnMap = this.fieldCeil.roadEmpty;
        if (truckOnMap.place.x === this.fieldCeil.indexes.x && truckOnMap.place.z === this.fieldCeil.indexes.z) {
          MAIN.interface.game.factory.showFactoryError('roadEmpty');
          return;
        };
      };
      const truckList = MAIN.gameData.playerData.trucks;
      if (Object.keys(truckList).length === 0) {
        MAIN.interface.game.factory.showFactoryError('noTruck');
        return;
      };

      const freeTrucks = [];
      for (let truck in truckList) {
        if (truckList[truck].product === null || truckList[truck].product === 1) {
          freeTrucks.push(truckList[truck]);
        };
      };

      if (freeTrucks.length === 0) {
        MAIN.interface.game.factory.showFactoryError('noFreeTruck');
      } else {
        // const data = {
        //   gameID: MAIN.game.data.commonData.id,
        //   player: MAIN.game.data.playerData.login,
        //   factoryID: this.id,
        //   truckID: freeTrucks[0].id,
        //   auto: false,
        //   storageIndex: index,
        // };
        // MAIN.interface.game.factory.closeMenu();
        // MAIN.socket.emit('GAME_factory_sendProduct', data);

        
        freeTrucks[0].placeOnMap({
          autosend:false,
          product:this.settings.storage[index],
          positionIndexes:{z:this.fieldCeil.indexes.z,x:this.fieldCeil.indexes.x},
        });
        this.settings.storage[index] = null;
        MAIN.interface.game.factory.closeMenu();



      };
    } else {
      // auto = {
      //   fullPath:fullPath,
      //   mode:'route',
      //   truck:send.freeTruck,
      // }


      // if (MAIN.game.data.commonData.turnBasedGame) {
      //   if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login) {
      //     auto.truck.product = null;
      //     return;
      //   };
      // };


      // const data = {
      //   gameID: MAIN.game.data.commonData.id,
      //   player: MAIN.game.data.playerData.login,
      //   factoryID: this.id,
      //   truckID: auto.truck.id,
      //   storageIndex: index,
      // };
      // delete auto.truck;
      // data.auto = auto;
      // MAIN.socket.emit('GAME_factory_sendProduct', data);

      const product = this.settings.storage[index];
      this.settings.storage[index] = null;


      auto.truck.placeOnMap({
        autosend:auto,
        product:product,
        positionIndexes:{z:this.fieldCeil.indexes.z,x:this.fieldCeil.indexes.x},
      });


      MAIN.interface.game.factory.updateFactoryMenu();

      // console.log('here')
    };
  };

  sendRawProduct(product) {
    //factory interface -> showFactoryMenu -> factory.sendProduct(i);
    //сначала проверяем есть ли грузовики
    //если есть, то проверяем есть ли свободный
    //если нет там и там то открываем меню грузовиков и передаем туда параметр загрузки грузовика
    // if (MAIN.game.data.commonData.turnBasedGame) {
    //   if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login) {
    //     MAIN.interface.game.factory.showFactoryError('turn');
    //     return;
    //   };
    // };




    if (this.fieldCeil.checkRoadEmpty()) {
      MAIN.interface.game.factory.showFactoryError('roadEmpty');
      return;
    };
    const truckList = MAIN.gameData.playerData.trucks;
    if (Object.keys(truckList).length === 0) {
      MAIN.interface.game.factory.showFactoryError('noTruck');
      return;
    };

    const freeTrucks = [];
    for (let truck in truckList) {
      if (truckList[truck].product === null) {
        freeTrucks.push(truckList[truck]);
      };
    };

    if (freeTrucks.length === 0) {
      MAIN.interface.game.factory.showFactoryError('noFreeTruck');
    } else {
      // const data = {
      //   gameID: MAIN.game.data.commonData.id,
      //   player: MAIN.game.data.playerData.login,
      //   factoryID: this.id,
      //   truckID: freeTrucks[0].id,
      //   auto: false,
      //   product: product,
      // };
      // MAIN.interface.game.factory.closeMenu();
      // MAIN.socket.emit('GAME_factory_sendProduct_raw', data);

      freeTrucks[0].placeOnMap({
        autosend:false,
        product:this.settings.rawStorage[product],
        positionIndexes:{z:this.fieldCeil.indexes.z,x:this.fieldCeil.indexes.x},
      });
      this.settings.rawStorage[product] = null;
      MAIN.interface.game.factory.closeMenu();
    };
  };


  getAllProducts() {
    const products = [];
    if (this.settingsSetted) {
      if (this.settings.productInProcess) {
        products.push({
          name: this.settings.productInProcess.name,
          quality: this.settings.productInProcess.quality,
        });
      };

      this.settings.storage.forEach((prod, i) => {
        if (prod) {
          products.push({
            name: prod.name,
            quality: prod.quality,
          });
        };
      });

      if (this.category === 'factory') {
        if (this.settings.productInProcess) {
          //тк на перерабатывающих может производится сразу несколько ресурсов
          const productSettings = this.settings.products.find((prod) => {
            if (prod.name === this.settings.productInProcess.name) {
              return prod;
            };
          });
          for (let i = 0; i < ((productSettings.productionVolume + this.settings.volumePoints) - 1); i++) {
            products.push({
              name: this.settings.productInProcess.name,
              quality: this.settings.productInProcess.quality,
            });
          };
        };
        for (let prod in this.settings.rawStorage) {
          const thisProd = this.settings.rawStorage[prod];
          if (thisProd) {
            products.push({
              name: thisProd.name,
              quality: thisProd.quality,
            });
          };
        };
      };
      return products;
    } else {
      return [];
    };
  };


  receiveProduct(truck){
    this.settings.rawStorage[truck.product.name] = truck.product;
    truck.clear();
    this.turn(true);
    if(MAIN.tutorial.step === 'delivery_3'){
      MAIN.tutorial.delivery_4();
    };
  };

  turn(auto){
    if (!this.settingsSetted) {
      return;
    };
    if(this.category === 'mining'){
      if (this.settingsSetted) {
        if (this.paused) {
          // if (this.game.cityEconomy) {
          //   this.game.payToCities(Math.floor(this.stepPrice / 2));
          // };
          MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-Math.floor(this.settings.stepPrice / 2));
          MAIN.interface.game.balance.addBalanceMessage(`Maintenance ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -Math.floor(this.settings.stepPrice / 2));
          MAIN.game.functions.payToCities(this.settings.stepPrice/2);
          this.settings.productLine.forEach((item, i) => {
            this.settings.productLine[i] = 0;
          });
          return;
        };
        //если в storage есть место
        if (this.settings.storage.includes(null)) {
          if (!this.settings.productLine.includes(1)) {
            //если вообще не начато производство
            if (!this.settings.productInProcess) {
              this.settings.productInProcess = {
                name: this.settings.product,
                quality: this.settings.qualityPoints,
              };
            };
            // if (this.game.cityEconomy) {
            //   this.game.payToCities(this.stepPrice);
            // };
            MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-this.settings.stepPrice);
            MAIN.interface.game.balance.addBalanceMessage(`Production on ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -this.settings.stepPrice);
            MAIN.game.functions.payToCities(this.settings.stepPrice);
            this.settings.productLine[0] = 1;
          } else {
            //если производтсво кончилось
            if (this.settings.productLine[this.settings.productLine.length - 1] === 1) {
              const emptySpace = this.settings.storage.indexOf(null);
              if (emptySpace != -1) {
                this.settings.storage[emptySpace] = this.settings.productInProcess;
              };
              this.settings.productInProcess = null;

              if (this.settings.storage.includes(0)) {
                this.settings.productLine.unshift(this.settings.productLine.pop());
              } else {
                this.settings.productLine.forEach((item, i) => {
                  this.settings.productLine[i] = 0;
                });
              };


              this.turn();
              if(MAIN.tutorial.step === 'sell_1'){
                this.onClick();
              };
              if(MAIN.tutorial.step === 'delivery_1'){
                this.onClick();
              };
            } else {
              // if (this.game.cityEconomy) {
              //   this.game.payToCities(this.stepPrice);
              // };
              MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-this.settings.stepPrice);
              MAIN.interface.game.balance.addBalanceMessage(`Production on ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -this.settings.stepPrice);
              MAIN.game.functions.payToCities(this.settings.stepPrice);
              this.settings.productLine.unshift(this.settings.productLine.pop());
            };
          };
        } else {
          //в хранилище нет места
          // if (this.game.cityEconomy) {
          //   this.game.payToCities(Math.floor(this.stepPrice / 2));
          // };
          MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-Math.floor(this.settings.stepPrice / 2));
          MAIN.interface.game.balance.addBalanceMessage(`Maintenance ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -Math.floor(this.settings.stepPrice / 2));
          MAIN.game.functions.payToCities(this.settings.stepPrice/2);
          this.settings.productLine.forEach((item, i) => {
            this.settings.productLine[i] = 0;
          });
        };
      } else {
        //выслать уведомление по настройке фабрики
      };

    }else if(this.category === 'factory'){
            if(auto){
              if(this.settings.productInProcess){
                return;
              };
            };
            //если продукт выбран
            if (this.settings.productSelected) {
              if (this.paused) {
                // if (this.game.cityEconomy) {
                //   this.game.payToCities(this.downtimeCost);
                // };
                MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-this.settings.downtimeCost);
                MAIN.interface.game.balance.addBalanceMessage(`Maintenance ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -this.settings.downtimeCost);
                MAIN.game.functions.payToCities(this.settings.downtimeCost);
                this.settings.productLine.forEach((item, i) => {
                  this.settings.productLine[i] = 0;
                });
                return;
              };
              //если уже какой-то продукт производится
              if (this.settings.productInProcess) {
                //1. если это последний этап производства
                if (this.settings.productLine[this.settings.productLine.length - 1] === 1) {
                  //скидываем продукты на склад
                  //0. очищаем productLine
                  this.settings.productLine[this.settings.productLine.length - 1] = 0;
                  //1. ищем стандары продукта
                  const productConfigs = this.settings.products.find((product) => {
                    if (product.name === this.settings.productInProcess.name) {
                      return product;
                    };
                  });
      
                  //2. добавляем объем производства на фабрике к стандартному
                  let productionVolume = productConfigs.productionVolume + this.settings.volumePoints;
      
                  //3. и запихиваем клоны ресурса во все свободные места на складе
      
                  this.settings.storage.forEach((place, i) => {
                    if (place === null) {
                      if (productionVolume > 0) {
                        productionVolume--;
                        this.settings.storage[i] = {
                          name:this.settings.productInProcess.name,
                          quality:this.settings.productInProcess.quality,
                        };
                      };
                    };
                  });
      
                  //4. очищаем продукт в процессе
                  this.settings.productInProcess = null;
      
                  //5.запускаем функцию еще раз
                  this.turn();
                } else {
                  //проводим ход
                  this.settings.productLine.unshift(this.settings.productLine.pop());
                  //считаем, сколько денег должен
                  const productConfigs = this.settings.products.find((product) => {
                    if (product.name === this.settings.productInProcess.name) {
                      return product;
                    };
                  });
      
                  const productionPrice = Math.round(productConfigs.price - (productConfigs.price * (0.15 * this.settings.salaryPoints)));
                  const thisPay = Math.floor(productionPrice / (this.settings.stockSpeed - this.settings.speedPoints));
                  MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance - thisPay);
                  MAIN.interface.game.balance.addBalanceMessage(`Production on ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -thisPay);
                  MAIN.game.functions.payToCities(thisPay);
                };
              } else {
                //если не начато производство продукта
                //0. проверяем, есть ли вообще такой продукт на фабрике
                //0.1  находим желаемый продукт
                const productConfigs = this.settings.products.find((product) => {
                  if (product.name === this.settings.productSelected) {
                    return product;
                  };
                });
      
                //0.2 если undefined то выходим
                if (!productConfigs) {
                  return;
                };
      
                //1. проверяем, есть ли все сырье для этого продукта
                //1.2. смотрим есть ли на rawStorage нужные продукты
                //изначально ставим, что у нас есть все продукты (потому что из forEach return не срабатывает)
                let allProduct = true;
                productConfigs.raw.forEach((rawProductName, i) => {
                  //если хоть одного продукта не хватает
                  if (!this.settings.rawStorage[rawProductName]) {
                    allProduct = false;
                  };
                });
      
      
                //2. если все продукты есть
                if (allProduct) {
                  //2.1 создаем массив сырья, чтобы посчитать качество будущего продукта
                  const raw = [];
      
                  productConfigs.raw.forEach((rawProductName, i) => {
                    //2.4 добавляем в массив нужных продуктов
                    raw.push(this.settings.rawStorage[rawProductName]);
                    //2.3 удаляем его со склада
                    this.settings.rawStorage[rawProductName] = null;
                  });
      
                  //3. считаем качество будущего продукта
                  function calculateQuality() {
                    // let sum = 0;
                    // raw.forEach((product) => {
                    //   sum += product.quality;
                    // });
                    // return Math.floor(sum/raw.length);
      
                    const sum = raw.reduce(function(accumulator, currentValue) {
                      return accumulator + currentValue.quality
                    }, 0);
                    return Math.floor(sum / raw.length);
                  };
      
                  let productQuality = calculateQuality();
      
                  //4. создаем нужный продукт
                  const product = {
                    name: productConfigs.name,
                    quality: productQuality,
                  };
      
                  this.settings.productInProcess = product;
      
                  //5. начинаем производство
                  this.settings.productLine[0] = 1;
                };
              };
      
            } else {
              MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance-this.settings.downtimeCost);
              MAIN.interface.game.balance.addBalanceMessage(`Maintenance ${this.settings.name.charAt(0).toUpperCase() + this.settings.name.slice(1)}`, -this.settings.downtimeCost);
              MAIN.game.functions.payToCities(this.settings.downtimeCost);
            };

    };
    MAIN.interface.game.factory.updateFactoryMenu();
  };
};

export {
  Factory
};
