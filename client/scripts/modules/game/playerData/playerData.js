import {
  MAIN
} from '../../../main.js';

const PLAYER_DATA = {
  //socket.js -> MAIN.socket.on('GAME_data')
  login:null,

  //socket.js -> MAIN.socket.on('GAME_applyCredit')
  balance:null,

  //socket.js -> MAIN.socket.on('GAME_applyCredit')
  credit:null,

  //socket.js -> MAIN.socket.on('GAME_buildFactory')
  factories:{},

  //
  trucks:{},
};
export {PLAYER_DATA};
