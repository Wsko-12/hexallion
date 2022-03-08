/*
 * В этом модуле описаны функции происходящие во время игры
 */


import {
  MAIN
} from '../../../main.js';
import {
  Factory
} from '../gameObjects/factory/factory.js';

import {
  Truck
} from '../gameObjects/truck/truck.js';





const FUNCTIONS = {
  applyBuilding(data) {

    const ceil = MAIN.gameData.map[data.build.ceilIndex.z][data.build.ceilIndex.x];
    if (ceil.sectors[data.build.sector] === null) {
      ceil.buildOnSector(data.build.sector, data.build.building, data.player);
    };
  },

  turn(){
    MAIN.interface.game.turn.makeTimer();
    //до сих пор не работает на перерабатывающих фабриках
    for(let factory in MAIN.gameData.playerData.factories){
      const thisFactory = MAIN.gameData.playerData.factories[factory];
      thisFactory.turn();
    };
    for(let truck in MAIN.gameData.playerData.trucks){
      const thisTruck = MAIN.gameData.playerData.trucks[truck];
        thisTruck.ready = true;
        thisTruck.sended = false;
        if (thisTruck.autosend) {
          thisTruck.autosendTurn();
        } else {
          thisTruck.inAutosend = false;
          if (thisTruck.onMap) {
            if (!thisTruck.cardOpened) {
              thisTruck.createNotification();
            } else {
              thisTruck.hitBoxMesh.userData.onClick();
            };
          };
        };
        if (thisTruck.product === 1) {
          thisTruck.clear();
        };
    };
    MAIN.interface.game.path.updateCityPrise();

    for(let city in MAIN.gameData.cities){
      const thisCity = MAIN.gameData.cities[city];
      thisCity.turn();
    };
    MAIN.interface.game.city.openMenu();
    

  },


  payToCities(value){
    const averageValue = Math.floor(value / 3);
    for (let city in MAIN.gameData.cities) {
      const thisCity = MAIN.gameData.cities[city];
      thisCity.balance += averageValue;
    };
  },

  endTurn() {
    this.turn();
  },

  buildFactory(configs) {
    //происходит, когда игрок строит себе фабрику
    // trigger socket.js   MAIN.socket.on('GAME_buildFactory')
    /*
      data = {
        building: "sawmill"
        ceilIndex: {z: 5, x: 5}
        id: "sawmill_dVXiJM"
        sector: 5
      }
    */
    const factory = new Factory(configs);
    MAIN.gameData.playerData.factories[factory.id] = factory;
  },

  applyTruckPurchase(data) {
    //происходит, когда любой игрок покупает грузовик
    // trigger socket.js   MAIN.socket.on('GAME_truck_playerBoughtTruck')

    /*
    data = {
      player:data.player,
      truckID:truck.id,
      trucksCount:game.trucks.count,
    };
    */

    //если это restore game, то тамм не будет truckID, а будет data.id,
    const properties = {
      player: data.player,
      id: data.truckID || data.id,
      truckNumber: data.truckNumber,
    };


    const truck = new Truck(properties);

    MAIN.gameData.commonData.trucks.all[truck.id] = truck;

    if (data.player === MAIN.gameData.playerData.login) {
      MAIN.gameData.playerData.trucks[truck.id] = truck;


      //подразумевается, что он все еще в меню, поэтому делаем реопен
      //если это restore game, то тамм не будет truckID, а будет data.id,
      if(data.truckID){
        MAIN.interface.game.trucks.openMenu();
      };
    };
    return truck;
  },




  getScenePositionByCeilIndex(indexes) {
    const RADIUS = 1;
    const ROUNDS = 5;
    const position = {
      x: 0,
      y: 0,
      z: 0,
    }
    //строим по оси z
    if (indexes.z % 2) {
      //для нечетных по z
      position.z = (RADIUS + RADIUS / 2) * indexes.z;
    } else {
      //для четных  по z
      position.z = (RADIUS + RADIUS / 2) * indexes.z;
    }
    //строим левый край всей карты
    position.x += 0.86602540378 * RADIUS * Math.abs(indexes.z - ROUNDS);

    //выстраиваем их по x
    position.x += 0.86602540378 * RADIUS * 2 * indexes.x;

    //центрируем всю карту по x
    position.x -= 0.86602540378 * RADIUS * 2 * ROUNDS;

    //центрируем всю карту по z
    position.z -= (RADIUS + RADIUS / 2) * ROUNDS;

    return position;
  },


  pathFinder: async function(data) {
    if (data.dontCheckTrafficJam === undefined) {
      data.dontCheckTrafficJam = true;
    };
    // в truck js и в interface path.js(с иконок)
    // data = {
    //   autosend: false
    //   finalObject: City {name: 'Southcity', position: {…}, storage: {…}, priceNotification: null, fieldCeil: FieldCeil}
    //   finish: FieldCeil {type: 'Southcity', position: {…}, hitBox: Mesh, meshRotation: 4.1887902047863905, indexes: {…}, …}
    //   start: FieldCeil {type: 'sand', position: {…}, hitBox: Mesh, meshRotation: 3.141592653589793, indexes: {…}, …}
    //   truck: Truck {id: 'Truck_uECnpm', player: 'p_a1Ha0b', truckNumber: 26, product: {…}, place: {…}, …}
    //   value: 2
    //   checkTrafficJam:
    // };
    const pathPromise = new Promise((resPath, reject) => {
      // setTimeout(()=>{
      //   resolvePath(data);
      // },2000);

      //массив всех путей
      const paths = [];
      //если найдет дорогу, по которой еще можно поехать
      let anotherWayIsPossible = false;


      //если на конечной точке нет дороги или нет финального объекта
      if (data.finish.centralRoad || data.finalObject) {
        // если стоит в одной и той же клетке
        if (data.finalObject) {
          if (data.finalObject.fieldCeil === data.start) {
            resPath([data.start]);
            return;
          };
        };
        findFirstPath().then((result) => {
          if (result) {
            findMorePaths().then((resultedPaths) => {
              choseShortestPath(resultedPaths).then((shorterPath) => {
                resPath(shorterPath);
              });
            });
          };
        });

        async function findFirstPath() {
          const firstPathPromise = new Promise((resFirstPath, reject) => {
            const path = [];
            const checked = [];
            async function searcher(ceil) {
              let minDistanceToFinish = {
                neighbour: null,
                distance: 1000,
              };
              path.push(ceil);
              checked.push(ceil);

              const nextPathCeils = [];


              //ищем следующую клетку
              ceil.neighbours.forEach((neighbour, i) => {
                if (neighbour) { //если не  null
                  //смотрим, не проверяли ли мы ее уже (надо для возврата)
                  if (checked.indexOf(neighbour) === -1) {
                    if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                      if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                        //если она не занята грузовиком
                        if (!neighbour.checkRoadEmpty()|| data.dontCheckTrafficJam) {
                          if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                            //если к соседу проложена дорога
                            const index = neighbour.neighbours.indexOf(ceil);
                            if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                              //если от соседа проложена дорога
                              const distance = neighbour.getDistanceToCeil(data.finish);
                              //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
                              if (distance < minDistanceToFinish.distance) {
                                minDistanceToFinish.neighbour = neighbour;
                                minDistanceToFinish.distance = distance;
                              };
                            };
                          };
                          //если она не занята грузовиком
                        };
                      };
                    };
                  };
                };
              });


              //смотрим какую клетку мы нашли
              if (minDistanceToFinish.neighbour === null) {
                //если ничего не нашли, значит путь прерван и нужно возвращаться назад

                //удаляем ее из массива
                //и вкидываем, что ее уже проверили
                path.pop();
                checked.push(ceil);

                //если в path есть еще клетки,
                if (path.length > 0) {
                  //перепроверяем опять с предыдущей клетки
                  if (path[path.length - 1] === ceil) {
                    path.pop();
                  };
                  if (path.length > 0) {
                    resFirstPath(searcher(path[path.length - 1]));
                  } else {
                    //????? если больше ничего нет, то сразу выкидываем что нет пути
                    resPath(false);
                  };
                } else {
                  //????? если больше ничего нет, то сразу выкидываем что нет пути
                  resPath(false);
                };
              } else {
                //если все же нашли следующую подходящую клетку
                if (minDistanceToFinish.distance === 0) {
                  path.push(minDistanceToFinish.neighbour);
                  paths.push({
                    finished: true,
                    path: [...path],
                  });
                  resFirstPath(path);
                } else {
                  //кидаем в алгоритм следующую клетку
                  resFirstPath(searcher(minDistanceToFinish.neighbour));
                };
              };
            };
            searcher(data.start);
          });
          return firstPathPromise;
        };


        const otherRoads = [];
        let lastOtherRoadLength = 0;
        async function findMorePaths() {
          const otherPathPromise = new Promise((resOtherPath, reject) => {
            const path = [];
            const checked = [];
            async function searcher(ceil) {
              let minDistanceToFinish = {
                neighbour: null,
                distance: 1000,
              };
              path.push(ceil);
              checked.push(ceil);


              const nextPathCeils = [];
              ceil.neighbours.forEach((neighbour, i) => {
                if (neighbour) { //если не  null
                  //смотрим, не проверяли ли мы ее уже (надо для возврата)
                  if (checked.indexOf(neighbour) === -1) {
                    if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                      if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                        if (!neighbour.checkRoadEmpty() || data.dontCheckTrafficJam) { //она не занята грузовиком
                          if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                            //если к соседу проложена дорога
                            const index = neighbour.neighbours.indexOf(ceil);
                            if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                              //если от соседа проложена дорога
                              paths.forEach((pathObj, i) => {
                                // проверяем у этой клетки индекс в этих путях
                                const currentCeilIndex = pathObj.path.indexOf(ceil);
                                //смотрим следующую клеткту в путях
                                if (currentCeilIndex != -1) {
                                  if (pathObj.path[currentCeilIndex + 1]) {
                                    //если клетка не та, что уже проверена, то скидываем в возможные дороги
                                    if (pathObj.path[currentCeilIndex + 1] != neighbour) {
                                      if (otherRoads.indexOf(neighbour) === -1) {
                                        otherRoads.push(neighbour);
                                      };
                                    };
                                  };
                                };
                              });
                            };
                          };
                        };
                      };
                    };
                  };
                };
              });


              //если другие дороги найдены
              if (otherRoads.length != lastOtherRoadLength) {
                anotherWayIsPossible = true;
                lastOtherRoadLength = otherRoads.length;
                otherRoads.forEach((neighbour, i) => {
                  const distance = neighbour.getDistanceToCeil(data.finish);
                  //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
                  if (distance < minDistanceToFinish.distance) {
                    minDistanceToFinish.neighbour = neighbour;
                    minDistanceToFinish.distance = distance;
                  };
                });
                resOtherPath(paths);
              } else {
                anotherWayIsPossible = false;
                //если других дорог нет, то берем такие как уже было
                ceil.neighbours.forEach((neighbour, i) => {
                  if (neighbour) { //если не  null
                    //смотрим, не проверяли ли мы ее уже (надо для возврата)
                    if (checked.indexOf(neighbour) === -1) {
                      if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                        if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                          //если она не занята грузовиком
                          if (!neighbour.checkRoadEmpty()) {
                            if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                              //если к соседу проложена дорога
                              const index = neighbour.neighbours.indexOf(ceil);
                              if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                                //если от соседа проложена дорога
                                const distance = neighbour.getDistanceToCeil(data.finish);
                                //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
                                if (distance < minDistanceToFinish.distance) {
                                  minDistanceToFinish.neighbour = neighbour;
                                  minDistanceToFinish.distance = distance;
                                };
                              };
                            };
                            //если она не занята грузовиком
                          };
                        };
                      };
                    };
                  };
                });
              };

              if (ceil.neighbours.indexOf(minDistanceToFinish.neighbour) === -1) {
                minDistanceToFinish.neighbour = null;
              };

              //идем дальше, смотрим какую клетку мы нашли
              if (minDistanceToFinish.neighbour === null) {
                //если ничего не нашли, значит путь прерван и нужно возвращаться назад

                //вкидываем в возможные пути
                paths.push({
                  finished: false,
                  path: [...path]
                });

                //удаляем ее из массива
                path.pop();

                //и вкидываем, что ее уже проверили
                checked.push(ceil);

                //если в path есть еще клетки,
                if (path.length > 0) {
                  //перепроверяем опять с предыдущей клетки
                  if (path[path.length - 1] === ceil) {
                    path.pop();
                  };
                  if (path.length > 0) {
                    searcher(path[path.length - 1]);
                    return;
                  } else {
                    // MAIN.interface.game.path.showNotification(fieldCeil.position);
                    //bugFix
                    //если мы ищем дополнительный, то точно уже есть основной финишный
                    findMorePaths();
                    return;
                  };
                } else {
                  // MAIN.interface.game.path.showNotification(fieldCeil.position);
                  //bugFix
                  //если мы ищем дополнительный, то точно уже есть основной финишный
                  findMorePaths();
                  return;
                };
              } else {
                //если все же нашли следующую подходящую клетку
                if (minDistanceToFinish.distance === 0) {
                  setTimeout(() => {
                    path.push(minDistanceToFinish.neighbour);
                    // MAIN.game.scene.testMesh.position.set(minDistanceToFinish.neighbour.position.x,minDistanceToFinish.neighbour.position.y,minDistanceToFinish.neighbour.position.z);
                    paths.push({
                      finished: true,
                      path: [...path],
                    });
                    //если есть еще дороги, то чекаем еще раз
                    if (anotherWayIsPossible) {
                      findMorePaths();
                      return;
                    } else {
                      //Нашли все возможные пути
                      resOtherPath(paths);
                    };
                  });
                } else {
                  //кидаем в алгоритм следующую клетку
                  // setTimeout(() => {
                  searcher(minDistanceToFinish.neighbour);
                  return;
                  // });
                };
              };
            };
            setTimeout(() => {
              //Maximum call stack size resolve
              searcher(data.start);

            })
          });
          return otherPathPromise;
        };


        function choseShortestPath(allPaths) {
          const chorterPathPromise = new Promise((resShorterPath, reject) => {
            let shortest = {
              path: null,
              steps: 1000,
            };
            //bugFix
            //надо почистить в массиве повтор точек
            //он берется если пути стоят как равносторонний треугольник из 6 точек и truck стоит в основании его посередине
            //    c
            //  .
            // .  t  p
            // с - конечная точка
            // t - truck
            // p - название точки
            // алгоритм сначала идет в p
            //возвращается в t и дублирует ее (хз почему)
            allPaths.forEach((path, i) => {
              if (path.finished) {
                path.path.forEach((point, i) => {
                  if (path.path[i + 1]) {
                    if (path.path[i] === path.path[i + 1]) {
                      path.path.splice(i, 1);
                    };
                  };
                });
              };
            });

            allPaths.forEach((path, i) => {
              if (path.finished) {
                if (path.path.length < shortest.steps) {
                  shortest.path = path.path;
                  shortest.steps = path.path.length;
                };
              };
            });
            resShorterPath(shortest.path);
          });

          return chorterPathPromise;
        };
      } else {
        if (data.finalObject) {
          if (data.fieldCeil === data.start) {
            resPath([]);
          };
        };
        resPath(false);
      };

    });
    return pathPromise;
  },



  //нужно потому, что в фаиндере убрал проверку на занятостью грузовиком
  cutPath(path, value) {
    const cutted = [];
    for (let i = 0; i < path.length; i++) {
      if (i != 0) {
        //при отправке вручную
        if (path[i].type) {
          if (path[i].checkRoadEmpty()) {
            break;
          };
        } else {
          const indexes = path[i]
          //при автоматической
          if (MAIN.game.data.map[indexes.z]) {
            if (MAIN.game.data.map[indexes.z][indexes.x]) {
              if (MAIN.game.data.map[indexes.z][indexes.x].checkRoadEmpty()) {
                break;
              };
            };
          };
        };
      };
      if (i > value) {
        break;
      };
      cutted.push(path[i])
    };
    return cutted;
  },



  autosending: {
    lastFactory:null,
    inProgress:false,
    factories:[],
    inProgressCounter:0,

    turn: async function() {

      const that = this;
      function repeat(){
        setTimeout(()=>{
          that.inProgress = false;
          that.turn();
        },500);
      };
      if (MAIN.game.data.commonData.turnBasedGame) {
        if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login || MAIN.game.data.commonData.turnsPaused) {
          return;
        };
      };
      if(this.inProgress){
        this.inProgressCounter++;
        if(this.inProgressCounter >= 2){
          this.inProgress = false;
          this.inProgressCounter = 0;
        };
        return;
      };
      this.inProgressCounter = 0;
      this.inProgress = true;


      const playerData = MAIN.game.data.playerData;
      //сначала смотрим есть ли свободные грузовики
      let freeTruck = null;

      for (let truck in playerData.trucks) {
        const thisTruck = playerData.trucks[truck];
        if (thisTruck.product === null) {
          freeTruck = thisTruck;
        };
      };
      if(!freeTruck){
        repeat();
        return;
      };


      //ищем фабрику
      this.factories = Object.keys(playerData.factories);
      const lastFactoryIndex = this.lastFactory ? this.factories.indexOf(this.lastFactory.id) : 0;
      let factoryToSend = null;
      function checkFactory(factory){
        //смотрим, какие продукты есть на фабрике
        if(!factory.settingsSetted){
          return false;
        };

        for(let i = 0;i<factory.settings.storage.length;i++){
          const product = factory.settings.storage[i];
          //если есть какой-то продукт, то проверяем, есть ли для него автосенд
          if(product){
            if(factory.autosend.list[product.name].directions.length){
              const sendData = {
                factory:factory,
                product:product,
                productIndex:i,
                direction:factory.autosend.list[product.name].directions[factory.autosend.list[product.name].current],
                status:null,
              };
              return sendData;
              break;
            };
          };
        };


      };
      //идем по циклу от последней фабрики
      for(let i = lastFactoryIndex+1;i<this.factories.length;i++){
        if(playerData.factories[this.factories[i]]){
          const result = checkFactory(playerData.factories[this.factories[i]]);
          if(result){
            this.lastFactory = playerData.factories[this.factories[i]];
            factoryToSend = result;
            break;
          };
        }else{
          break;
        };
      };

      // если такую фабрику не нашли, то циклим еще раз, но с нуля, потому что там цикл замнулся
      if(!factoryToSend){
        for(let i = 0;i<this.factories.length;i++){
          const result = checkFactory(playerData.factories[this.factories[i]]);
          if(result){
            this.lastFactory = playerData.factories[this.factories[i]];
            factoryToSend = result;
            break;
          };
        };
      };

      //если и сейчас не нашли, то в репит
      if(!factoryToSend){
        repeat();
        return;
      };


      //если дошли до сюда, значит, что фабрика найдена.
      //Надо проверить, можно ли с нее выслать
      if(factoryToSend.factory.fieldCeil.checkRoadEmpty()){
        repeat();
        return;
      };

      if (factoryToSend.direction.mode === 'price') {
        const product = factoryToSend.product.name;
        const prices = [];
        for (let city in MAIN.game.data.cities) {
          const thisCity = MAIN.game.data.cities[city];
          prices.push({
            city: thisCity,
            price: thisCity.getCurrentProductPrice(product),
          })
        };

        async function findPaths() {
          let index = -1;
          const prom = new Promise((res) => {
            async function check() {
              index++;
              const prom_2 = new Promise((resolve, reject) => {
                if (index < prices.length) {
                  const pathData = {
                    autosend: true,
                    finalObject: prices[index].city,
                    finish: prices[index].city.fieldCeil,
                    start: factoryToSend.factory.fieldCeil,
                    factory: factoryToSend.factory,
                    value: null,
                    dontCheckTrafficJam: true,
                  };
                  MAIN.game.functions.pathFinder(pathData).then((path) => {
                    prices[index].path = path;
                    check();
                  });
                } else {
                  res(true);
                };
              });
              return prom_2
            };
            check();
          });
          return prom;
        };

        const results = await findPaths();
        if(results){
          //сначала в конец скидываем тех, у кого нет пути
          prices.sort(function(a, b) {
            // a должно быть равным b
            if (a.path) return -1;
            return 0;
          });
          //удаляем тех, у кого нет пути
          prices.forEach((direction, i) => {
            if (!direction.path) {
              prices.splice(i);
            };
          });

          //оставшихся сортируем по цене(приоритет), а потом по пути
          if (prices.length > 0) {
            prices.sort(function(a, b) {
              if (a.price > b.price) {
                return -1;
              };
              if (a.price < b.price) {
                return 1;
              };
              // a должно быть равным b

              if (a.path.length > b.path.length) {
                return 1;
              };
              if (a.path.length < b.path.length) {
                return -1;
              };
              return 0;
            });
            //и так, тут мы нашли, что можно поехать
            factoryToSend.status = {
              path:prices[0].path,
              mode:'price',
              finalObject:prices[0].city,
            };
          } else {
            repeat();
            return;
          };
        };
      }else if(factoryToSend.direction.mode === 'route'){
        const pathData = {
          autosend: true,
          finalObject: factoryToSend.direction.finalObject,
          finish: factoryToSend.direction.final,
          start: factoryToSend.factory.fieldCeil,
          factory: factoryToSend.factory,
          value: null,
          dontCheckTrafficJam: true,
        };
        const route = await MAIN.game.functions.pathFinder(pathData);
        if(route){
          factoryToSend.status = {
            path:route,
            mode:'route',
            finalObject:factoryToSend.direction.finalObject,
          };
        }else{
          repeat();
          return;
        };
      };

      //на этом этапе в status должны залететь данные
      // если не залетели, то значит не найдет конечный маршрут и репит
      if(!factoryToSend.status){
        repeat();
        return;
      };

      //высылаем грузовик
      const fullPath = [];
      factoryToSend.status.path.forEach((ceil, i) => {
        fullPath.push(ceil.indexes);
      });
      const autosendDataForTruck = {
        fullPath: fullPath,
        mode: 'route',
        truck: freeTruck,
      };

      if (factoryToSend.status.finalObject.category === 'city') {
        autosendDataForTruck.sell = true;
        autosendDataForTruck.finalObject = factoryToSend.status.finalObject.name;
      } else if (factoryToSend.status.finalObject.category === 'factory') {
        autosendDataForTruck.delivery = true;
        autosendDataForTruck.finalObject = factoryToSend.status.finalObject.id;
      };

      if (freeTruck.product === null) {
        factoryToSend.factory.autosend.list[factoryToSend.product.name].current++;
        if(factoryToSend.factory.autosend.list[factoryToSend.product.name].current >= factoryToSend.factory.autosend.list[factoryToSend.product.name].directions.length){
          factoryToSend.factory.autosend.list[factoryToSend.product.name].current = 0;
        };
        factoryToSend.factory.sendProduct(factoryToSend.productIndex, autosendDataForTruck);
      };

      repeat();









      //сначала должны проверятся грузовики, но пока их нет
      // const send = {
      //   freeTruck: null,
      //   data: null,
      //   productIndex: null,
      //   route: null,
      //   mode: null,
      // };
      //
      // const playerData = MAIN.game.data.playerData;
      // if(playerData.gameOver){
      //   return
      // };
      // for (let truck in playerData.trucks) {
      //   const thisTruck = playerData.trucks[truck];
      //   if (thisTruck.product === null) {
      //     send.freeTruck = thisTruck;
      //   };
      // };
      //
      //
      // if (send.freeTruck) {
      //   for (let sendID in this.factories) {
      //     const thisSend = this.factories[sendID];
      //     const thisFactory = thisSend.factory;
      //
      //     //если на этой фабрике готов продуктж
      //     const productIndex = thisFactory.settings.storage.findIndex((prod) => {
      //       if (prod) {
      //         if (prod.name === thisSend.product) {
      //           return prod;
      //         };
      //       };
      //     });
      //
      //
      //
      //     if (productIndex != -1) {
      //       //проверяем, можно ли выслать с этой клетки грузовик
      //       if (!thisFactory.fieldCeil.roadEmpty) {
      //         //проверяем куда отправка
      //         if (thisSend.mode === 'price') {
      //           const product = thisSend.product;
      //           const prices = [];
      //           for (let city in MAIN.game.data.cities) {
      //             const thisCity = MAIN.game.data.cities[city];
      //             prices.push({
      //               city: thisCity,
      //               price: thisCity.getCurrentProductPrice(product),
      //             })
      //           };
      //
      //           async function findPaths() {
      //             let index = -1;
      //             const prom = new Promise((res) => {
      //               async function check() {
      //                 index++;
      //                 const prom_2 = new Promise((resolve, reject) => {
      //                   if (index < prices.length) {
      //                     const pathData = {
      //                       autosend: true,
      //                       finalObject: prices[index].city,
      //                       finish: prices[index].city.fieldCeil,
      //                       start: thisSend.factory.fieldCeil,
      //                       factory: thisSend.factory,
      //                       value: null,
      //                       dontCheckTrafficJam: false,
      //                     };
      //                     MAIN.game.functions.pathFinder(pathData).then((path) => {
      //                       prices[index].path = path;
      //                       check();
      //                     });
      //                   } else {
      //                     res(true);
      //                   };
      //                 });
      //                 return prom_2
      //               };
      //               check();
      //             });
      //             return prom;
      //           };
      //           findPaths().then((res) => {
      //             //сначала в конец скидываем тех, у кого нет пути
      //             prices.sort(function(a, b) {
      //               // a должно быть равным b
      //               if (a.path) return -1;
      //               return 0;
      //             });
      //             //удаляем тех, у кого нет пути
      //             prices.forEach((direction, i) => {
      //               if (!direction.path) {
      //                 prices.splice(i);
      //               };
      //             });
      //             //оставшихся сортируем по цене(приоритет), а потом по пути
      //
      //             if (prices.length > 0) {
      //               prices.sort(function(a, b) {
      //                 if (a.price > b.price) {
      //                   return -1;
      //                 };
      //                 if (a.price < b.price) {
      //                   return 1;
      //                 };
      //                 // a должно быть равным b
      //
      //                 if (a.path.length > b.path.length) {
      //                   return 1;
      //                 };
      //                 if (a.path.length < b.path.length) {
      //                   return -1;
      //                 };
      //                 return 0;
      //               });
      //
      //               send.data = thisSend;
      //               send.data.finalObject = prices[0].city;
      //               send.productIndex = productIndex;
      //               send.route = prices[0].path;
      //               send.mode = 'price';
      //               sendTruck();
      //             } else {
      //               return;
      //             };
      //           });
      //         } else if (thisSend.mode === 'route') {
      //           const pathData = {
      //             autosend: true,
      //             finalObject: thisSend.finalObject,
      //             finish: thisSend.final,
      //             start: thisSend.factory.fieldCeil,
      //             factory: thisSend.factory,
      //             value: null,
      //             dontCheckTrafficJam: false,
      //           };
      //           const route = await MAIN.game.functions.pathFinder(pathData);
      //           if (route) {
      //             //если затор хотя бы в 3 клетках отсюда, то отправляем
      //             //смотрим, забита ли дорога
      //             function checkRoute() {
      //               for (let i = 0; i < route.length; i++) {
      //                 if (route.roadEmpty) {
      //                   return i;
      //                 };
      //                 if (i === route.length - 1) {
      //                   return null;
      //                 };
      //               };
      //             };
      //
      //             let traficJamOn = checkRoute();
      //             if (traficJamOn === null || traficJamOn >= 3) {
      //               // назначаем эту фабрику над которой будет производится вывод грузовика
      //               send.data = thisSend;
      //               send.productIndex = productIndex;
      //               send.route = route;
      //               send.mode = 'route';
      //               sendTruck();
      //               //break скидывает проход по всем остальным фабрикам
      //               break;
      //             };
      //           };
      //         };
      //       };
      //     };
      //   };
      //
      //   function sendTruck() {
      //     //если нашли фабрику
      //     if (send.data) {
      //       const fullPath = [];
      //       send.route.forEach((ceil, i) => {
      //         fullPath.push(ceil.indexes);
      //       });
      //       const autosendDataForTruck = {
      //         fullPath: fullPath,
      //         mode: 'route',
      //         truck: send.freeTruck,
      //       };
      //
      //
      //       if (send.data.finalObject.category === 'city') {
      //         autosendDataForTruck.sell = true;
      //         autosendDataForTruck.finalObject = send.data.finalObject.name;
      //       } else if (send.data.finalObject.category === 'factory') {
      //         autosendDataForTruck.delivery = true;
      //         autosendDataForTruck.finalObject = send.data.finalObject.id;
      //       };
      //
      //       if (send.freeTruck.product === null) {
      //         send.freeTruck.product = 1;
      //         send.data.factory.sendProduct(send.productIndex, autosendDataForTruck);
      //       };
      //     };
      //   };
      // };
    },
  },




  exitGame(){
    // console.log('exit')
    // MAIN.renderer.clear();
    // document.querySelector('#renderer').remove();
    // document.querySelector('#gameInterface').remove();
    // const exitData = {
    //   game:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    // };
    // MAIN.socket.emit('GAME_exit',exitData);
    // MAIN.pages.rooms.showPage();

  },
};



export {
  FUNCTIONS
};
