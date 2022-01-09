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
import {
  INTERFACE
} from './modules/interface/interface.js';
import * as DAT from './libs/gui/dat.gui.module.js';


const MODULES = {};
MODULES.init = () => {
  MAIN.GUI = new DAT.GUI;
  MAIN.GUI.hide()
  const fullScreenButton = {
    fullScreen: function() {
      if (!document.fullscreenElement) {
        document.body.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        };
      };
    },
  };
  MAIN.GUI.add(fullScreenButton, 'fullScreen');





  //подключаем старницы
  MAIN.pages = PAGES;
  MAIN.game = GAME;
  MAIN.renderer = RENDERER;
  MAIN.interface = INTERFACE;

  //развешиваем все события socket.on
  SOCKET.init();




};





export {
  MODULES
};
