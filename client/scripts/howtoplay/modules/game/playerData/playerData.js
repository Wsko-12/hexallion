import {
  MAIN
} from '../../../main.js';



//socket.js -> MAIN.socket.on('GAME_data')
class PLAYER_DATA {
  constructor(login) {
    this.login = login;
    this.balance = null;
    this.gameOver = false;
    this.credit = null;
    this.factories = {};
    this.trucks = {};
    this.tax = {
      value: 0,
      procent: 0,
      earn: 0,
    };
    this.statistics = {
      thisStepProfit: 0,
      thisStepLose: 0,

      lastStepProfit: 0,
      lastStepLose: 0,
      allGameProfit: 0,
      allGameLose: 0,

      maxProfit: 0,
      maxLose: 0,
    };
  };

  turnAction() {
    //восстановление грузовиков
    for (let truck in this.trucks) {
      const thisTruck = this.trucks[truck];
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



    //могут остаться грузовики на карте, поэтому очищаем
    MAIN.game.scene.trucksGroup.children.forEach((truck, i) => {
      const name = truck.name;
      const truckObj = MAIN.game.data.commonData.trucks.all[name];
      if(truckObj.object3D != truck){
        truck.removeFromParent();
        truck.geometry.dispose();
      };
    });


    MAIN.game.functions.autosending.turn();
  };
};

// {
//   //socket.js -> MAIN.socket.on('GAME_data')
//   login:null,
//
//   //socket.js -> MAIN.socket.on('GAME_applyCredit')
//   balance:null,
//
//   //socket.js -> MAIN.socket.on('GAME_applyCredit')
//   credit:null,
//
//   //socket.js -> MAIN.socket.on('GAME_buildFactory')
//   factories:{},
//
//   //
//   trucks:{},
// };
export {
  PLAYER_DATA
};
