import {RENDER} from './render.js';
import {GAME_WORLD} from './gameWorld.js';
import {TIME} from './time.js';
import {USER_ACTIONS} from './userActions.js';
import {CAMERA_ACTIONS} from './cameraActions.js';
import {WEATHER} from './weather.js';

const GAME = {
  time:TIME,
  render:RENDER,
  gameWorld:GAME_WORLD,
  gameTime:TIME,
  userActions:USER_ACTIONS,
  cameraActions:CAMERA_ACTIONS,
  weather:WEATHER,
};


GAME.time.init();
GAME.userActions.init();
GAME.render.init();
GAME.gameWorld.init();
GAME.weather.init();











GAME.mainLoop = function(){
  GAME.cameraActions.updateCameraPosition();
  GAME.gameWorld.updateSkyPosition();

  GAME.render.render();

  if(GAME.render.settings.autoRender){
    requestAnimationFrame(GAME.mainLoop);
  }else{
    setTimeout(GAME.mainLoop,1000/GAME.render.settings.fps);
  };
};



GAME.mainLoop();




export {GAME};
