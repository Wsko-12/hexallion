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

  RENDERER.scene.background = new THREE.Color(0x94afb4);
  const light = new THREE.DirectionalLight(0xffffff,1);
  light.position.set(5,5,5);
  RENDERER.scene.add(light);

  const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
  RENDERER.scene.add(ambientLight);

  // const mesh = new THREE.Mesh(new THREE.BoxGeometry(3,3,3),new THREE.MeshBasicMaterial({color:0xFF0000}))
  // RENDERER.scene.add(mesh);

  //игровой стол
  const table = new THREE.Mesh(
    new THREE.BoxGeometry( 20, 1, 30 ),
    new THREE.MeshPhongMaterial(
      {
        map:ASSETS.textures.table_color,
        normalMap:ASSETS.textures.table_normal,
        specularMap:ASSETS.textures.table_roughness,
        bumpMap:ASSETS.textures.table_bump,
      }));
      table.position.y = -0.5;
  RENDERER.scene.add(table);







  FIELD.create();








  RENDERER.render();
  MAIN.pages.loading.close();
};

const SCENE = {
  create,
};


SCENE.assets = ASSETS;

export {
  SCENE
};
