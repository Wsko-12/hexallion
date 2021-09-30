import {
  MAIN
} from '../../main.js';

import * as THREE from '../../libs/ThreeJsLib/build/three.module.js';

import Stats from '../../libs/ThreeJsLib/examples/jsm/libs/stats.module.js';

import {
  OrbitControls
} from '../../libs/ThreeJsLib/examples/jsm/controls/OrbitControls.js';


import {
  EffectComposer
} from '../../libs/ThreeJsLib/examples/jsm/postprocessing/EffectComposer.js';
import {
  RenderPass
} from '../../libs/ThreeJsLib/examples/jsm/postprocessing/RenderPass.js';
import {
  ShaderPass
} from '../../libs/ThreeJsLib/examples/jsm/postprocessing/ShaderPass.js';
import {
  FXAAShader
} from '../../libs/ThreeJsLib/examples/jsm/shaders/FXAAShader.js';

import {
  BokehPass
} from '../../libs/ThreeJsLib/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from '../../libs/ThreeJsLib/examples/jsm/postprocessing/UnrealBloomPass.js';

let clock = new THREE.Clock();






function init() {
  const canvasRenderer = document.querySelector('#renderer');
  canvasRenderer.style.display = 'block';
  RENDERER.renderer = new THREE.WebGLRenderer({
    canvas: canvasRenderer,
  });
  RENDERER.uResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
  };
  RENDERER.renderer.shadowMap.enabled = true;
  RENDERER.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  RENDERER.renderer.toneMapping = THREE.LinearToneMapping;

  RENDERER.camera = new THREE.PerspectiveCamera(30, 2, 0.2, 500);
  RENDERER.camera.position.set(30, 30, 0);
  RENDERER.camera.lookAt(0, 0, 0);
  RENDERER.scene = new THREE.Scene();
  RENDERER.controls = new OrbitControls(RENDERER.camera, RENDERER.renderer.domElement);
  RENDERER.stats = new Stats();



  const postrocessorsGUI = MAIN.GUI.addFolder('Postrocessors');
  RENDERER.postrocessors = {};
  RENDERER.composer = new EffectComposer(RENDERER.renderer);
  RENDERER.composer.addPass(new RenderPass(RENDERER.scene, RENDERER.camera));

  //antialias
  //Его можно отключать, если pixelRatio > 1;
  RENDERER.postrocessors.FXAA = new ShaderPass(FXAAShader);
  RENDERER.postrocessors.FXAA.material.uniforms['resolution'].value.x = 1 / (window.innerWidth * Math.min(window.devicePixelRatio, 2));
  RENDERER.postrocessors.FXAA.material.uniforms['resolution'].value.y = 1 / (window.innerHeight * Math.min(window.devicePixelRatio, 2));
  RENDERER.composer.addPass(RENDERER.postrocessors.FXAA);

  // //shadowNoise
  // const shadowNoise = {
  //   uniforms: {
  //     tDiffuse: {
  //       value: null
  //     },
  //     uIntensity: {
  //       value: null
  //     },
  //     uBright: {
  //       value: null
  //     },
  //     uSize: {
  //       value: null
  //     },
  //
  //   },
  //
  //   vertexShader: /* glsl */ `
  //     varying vec2 vUv;
  //     void main() {
  //       vUv = uv;
  //       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //     }`,
  //
  //   fragmentShader: /* glsl */ `
  //     #include <common>
  //     uniform sampler2D tDiffuse;
  //     uniform float uIntensity;
  //     uniform float uBright;
  //     uniform float uSize;
  //     uniform float uTime;
  //
  //     varying vec2 vUv;
  //     void main() {
  //       vec4 renderColor = texture2D( tDiffuse, vUv );
  //
  //       float noise = rand( floor(vUv*100.0*uSize)/100.0*uSize );
  //
  //       float brightValueMax = 1.0-(renderColor.r + renderColor.g + renderColor.b)/uBright;
  //
  //       float Cmax = max(renderColor.r, renderColor.g);
  //       Cmax = 1.0 - max(Cmax, renderColor.b);
  //
  //       float bright = Cmax+uBright;
  //       float value = clamp(bright, 0.0, 1.0);
  //       vec4 color = renderColor - (noise*uIntensity)*(value);
  //
  //
  //       gl_FragColor = vec4( color );
  //     }`
  //
  // };
  //
  // RENDERER.postrocessors.shadowNoise = new ShaderPass(shadowNoise);
  // RENDERER.postrocessors.shadowNoise.material.uniforms.uIntensity.value = 0.15;
  // RENDERER.postrocessors.shadowNoise.material.uniforms.uBright.value = 0.04;
  // RENDERER.postrocessors.shadowNoise.material.uniforms.uSize.value = 20 / Math.min(window.devicePixelRatio, 2);
  //
  //
  // const shadowNoiseGUI = MAIN.GUI.addFolder('shadowNoise');
  // shadowNoiseGUI.add(RENDERER.postrocessors.shadowNoise.material.uniforms.uIntensity, 'value', 0, 1).step(0.01).name('uIntensity');
  // shadowNoiseGUI.add(RENDERER.postrocessors.shadowNoise.material.uniforms.uBright, 'value', -1, 1).step(0.01).name('uBright');
  // shadowNoiseGUI.add(RENDERER.postrocessors.shadowNoise.material.uniforms.uSize, 'value', 0, 15).step(1).name('uSize');
  //
  // // RENDERER.composer.addPass(RENDERER.postrocessors.shadowNoise);




  // //myBlur
  // const blur = {
  //   uniforms: {
  //     tDiffuse: {
  //       value: null
  //     },
  //     uResolution: {
  //       value: null
  //     },
  //     uStrength: {
  //       value: null
  //     },
  //     uFocus: {
  //       value: null
  //     },
  //
  //
  //   },
  //
  //   vertexShader: /* glsl */ `
  //    varying vec2 vUv;
  //    void main() {
  //      vUv = uv;
  //      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  //    }`,
  //
  //   fragmentShader: /* glsl */ `
  //    #include <common>
  //    uniform sampler2D tDiffuse;
  //    uniform vec2 uResolution;
  //    uniform float uStrength;
  //    uniform float uFocus;
  //
  //
  //    varying vec2 vUv;
  //    void main() {
  //      vec4 renderColor = texture2D( tDiffuse, vUv );
  //
  //      float Directions = 16.0;
  //      float Quality = 3.0;
  //     //получаем число от 0 до 1, где 0 в центре;
  //      float uvShift = abs(vUv.y - 0.5)*2.0;
  //
  //      //насколько широкая средняя полоса
  //      uvShift = max(uvShift - uFocus,0.0);
  //
  //      //сила размытия, чем дальше от центра, тем больше
  //      float Size = (uvShift*2.0)*uStrength;
  //
  //
  //      vec2 Radius = Size/uResolution.xy;
  //
  //      vec4 Color;
  //     for( float d=0.0; d<3.0; d+=1.0){
  //       for(float i = 0.0;i<3.0;i+=1.0){
  //           vec2 cords = vec2(cos(d),sin(d))*Radius*i;
  //           Color += texture2D( tDiffuse, vUv+cords );
  //       }
  //     }
  //       Color /= Quality * Directions - 15.0;
  //      gl_FragColor = vec4( Color*3.5 );
  //    }`
  //
  // };
  //
  // RENDERER.postrocessors.blur = new ShaderPass(blur);
  // RENDERER.postrocessors.blur.material.uniforms.uResolution = RENDERER.uResolution;
  // RENDERER.postrocessors.blur.material.uniforms.uStrength.value = 8;
  // RENDERER.postrocessors.blur.material.uniforms.uFocus.value = 0.5;
  // // RENDERER.composer.addPass(RENDERER.postrocessors.blur);
  // const blurGUI = MAIN.GUI.addFolder('blur');
  // blurGUI.add(RENDERER.postrocessors.blur.material.uniforms.uStrength, 'value', 0, 20).step(1).name('uStrength');
  // blurGUI.add(RENDERER.postrocessors.blur.material.uniforms.uFocus, 'value', 0, 1).step(0.01).name('uFocus');


  //Blur
  // RENDERER.postrocessors.bokehPass = new BokehPass( RENDERER.scene, RENDERER.camera, {
  //        // focus: RENDERER.camera.position.distanceTo(new THREE.Vector3(0,0,0)),
  //         focus: 8.0,
  //
  //        aperture: 0.003,
  //        maxblur: 0.01,
  //
  //        width:  window.innerWidth,
  //        height:  window.innerHeight
  //      } );
  // RENDERER.composer.addPass(   RENDERER.postrocessors.bokehPass );

  const paramsBloom = {
  				bloomStrength: 1.5,
  				bloomThreshold: 0.95,
  				bloomRadius: 1,
  			};
  RENDERER.postrocessors.bloomPass = new UnrealBloomPass( RENDERER.uResolution.value );
  RENDERER.postrocessors.threshold = paramsBloom.bloomThreshold;
	RENDERER.postrocessors.strength = paramsBloom.bloomStrength;
	RENDERER.postrocessors.radius = paramsBloom.bloomRadius;
  RENDERER.postrocessors.bloomPass.strength = paramsBloom.bloomStrength ;
  RENDERER.postrocessors.bloomPass.threshold = paramsBloom.bloomThreshold;
  RENDERER.postrocessors.bloomPass.radius = paramsBloom.bloomRadius;
  RENDERER.composer.addPass( RENDERER.postrocessors.bloomPass );


  const bloomPassGUI = postrocessorsGUI.addFolder('bloomPass');



    bloomPassGUI.add( paramsBloom, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
      RENDERER.postrocessors.bloomPass.strength = Number( value );
    } );
    bloomPassGUI.add( paramsBloom, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
      RENDERER.postrocessors.bloomPass.threshold = Number( value );
    } );

    bloomPassGUI.add( paramsBloom, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
      RENDERER.postrocessors.bloomPass.radius = Number( value );
    } );


  const postrocessorMerged = {
    uniforms: {
      tDiffuse: {
        value: null
      },
      uIntensity: {
        value: null
      },
      uBright: {
        value: null
      },
      uSize: {
        value: null
      },
      uResolution: {
        value: null
      },
      uStrength: {
        value: null
      },
      uFocus: {
        value: null
      },
    },

    vertexShader: /* glsl */ `
     varying vec2 vUv;
     void main() {
       vUv = uv;
       gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
     }`,
    fragmentShader: /* glsl */ `
      #include <common>
      uniform sampler2D tDiffuse;
      uniform float uIntensity;
      uniform float uBright;
      uniform float uSize;
      uniform float uTime;

      uniform vec2 uResolution;
      uniform float uStrength;
      uniform float uFocus;

      varying vec2 vUv;
      void main() {
        /*Shadow Noise*/
        vec4 renderColor = texture2D( tDiffuse, vUv );

        //рандомное число и размер пикселя шума
        float noise = rand( floor(vUv*100.0*uSize)/100.0*uSize );

        // Яркость цвета
        float Cmax = max(renderColor.r, renderColor.g);
        Cmax = 1.0 - max(Cmax, renderColor.b);

        // Рисуем шум только там, где маленькая яркость
        float bright = Cmax+uBright;
        float value = clamp(bright, 0.0, 1.0);

        //Где маленькая яркость и попадает на пиксель шума -- затемняется текстура
        vec4 color = renderColor - (noise*uIntensity)*(value);


        vec4 shadowNoiseColor = vec4( color );
        /*Shadow Noise*/


        /*Blur*/
        float Directions = 16.0;
        float Quality = 3.0;
       //получаем число от 0 до 1, где 0 в центре;
        float uvShift = abs(vUv.y - 0.5)*2.0;

        //насколько широкая средняя полоса
        uvShift = max(uvShift - uFocus,0.0);

        //сила размытия, чем дальше от центра, тем больше
        float Size = (uvShift*2.0)*uStrength;


        vec2 Radius = Size/uResolution.xy;

        vec4 Color = shadowNoiseColor;
         for( float d=0.0; d<3.0; d+=1.0){
           for(float i = 0.0;i<3.0;i+=1.0){
               vec2 cords = vec2(cos(d),sin(d))*Radius*i;
               Color += texture2D( tDiffuse, vUv+cords );
           }
         }
         Color /= Quality * Directions - 15.0;
        gl_FragColor = vec4( Color*3.5 );
        /*Blur*/
      }`

  };

  RENDERER.postrocessors.postrocessorMerged = new ShaderPass(postrocessorMerged);

  //shadowNoise
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uIntensity.value = 0.5;
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uBright.value = 0.04;
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uSize.value = 15 / Math.min(window.devicePixelRatio, 2);
  //blur
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uResolution = RENDERER.uResolution;
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uStrength.value = 8;
  RENDERER.postrocessors.postrocessorMerged.material.uniforms.uFocus.value = 0.5;

  RENDERER.composer.addPass(RENDERER.postrocessors.postrocessorMerged);

  const shadowNoiseGUI = postrocessorsGUI.addFolder('shadowNoise');
  shadowNoiseGUI.add(RENDERER.postrocessors.postrocessorMerged.material.uniforms.uIntensity, 'value', 0, 1).step(0.01).name('uIntensity');
  shadowNoiseGUI.add(RENDERER.postrocessors.postrocessorMerged.material.uniforms.uBright, 'value', -1, 1).step(0.01).name('uBright');
  shadowNoiseGUI.add(RENDERER.postrocessors.postrocessorMerged.material.uniforms.uSize, 'value', 0, 20).step(1).name('uSize');
  const blurGUI = postrocessorsGUI.addFolder('blur');
  blurGUI.add(RENDERER.postrocessors.postrocessorMerged.material.uniforms.uStrength, 'value', 0, 20).step(1).name('uStrength');
  blurGUI.add(RENDERER.postrocessors.postrocessorMerged.material.uniforms.uFocus, 'value', 0, 1).step(0.01).name('uFocus');




  document.body.appendChild(RENDERER.stats.dom);


  window.addEventListener("resize", setSize);
  setSize();
};


