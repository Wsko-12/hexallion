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

import * as DAT from '../../../libs/gui/dat.gui.module.js';
// import { BufferGeometryUtils } from '../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


function create() {

  MAIN.game.scene.assets.textures.sceneEnvMap.mapping = THREE.EquirectangularReflectionMapping;
  RENDERER.scene.background = MAIN.game.scene.assets.textures.sceneEnvMap;
  const fieldBorder = new THREE.Mesh(MAIN.game.scene.assets.geometries.tableBorders.clone(), new THREE.MeshBasicMaterial());
  fieldBorder.rotation.y = Math.PI / 2;
  RENDERER.scene.add(fieldBorder);



  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  RENDERER.scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
