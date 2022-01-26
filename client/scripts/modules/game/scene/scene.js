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
import {
  PATH
} from './path/path.js';
import {
  CLOUDS
} from './clouds/clouds.js';
import * as THREE from '../../../libs/ThreeJsLib/build/three.module.js';

// import * as DAT from '../../../libs/gui/dat.gui.module.js';
// import { BufferGeometryUtils } from '../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


async function create() {
  let sceneReadyPromise = new Promise((resolve, reject) => {

    // const testMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2,0.2,0.2),new THREE.MeshBasicMaterial({color:0xFF0000}));
    // MAIN.game.scene.testMesh = testMesh;
    // RENDERER.scene.add(testMesh);

    MAIN.game.scene.colorsGeommetry = [];


    for(let i = 0;i<MAIN.game.data.commonData.members.length;i++){
      const mesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.emptyGeometry.clone(),new THREE.MeshPhongMaterial({color:MAIN.game.data.commonData.playerColors[i]}))
      mesh.name = `playerColor_${i}`
      MAIN.game.scene.colorsGeommetry.push(
        mesh
      );
      RENDERER.scene.add(mesh);
    };




    MAIN.game.scene.clouds = CLOUDS;
    MAIN.game.scene.cloudsGroup = new THREE.Group();
    MAIN.game.scene.cloudsGroup.name = 'cloudsGroup';
    MAIN.game.scene.cloudsMaterial = new THREE.MeshPhongMaterial({color:0xffffff,transparent:true,opacity:0.8});
    RENDERER.scene.add(MAIN.game.scene.cloudsGroup );


    MAIN.game.scene.path = PATH;
    MAIN.game.scene.pathGroup = new THREE.Group();
    MAIN.game.scene.pathGroup.name = 'pathGroup';
    MAIN.game.scene.pathMaterial = new THREE.MeshBasicMaterial({color:0x66d28e});
    MAIN.game.scene.pathMaterialRed = new THREE.MeshBasicMaterial({color:0xc43c3c});
    RENDERER.scene.add(MAIN.game.scene.pathGroup );


    MAIN.game.scene.hitBoxMaterial = new THREE.MeshBasicMaterial({color:0xff00ff,wireframe:true,visible:false});
    MAIN.game.scene.mainMaterial = new THREE.MeshPhongMaterial({map:MAIN.game.scene.assets.textures.ceils_256,envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:0.3,shininess:0});

    MAIN.game.scene.hitBoxGroup = new THREE.Group();
    MAIN.game.scene.hitBoxGroup.name = 'hitBoxGroup';
    RENDERER.scene.add(MAIN.game.scene.hitBoxGroup);

    MAIN.game.scene.trucksGroup = new THREE.Group();
    MAIN.game.scene.trucksGroup.name = 'trucksGroup';
    RENDERER.scene.add(MAIN.game.scene.trucksGroup);




    MAIN.game.scene.time = TIME;
    MAIN.game.scene.sun = SUN;
    MAIN.game.scene.assets.textures.sceneEnvMap.mapping = THREE.EquirectangularReflectionMapping;
    RENDERER.scene.background = MAIN.game.scene.assets.textures.sceneEnvMap;
    const fieldBorder = new THREE.Mesh(MAIN.game.scene.assets.geometries.tableBorders.clone(), new THREE.MeshBasicMaterial());
    fieldBorder.name = 'fieldBorder';
    fieldBorder.rotation.y = Math.PI / 2;
    RENDERER.scene.add(fieldBorder);

    // const mesh = new THREE.Mesh(new THREE.BoxBufferGeometry(0.5,0.5,0.5),new THREE.MeshBasicMaterial({color:0xffe325}));
    // mesh.position.set(0,1,0)
    // RENDERER.scene.add(mesh);

    // MAIN.game.scene.buildingsMesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.triangleEmpty.clone(),new THREE.MeshPhongMaterial({color:0x9f9f9f,envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:0.15,shininess:0}));
    // RENDERER.scene.add(MAIN.game.scene.buildingsMesh);
    //Бокс, в котором все лежит
    MAIN.game.scene.lights = {};
    MAIN.game.scene.lights.buildingPointLights = [];
    const sky = new THREE.Mesh(new THREE.BoxBufferGeometry(100,100,100),new THREE.MeshBasicMaterial({color:0x000000,side:THREE.BackSide,transparent:true,opacity:0.5,}));
    sky.name = 'sky';
    RENDERER.scene.add(sky);
    MAIN.game.scene.lights.sky = sky;


    //Группы, чтобы перемещать орбиты солнца
    const lightsGroup = new THREE.Group();
    lightsGroup.name = 'lightsGroup';
    lightsGroup.rotation.z = Math.PI/8;

      //Группа света противоположного солнцу, подсвечивает все сзади
    const lightsAdditionalGroup = new THREE.Group();
    lightsAdditionalGroup.name = 'lightsAdditionalGroup';
    lightsAdditionalGroup.rotation.z = -Math.PI/8;

    RENDERER.scene.add(lightsGroup);
    RENDERER.scene.add(lightsAdditionalGroup);


      //Солнце
    const lightMain = new THREE.DirectionalLight(0xff896f, 1);
    lightMain.name = 'lightMain';
    lightMain.castShadow = true;
    lightMain.shadow.camera.top = 10;
    lightMain.shadow.bias = -0.0012;
    lightMain.shadow.camera.bottom = -10;
    lightMain.shadow.camera.left = -10;
    lightMain.shadow.camera.right = 10;
    lightMain.shadow.camera.far = 20;
    lightMain.shadow.mapSize.x = 2048;
    lightMain.shadow.mapSize.y = 2048;


    // console.log(light);
    // const helper = new THREE.CameraHelper( lightMain.shadow.camera );
    // lightsGroup.add( helper );
    lightsGroup.add(lightMain);
    // const sunMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1),new THREE.MeshBasicMaterial());
    // lightsGroup.add(sunMesh);
    MAIN.game.scene.lights.lightMain = lightMain;

    //Дополнительный свет который лежит напротив солнца
    const lightAdditional = new THREE.DirectionalLight(0xc4e6ff, 0.3);
    lightAdditional.name = 'lightAdditional';
    lightsAdditionalGroup.add(lightAdditional);
    // const lightAdditionalMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0000}));
    // lightsAdditionalGroup.add(lightAdditionalMesh);
    MAIN.game.scene.lights.lightAdditional = lightAdditional;


    const ambientLight = new THREE.AmbientLight(0x343434, 1.4);
    ambientLight.name = 'ambientLight';
    MAIN.game.scene.lights.ambientLight = ambientLight;
    lightsGroup.add(ambientLight);

    const moonlight = new THREE.DirectionalLight(0xc4e6ff, 0.2);
    moonlight.name = 'moonlight';
    // moonlight.castShadow = true;
    moonlight.position.set(5,5,5)
    MAIN.game.scene.lights.moonlight = moonlight;
    RENDERER.scene.add(moonlight)






    FIELD.create();
    TIME.init();
    // CLOUDS.init();
    RENDERER.render();

    resolve('sceneReady');

  });

  let sceneReady = await sceneReadyPromise;
  if(sceneReady){
    return sceneReady;
  };
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
