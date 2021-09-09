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
      //Происходит, когда нужное кол-во игроков собрано
      MAIN.pages.loading.changeTitle('Room is ready');
      MAIN.pages.loading.changeComment('Waiting for game generation');
    });

    MAIN.socket.on('GAME_generate',function(ROOM){
      //Происходит когда пользователь хозяин комнаты и нужное кол-во игроков собрано
      MAIN.pages.loading.changeTitle('Room is ready');
      MAIN.pages.loading.changeComment('Game generation');
    });


  };
};

export {
  SOCKET
};
