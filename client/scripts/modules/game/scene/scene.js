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
import {
  SUN
} from './weather/sun/sun.js';
import {
  TIME
} from './weather/time/time.js';
import * as THREE from '../../../libs/ThreeJsLib/build/three.module.js';

// import * as DAT from '../../../libs/gui/dat.gui.module.js';
// import { BufferGeometryUtils } from '../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


function create() {
  MAIN.game.scene.time = TIME;
  MAIN.game.scene.sun = SUN;
  MAIN.game.scene.assets.textures.sceneEnvMap.mapping = THREE.EquirectangularReflectionMapping;
  RENDERER.scene.background = MAIN.game.scene.assets.textures.sceneEnvMap;
  const fieldBorder = new THREE.Mesh(MAIN.game.scene.assets.geometries.tableBorders.clone(), new THREE.MeshBasicMaterial());
  fieldBorder.rotation.y = Math.PI / 2;
  RENDERER.scene.add(fieldBorder);

  const lightsGroup = new THREE.Group();
  lightsGroup.rotation.y = Math.PI/4
  RENDERER.scene.add(lightsGroup);

  MAIN.game.scene.lights = {};
  const lightMain = new THREE.DirectionalLight(0xff896f, 1);
  lightMain.castShadow = true;
  lightMain.shadow.camera.top = 6;
  lightMain.shadow.camera.bottom = -6;
  lightMain.shadow.camera.left = -10;
  lightMain.shadow.camera.right = 10;
  lightMain.shadow.camera.far = 20;
  lightMain.shadow.mapSize.x = 1024;
  lightMain.shadow.mapSize.y = 1024;


  // console.log(light);
  // const helper = new THREE.CameraHelper( light.shadow.camera );
  // RENDERER.scene.add( helper );
  lightsGroup.add(lightMain);
  // const sunMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1),new THREE.MeshBasicMaterial());
  // RENDERER.scene.add(sunMesh);
  MAIN.game.scene.lights.lightMain = lightMain;

  const lightAdditional = new THREE.DirectionalLight(0xffffff, 0.2);
  MAIN.game.scene.lights.lightAdditional = lightAdditional;
  lightsGroup.add(lightAdditional);
  // const lightAdditionalMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1),new THREE.MeshBasicMaterial(0xff0000));
  // RENDERER.scene.add(lightAdditionalMesh);


  const ambientLight = new THREE.AmbientLight(0x343434, 1);
  MAIN.game.scene.lights.ambientLight = lightAdditional;
  lightsGroup.add(ambientLight);


  FIELD.create();





  TIME.init();
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
