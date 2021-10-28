import {
  MAIN
} from '../../../main.js';



//socket.js -> MAIN.socket.on('GAME_data')
class PLAYER_DATA{
  constructor(login){
    this.login = login;
    this.balance = null;
    this.credit = null;
    this.factories = {};
    this.trucks = {};
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
