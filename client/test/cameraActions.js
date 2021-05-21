import * as THREE from '../ThreeJsLib/build/three.module.js';

import {
  GAME
} from './main.js';



const cameraPosition = {
  x:4,
  y:10,
  z:4,
};
const cameraTargetPosition = {
  x:0,
  y:0,
  z:0,
  distance:4,
};
const cameraMoves = {
  top:0,
  left:0,
  speed:0.5,
};
const cameramouseCeaper = {
  horizontal:10,
  vertical:10,
}
const cameraTargetObject = new THREE.Object3D();



const checkCameraPosition = function(){
  const windowWidth = document.body.clientWidth;
  const windowHeight = document.body.clientHeight;

  const mouse = GAME.userActions.mouse;
  if(mouse.y < windowHeight*cameramouseCeaper.vertical/100 && mouse.y > 0){
    cameraMoves.top=-1;
  }
  if(mouse.y > windowHeight - windowHeight*cameramouseCeaper.vertical/100 && mouse.y < windowHeight){
    cameraMoves.top=1;
  }
  if(mouse.x < windowWidth*cameramouseCeaper.horizontal/100 && mouse.x > 0){
    cameraMoves.left=-1;
  }
  if(mouse.x > windowWidth - windowWidth*cameramouseCeaper.horizontal/100 && mouse.y < windowWidth){
    cameraMoves.left=1;
  }
  if(mouse.y > windowHeight*cameramouseCeaper.vertical/100 && mouse.y < windowHeight - windowHeight*cameramouseCeaper.vertical/100){
    cameraMoves.top=0;
  }
  if(mouse.x > windowWidth*cameramouseCeaper.horizontal/100 && mouse.x < windowWidth - windowWidth*cameramouseCeaper.horizontal/100){
    cameraMoves.left=0;
  };
};

const updateCameraPosition = function(){
  checkCameraPosition();

  const upShift = cameraMoves.speed * cameraMoves.top;
  const sideShift = cameraMoves.speed * cameraMoves.left;

  const topShiftX = upShift/2;
  const topShiftY = upShift/2;
  const leftShiftX = sideShift/2;
  const leftShiftY = -sideShift/2;


  cameraPosition.x +=  topShiftX+ leftShiftX;
  cameraPosition.z +=  topShiftY+leftShiftY;


  cameraTargetPosition.x = cameraPosition.x - cameraTargetPosition.distance;
  cameraTargetPosition.z = cameraPosition.z - cameraTargetPosition.distance;

  cameraTargetObject.x = cameraTargetPosition.x;
  cameraTargetObject.y = cameraTargetPosition.y;
  cameraTargetObject.z = cameraTargetPosition.z;

  GAME.render.camera.position.x = cameraPosition.x;
  GAME.render.camera.position.z = cameraPosition.z;
  GAME.render.camera.position.y = cameraPosition.y;

  GAME.render.camera.lookAt(cameraTargetPosition.x,cameraTargetPosition.y,cameraTargetPosition.z);
};





const CAMERA_ACTIONS = {
  cameraPosition,
  cameraTargetPosition,
  cameraMoves,
  cameramouseCeaper,
  updateCameraPosition,
  cameraTargetObject,
};

export {CAMERA_ACTIONS};
