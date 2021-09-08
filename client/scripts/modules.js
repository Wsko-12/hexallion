//Тут происходит инициализация всех модулей


import {
  MAIN
} from './main.js';
import {
  SOCKET
} from './modules/socket.js';
import {
  PAGES
} from './modules/pages/pages.js';



const MODULES = {
};
MODULES.init = () =>{
  //подключаем старницы
  MAIN.pages = PAGES;

  //развешиваем все события socket.on
  SOCKET.init();




};





export {
  MODULES
};