function setSize() {
  //на айфонах оставляет белую полосу
  // const windowWidth = window.innerWidth;
  // const windowHeight = window.innerHeight;

  const windowWidth = document.body.clientWidth;
  const windowHeight = document.body.clientHeight;




  const windowPixelRatio = Math.min(window.devicePixelRatio, 2);
  RENDERER.renderer.setSize(windowWidth, windowHeight);
  RENDERER.renderer.setPixelRatio(windowPixelRatio);
  RENDERER.uResolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  RENDERER.camera.aspect = windowWidth / windowHeight;
  RENDERER.camera.updateProjectionMatrix();
  RENDERER.renderer.domElement.showContextMenu = function(e) {
    e.preventDefault();
  };

  RENDERER.composer.setSize(windowWidth, windowHeight);
  if (windowPixelRatio > 1) {
    // RENDERER.composer.removePass(RENDERER.postrocessors.FXAA);
  } else {
    RENDERER.postrocessors.FXAA.material.uniforms['resolution'].value.x = 1 / (windowWidth * Math.min(window.devicePixelRatio, 2));
    RENDERER.postrocessors.FXAA.material.uniforms['resolution'].value.y = 1 / (windowHeight * Math.min(window.devicePixelRatio, 2));
  };
};

function render() {
  RENDERER.time = clock.getElapsedTime();
  if (MAIN.game.scene) {
    if (MAIN.game.scene.uTime) {
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
