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

    const min = Math.sqrt(3);

    const paths = [];

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
        console.log(ceil);
        MAIN.game.scene.testMesh.position.set(ceil.position.x,ceil.position.y,ceil.position.z);

        ceil.neighbours.forEach((neighbour, i) => {
          if (neighbour) { //если не  null
            //смотрим, не проверяли ли мы ее уже (надо для возврата)
            if (checked.indexOf(neighbour) === -1) {
              if (!neighbour.blockCeil || neighbour.cityCeil) { //на клетку можно передвигаться
                if (neighbour.centralRoad || neighbour.cityCeil) { //на клетке есть дорога
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
        });



        //идем дальше, смотрим какую клетку мы нашли

        if (minDistanceToFinish.neighbour === null) {
          //если ничего не нашли, значит путь прерван и нужно возвращаться назад

          //вкидываем этот путь как незаконченный в массив путей
          paths.push({
            finished: false,
            path: [...path],
          });

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
              MAIN.game.scene.testMesh.position.set(minDistanceToFinish.neighbour.position.x,minDistanceToFinish.neighbour.position.y,minDistanceToFinish.neighbour.position.z);
              console.log('path finded', path);
            },500);
          }else{
            //кидаем в алгоритм следующую клетку
             setTimeout(()=>{
               console.log('here');
               find(minDistanceToFinish.neighbour);
             },500);
          };
        };
      };

      find(start);
    };

    if (finish.centralRoad || finish.cityCeil) {
      if(finish != start){
        findPath();
      };
    };

  },


};

export {
  FUNCTIONS
};
