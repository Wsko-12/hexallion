import {
  GAME
} from './game.js';
import {
  INTERFACE
} from './interface/interface.js';



const MAIN = {
  initInterface,
};

function initInterface() {
  MAIN.interface = INTERFACE;
  MAIN.interface.screen = document.querySelector('#screen');
};


export {
  MAIN
};
