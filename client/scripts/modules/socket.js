/*
* Это модуль по всем приходящим запросам сокета
*/

import {
  MAIN
} from '../main.js';

const SOCKET = {
  init,
};

function init(){
  if(MAIN.socket){

    MAIN.socket.on('ROOM_ready',function(ROOM){

      //Происходит, когда пользователь хозяин комнаты и нужное кол-во игроков собрано
      MAIN.interface.showError('room ready');
    });



  };
};

export {
  SOCKET
};
