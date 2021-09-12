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
import {
  GAME
} from './modules/game/game.js';
import {
  RENDERER
} from './modules/renderer/renderer.js';



const MODULES = {};
MODULES.init = () => {
  //подключаем старницы
  MAIN.pages = PAGES;
  MAIN.game = GAME;
  MAIN.renderer = RENDERER;

  //развешиваем все события socket.on
  SOCKET.init();




};





export {
  MODULES
};
