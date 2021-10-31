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
  //trigger at socket.js MAIN.socket.on('GAME_applyBuilding')
  applyBuilding(data) {
    // data = {
    //     ceilIndex: ceil.indexes,
    //     sector: sector,
    //     building: building,
    //   }
    const ceil = MAIN.game.data.map[data.ceilIndex.z][data.ceilIndex.x];
    if (ceil.sectors[data.sector] === null) {
      ceil.buildOnSector(data.sector, data.building);
    };
  },


  endTurn() {
    const data = {
      player: MAIN.userData.login,
      gameID: MAIN.game.data.commonData.id,
    };
    MAIN.socket.emit('GAME_endTurn', data);
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
    MAIN.game.data.playerData.factories[factory.id] = factory;
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

    const properties = {
      player: data.player,
      id: data.truckID,
    };


    const truck = new Truck(properties);

    MAIN.game.data.commonData.trucks.all[truck.id] = truck;

    if (data.player === MAIN.game.data.playerData.login) {
      MAIN.game.data.playerData.trucks[truck.id] = truck;


      //подразумевается, что он все еще в меню, поэтому делаем реопен
      MAIN.interface.game.trucks.openMenu();
    };

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





  findPath(value, truck, fieldCeil) {


  const start = MAIN.game.data.map[truck.place.z][truck.place.x];
  const finish = fieldCeil;

  //массив всех путей
  const paths = [];
  //если найдет дорогу, по которой еще можно поехать
  let anotherWayIsPossible = false;
  if (finish.centralRoad || finish.cityCeil) {
    if(finish != start){
      findPath();
    };
  };




    //поиск первого пути
    function findPath() {
      const path = [];
      const checked = [];

      function find(ceil) {
        let minDistanceToFinish = {
          neighbour: null,
          distance: 1000,
        };
        path.push(ceil);
        checked.push(ceil);
        MAIN.game.scene.testMesh.position.set(ceil.position.x,ceil.position.y,ceil.position.z);

        const nextPathCeils = [];
        ceil.neighbours.forEach((neighbour, i) => {
          if (neighbour) { //если не  null
            //смотрим, не проверяли ли мы ее уже (надо для возврата)
            if (checked.indexOf(neighbour) === -1) {
              if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                  //если она не занята грузовиком
                  if(!neighbour.roadEmpty){
                  if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                    //если к соседу проложена дорога
                    const index = neighbour.neighbours.indexOf(ceil);
                    if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                      //если от соседа проложена дорога
                      const distance = neighbour.getDistanceToCeil(finish);
                      //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
                      if (distance < minDistanceToFinish.distance) {
                          minDistanceToFinish.neighbour = neighbour;
                          minDistanceToFinish.distance = distance;
                      };
                    };
                  };
                };
                };
              };
            };
          };
        });



        //идем дальше, смотрим какую клетку мы нашли

        if (minDistanceToFinish.neighbour === null) {
          //если ничего не нашли, значит путь прерван и нужно возвращаться назад

          //удаляем ее из массива
          //и вкидываем, что ее уже проверили
          path.pop();
          checked.push(ceil);

          //если в path есть еще клетки,
          if(path.length > 0){
            //перепроверяем опять с предыдущей клетки
            setTimeout(()=>{
              if(path[path.length - 1] === ceil){
                path.pop();
              };
              if(path.length > 0){
                find(path[path.length - 1]);
              }else{
                console.log('no path 1');
              };
            },500);
          }else{
            console.log('no path 2');
          };
        }else{
          //если все же нашли следующую подходящую клетку
          if(minDistanceToFinish.distance === 0){
            setTimeout(()=>{
              path.push(minDistanceToFinish.neighbour);
              MAIN.game.scene.testMesh.position.set(minDistanceToFinish.neighbour.position.x,minDistanceToFinish.neighbour.position.y,minDistanceToFinish.neighbour.position.z);
              paths.push({
                finished: true,
                path: [...path],
              });
              setTimeout(()=>{
                //надо проверить, есть ли еще пути
                findMorePath();
              });
            },500);
          }else{
            //кидаем в алгоритм следующую клетку
             setTimeout(()=>{
               find(minDistanceToFinish.neighbour);
             },500);
          };
        };
      };

      find(start);
    };


    //поиск дополнительных путей
    function findMorePath() {

      const path = [];
      const checked = [];

      function find(ceil) {
        let minDistanceToFinish = {
          neighbour: null,
          distance: 1000,
        };
        path.push(ceil);
        checked.push(ceil);
        MAIN.game.scene.testMesh.position.set(ceil.position.x,ceil.position.y,ceil.position.z);

        const nextPathCeils = [];

        //нужно проверить, если еще дороги, по которым не ездили

        const otherRoads = [];
        ceil.neighbours.forEach((neighbour, i) => {
          if (neighbour) { //если не  null
            //смотрим, не проверяли ли мы ее уже (надо для возврата)
            if (checked.indexOf(neighbour) === -1) {
              if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                  //если она не занята грузовиком
                  if(!neighbour.roadEmpty){
                  if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                    //если к соседу проложена дорога
                    const index = neighbour.neighbours.indexOf(ceil);
                    if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                      //если от соседа проложена дорога
                      paths.forEach((pathObj, i) => {
                        // проверяем у этой клетки индекс в этих путях
                        const currentCeilIndex = pathObj.path.indexOf(ceil);

                        //смотрим следующую клекту в путях
                        if(currentCeilIndex != -1){
                          if(pathObj.path[currentCeilIndex+1]){
                            //если клетка не та, что уже проверена, то скидываем в возможные дороги
                            if(pathObj.path[currentCeilIndex+1] != neighbour){
                              otherRoads.push(neighbour);
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
        if(otherRoads.length){
          anotherWayIsPossible = true;
          otherRoads.forEach((neighbour, i) => {
            const distance = neighbour.getDistanceToCeil(finish);
            //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
            if (distance < minDistanceToFinish.distance) {
                minDistanceToFinish.neighbour = neighbour;
                minDistanceToFinish.distance = distance;
            };
          });
        }else{
          anotherWayIsPossible = false;
          //если других дорог нет, то берем такие как уже было
          ceil.neighbours.forEach((neighbour, i) => {
            if (neighbour) { //если не  null
              //смотрим, не проверяли ли мы ее уже (надо для возврата)
              if (checked.indexOf(neighbour) === -1) {
                if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                  if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
                    //если она не занята грузовиком
                    if(!neighbour.roadEmpty){
                    if (ceil.sectors[i] === 'road' || ceil.sectors[i] === 'bridgeStraight' || ceil.sectors[i] === 'bridge' || ceil.cityCeil) {
                      //если к соседу проложена дорога
                      const index = neighbour.neighbours.indexOf(ceil);
                      if (neighbour.sectors[index] === 'road' || neighbour.sectors[index] === 'bridgeStraight' || neighbour.sectors[index] === 'bridge' || neighbour.cityCeil) {
                        //если от соседа проложена дорога
                        const distance = neighbour.getDistanceToCeil(finish);
                        //если дистанция от нее меньше до цели чем у других, то вкидываем ее на проверку
                        if (distance < minDistanceToFinish.distance) {
                          minDistanceToFinish.neighbour = neighbour;
                          minDistanceToFinish.distance = distance;
                        };
                      };
                    };
                  };
                  };
                };
              };
            };
          });
        };



        //идем дальше, смотрим какую клетку мы нашли

        if (minDistanceToFinish.neighbour === null) {
          //если ничего не нашли, значит путь прерван и нужно возвращаться назад

          //вкидываем в возможные пути
          paths.push({finished:false,path:[...path]});

          //удаляем ее из массива
          path.pop();

          //и вкидываем, что ее уже проверили
          checked.push(ceil);

          //если в path есть еще клетки,
          if(path.length > 0){
            //перепроверяем опять с предыдущей клетки
            setTimeout(()=>{
              if(path[path.length - 1] === ceil){
                path.pop();
              };
              if(path.length > 0){
                find(path[path.length - 1]);
              }else{
                console.log('no path 1');
              };
            },500);
          }else{
            console.log('no path 2');
          };
        }else{
          //если все же нашли следующую подходящую клетку
          if(minDistanceToFinish.distance === 0){
            setTimeout(()=>{
              path.push(minDistanceToFinish.neighbour);
              MAIN.game.scene.testMesh.position.set(minDistanceToFinish.neighbour.position.x,minDistanceToFinish.neighbour.position.y,minDistanceToFinish.neighbour.position.z);
              paths.push({
                finished: true,
                path: [...path],
              });
              //если есть еще дороги, то чекаем еще раз
              if(anotherWayIsPossible){
                setTimeout(()=>{
                  findMorePath();
                });

              }else{
                //Нашли все возможные пути


                // MAIN.interface.dobleClickFunction.standard = true;
                // MAIN.interface.dobleClickFunction.function = null;
                // console.log('all paths',paths)


                choseShortestPath();

              };
            },500);
          }else{
            //кидаем в алгоритм следующую клетку
             setTimeout(()=>{
               find(minDistanceToFinish.neighbour);
             },500);
          };
        };
      };

      find(start);
    };


    function choseShortestPath(){
      let shortest = {
        path:null,
        steps:1000,
      };
      paths.forEach((path, i) => {
        if(path.finished){
          if(path.path.length < shortest.steps){
            shortest.path = path.path;
            shortest.steps = path.path.length ;
          };
        };
      });

      console.log(shortest.path);

    };


},


};

export {
  FUNCTIONS
};
