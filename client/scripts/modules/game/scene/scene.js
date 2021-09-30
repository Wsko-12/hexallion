import {
  MAIN
} from '../../../main.js';
import {
  RENDERER
} from '../../renderer/renderer.js';
import {
  ASSETS
} from './assets/assets.js';
import {
  FIELD
} from './field/field.js';
import * as THREE from '../../../libs/ThreeJsLib/build/three.module.js';

// import * as DAT from '../../../libs/gui/dat.gui.module.js';
// import { BufferGeometryUtils } from '../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


function create() {
  MAIN.game.scene.assets.textures.sceneEnvMap.mapping = THREE.EquirectangularReflectionMapping;
  RENDERER.scene.background = MAIN.game.scene.assets.textures.sceneEnvMap;
  const fieldBorder = new THREE.Mesh(MAIN.game.scene.assets.geometries.tableBorders.clone(), new THREE.MeshBasicMaterial());
  fieldBorder.rotation.y = Math.PI / 2;
  RENDERER.scene.add(fieldBorder);



  const light = new THREE.DirectionalLight(0xff896f, 1);
  light.position.set(5, 2, 5);
  light.castShadow = true;
  light.shadow.camera.top = 6;
  light.shadow.camera.bottom = -6;
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.far = 20;
  light.shadow.mapSize.x = 1024;
  light.shadow.mapSize.y = 1024;

  // console.log(light);
  // const helper = new THREE.CameraHelper( light.shadow.camera );
  // RENDERER.scene.add( helper );
  RENDERER.scene.add(light);

  const lightEditional = new THREE.DirectionalLight(0xffffff, 0.2);
  lightEditional.position.set(-5, 2, -5);
  RENDERER.scene.add(lightEditional);

  const ambientLight = new THREE.AmbientLight(0x343434, 1);
  RENDERER.scene.add(ambientLight);


  FIELD.create();


  RENDERER.render();
  MAIN.pages.loading.close();
};

const SCENE = {
  create,
  uTime: {
    value: 0
  },
};


SCENE.assets = ASSETS;

export {
  SCENE
};
