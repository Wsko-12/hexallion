import {
  MAIN
} from '../../../main.js';



//socket.js -> MAIN.socket.on('GAME_data')
class PLAYER_DATA{
  constructor(login){
    this.login = login;
    this.balance = null;
    this.gameOver = false;
    this.credit = null;
    this.factories = {};
    this.trucks = {};
    this.tax = {
      value:0,
      procent:0,
      earn:0,
    };

  };

  turnAction(){
    //восстановление грузовиков
    for(let truck in this.trucks){
      const thisTruck =  this.trucks[truck];
      thisTruck.ready = true;
      thisTruck.sended = false;
      if(thisTruck.autosend){
        thisTruck.autosendTurn();
      }else{
        if(thisTruck.onMap){
          if(!thisTruck.cardOpened){
            thisTruck.createNotification();
          }else{
            thisTruck.hitBoxMesh.userData.onClick();
          };
        };
      };
    };

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
export {PLAYER_DATA};
