import {
  GAME
} from './main.js';



const mouse = {
  x:0,
  y:0,
};
const init = function(){
  document.querySelector('body').addEventListener('mousemove',function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
};


const checkCameraMoves = function(){

}

const USER_ACTIONS = {
  mouse,
  init,
  checkCameraMoves,
};

export {USER_ACTIONS};
