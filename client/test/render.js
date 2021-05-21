import * as THREE from '../ThreeJsLib/build/three.module.js';
import {
  GAME
} from './main.js';





const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(45, 2, 1, 1000);
const setSizes = function(){
   const windowWidth = document.body.clientWidth;
   const windowHeight = document.body.clientHeight;

   const pixelRatio = window.devicePixelRatio;

   renderer.setSize(windowWidth * pixelRatio, windowHeight * pixelRatio, true);


   renderer.domElement.style.width = windowWidth + 'px';
   renderer.domElement.style.height = windowHeight + 'px';
   camera.aspect = windowWidth / windowHeight;
   camera.updateProjectionMatrix();
};
const init = function() {
  document.querySelector('body').appendChild(RENDER.renderer.domElement);
  renderer.domElement.style.position = 'fixed';
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;

  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  window.addEventListener("resize", setSizes);
  setSizes();
};

const settings = {
  fps:30,
  autoRender:false
};


const render = function(){
  renderer.render(GAME.gameWorld.scene, camera);
};


const RENDER = {
  renderer,
  camera,
  init,
  setSizes,
  settings,
  render,
};

export {
  RENDER
}
