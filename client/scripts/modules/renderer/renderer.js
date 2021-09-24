import {
  MAIN
} from '../../main.js';

import * as THREE from '../../libs/ThreeJsLib/build/three.module.js';

import Stats from '../../libs/ThreeJsLib/examples/jsm/libs/stats.module.js';

import {
  OrbitControls
} from '../../libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';






let clock = new THREE.Clock();


function init() {
  const canvasRenderer = document.querySelector('#renderer');
  canvasRenderer.style.display = 'block';
  RENDERER.renderer = new THREE.WebGLRenderer({
    canvas: canvasRenderer
  });
  RENDERER.renderer.shadowMap.enabled = true;

  RENDERER.camera = new THREE.PerspectiveCamera(40, 2, 0.2, 500);
  RENDERER.camera.position.set(30, 30, 0);
  RENDERER.camera.lookAt(0, 0, 0);
  RENDERER.scene = new THREE.Scene();
  RENDERER.controls = new OrbitControls(RENDERER.camera, RENDERER.renderer.domElement);
  RENDERER.stats = new Stats();
  document.body.appendChild(RENDERER.stats.dom);


  window.addEventListener("resize", setSize);
  setSize();
};


function setSize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const windowPixelRatio = Math.min(window.devicePixelRatio, 2);
  RENDERER.renderer.setSize(windowWidth, windowHeight);
  RENDERER.renderer.setPixelRatio(windowPixelRatio);

  RENDERER.camera.aspect = windowWidth / windowHeight;
  RENDERER.camera.updateProjectionMatrix();
  RENDERER.renderer.domElement.showContextMenu = function(e) {
    e.preventDefault();
  };
};

function render() {
  RENDERER.time = clock.getElapsedTime();
  if(MAIN.game.scene){
    if(MAIN.game.scene.uTime){
        MAIN.game.scene.uTime.value = clock.getElapsedTime()
    };
  };
  RENDERER.controls.update();
  RENDERER.stats.update();
  RENDERER.renderer.render(RENDERER.scene, RENDERER.camera);
  requestAnimationFrame(render);
};




const RENDERER = {
  init,
  renderer: null,
  camera: null,
  scene: null,
  controls: null,
  time: null,
  render,
};
export {
  RENDERER
};
