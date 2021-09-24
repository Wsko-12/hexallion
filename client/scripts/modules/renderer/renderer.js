import {
  MAIN
} from '../../main.js';

import * as THREE from '../../libs/ThreeJsLib/build/three.module.js';

import Stats from '../../libs/ThreeJsLib/examples/jsm/libs/stats.module.js';

import {
  OrbitControls
} from '../../libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';


import { EffectComposer } from '../../libs/ThreeJsLib/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../libs/ThreeJsLib/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '../../libs/ThreeJsLib/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from '../../libs/ThreeJsLib/examples/jsm/shaders/FXAAShader.js';

import { BokehPass } from '../../libs/ThreeJsLib/examples/jsm/postprocessing/BokehPass.js';






let clock = new THREE.Clock();


function init() {
  const canvasRenderer = document.querySelector('#renderer');
  canvasRenderer.style.display = 'block';
  RENDERER.renderer = new THREE.WebGLRenderer({
    canvas: canvasRenderer,

    /*В принципе можно ставить, подлагиваетБ но 50 фпс на телефоне есть, надо будет еще с постпроцами проверить*/
    // antialias:true,
  });
  RENDERER.renderer.shadowMap.enabled = true;
  RENDERER.renderer.toneMapping = THREE.LinearToneMapping;

  RENDERER.camera = new THREE.PerspectiveCamera(30, 2, 0.2, 500);
  RENDERER.camera.position.set(30, 30, 0);
  RENDERER.camera.lookAt(0, 0, 0);
  RENDERER.scene = new THREE.Scene();
  RENDERER.controls = new OrbitControls(RENDERER.camera, RENDERER.renderer.domElement);
  RENDERER.stats = new Stats();




  RENDERER.postrocessors = {};
  RENDERER.composer = new EffectComposer( RENDERER.renderer );
  RENDERER.composer.addPass( new RenderPass( RENDERER.scene, RENDERER.camera ) );

  //antialias
  //Его можно отключать, если pixelRatio > 1;
  RENDERER.postrocessors.FXAA = new ShaderPass( FXAAShader );
  RENDERER.postrocessors.FXAA.material.uniforms[ 'resolution' ].value.x = 1 / (  window.innerWidth * Math.min(window.devicePixelRatio, 2) );
  RENDERER.postrocessors.FXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( window.innerHeight * Math.min(window.devicePixelRatio, 2) );
  RENDERER.composer.addPass( RENDERER.postrocessors.FXAA );

  //Blur
  RENDERER.postrocessors.bokehPass = new BokehPass( RENDERER.scene, RENDERER.camera, {
					focus: 6.0,
					aperture: 0.004,
					maxblur: 0.01,

					width:  window.innerWidth,
					height:  window.innerHeight
				} );
  RENDERER.composer.addPass(   RENDERER.postrocessors.bokehPass );








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

  RENDERER.composer.setSize(windowWidth, windowHeight);
  if(windowPixelRatio > 1){
    RENDERER.composer.removePass( RENDERER.postrocessors.FXAA );
  }else{
    RENDERER.postrocessors.FXAA.material.uniforms[ 'resolution' ].value.x = 1 / ( windowWidth * windowPixelRatio );
    RENDERER.postrocessors.FXAA.material.uniforms[ 'resolution' ].value.y = 1 / ( windowHeight * windowPixelRatio );
  }
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
  // RENDERER.renderer.render(RENDERER.scene, RENDERER.camera);
  RENDERER.composer.render();

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
