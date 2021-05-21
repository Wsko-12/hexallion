import * as THREE from '../ThreeJsLib/build/three.module.js';
import {GAME} from './main.js';


const scene = new THREE.Scene();

const environment = {
  color:new THREE.Color(0x3ceed4),
  sunColor:new THREE.Color(0xfdffa7),
  moonColor:new THREE.Color(0xc4e3f2),
};


const skyGroup = new THREE.Group();


const sky = {
  light:new THREE.HemisphereLight(environment.color,0x303030,1),

  sunLight:new THREE.DirectionalLight(environment.sunColor,1),
  sunObject:new THREE.Mesh(
    new THREE.SphereGeometry( 1, 16, 16),
    new THREE.MeshBasicMaterial( {color: environment.sunColor,fog:false})
  ),
  sunObjectPosition:{
    x:0,
    y:2,
    z:0,
    distance:40,
  },


  moonLight:new THREE.DirectionalLight(environment.moonColor,0.1),
  moonObject:new THREE.Mesh(
    new THREE.SphereGeometry( 1, 16, 16),
    new THREE.MeshBasicMaterial({color: environment.moonColor,fog:false})
  ),
  moonObjectPosition:{
    x:0,
    y:2,
    z:0,
    distance:40,
  },
};



const init = function(){
  const geom = new THREE.BoxBufferGeometry(30,30);
  const mat = new THREE.MeshPhongMaterial({color:0x006113});
  const mesh = new THREE.Mesh(geom,mat);

  mesh.position.y = -1;
  mesh.rotation.x = 90 * Math.PI/180;
  mesh.receiveShadow = true;
  mesh.castShadow = true;

  const geom2 = new THREE.BoxBufferGeometry(2,2);
  const mat2 = new THREE.MeshPhongMaterial({color:0xffffff});
  const mesh2 = new THREE.Mesh(geom2,mat2);
  mesh2.castShadow = true;

  sky.sunLight.target = GAME.cameraActions.cameraTargetObject;
  sky.moonLight.target = GAME.cameraActions.cameraTargetObject;



  skyGroup.add(sky.light),
  skyGroup.add(sky.sunLight,sky.sunObject);
  skyGroup.add(sky.moonLight,sky.moonObject);
  scene.add(mesh);
  scene.add(mesh2);
  scene.add(sky.sunLight.target);
  scene.add(skyGroup);


  skyGroup.rotation.x = 90 * Math.PI/180;
  skyGroup.rotation.z = -45 * Math.PI/180;

  sky.sunLight.castShadow = true;
  sky.sunLight.position.set(0, 0, 0);
  sky.sunLight.target.position.set(0, 0, 0);
  sky.sunLight.shadow.width = 128;
  sky.sunLight.shadow.height = 128;
  sky.sunLight.shadow.camera.zoom = 0.5;
  sky.sunLight.shadow.camera.near = 0;
  sky.sunLight.shadow.camera.far = 160;




  sky.moonLight.castShadow = true;
  sky.moonLight.position.set(0, 0, 0);
  sky.moonLight.target.position.set(0, 0, 0);
  sky.moonLight.shadow.width = 128;
  sky.moonLight.shadow.height = 128;
  sky.moonLight.shadow.camera.zoom = 0.5;
  sky.moonLight.shadow.camera.near = 0;
  sky.moonLight.shadow.camera.far = 160;

};

const updateSkyPosition = function(){

  sky.sunLight.target = GAME.cameraActions.cameraTargetObject;
  sky.moonLight.target = GAME.cameraActions.cameraTargetObject;

  skyGroup.position.x = GAME.cameraActions.cameraTargetPosition.x;
  skyGroup.position.y = GAME.cameraActions.cameraTargetPosition.y;
  skyGroup.position.z = GAME.cameraActions.cameraTargetPosition.z;
};


const updateSkyObjectPosition = function(){
  const positionOnSky = GAME.time.date.minutes + GAME.time.date.hours*60;

  const nowDeg = positionOnSky*360/1440;

  sky.sunObjectPosition.x = Math.sin(nowDeg * Math.PI/180)*sky.sunObjectPosition.distance;
  sky.sunObjectPosition.z = Math.cos(nowDeg * Math.PI/180)*sky.sunObjectPosition.distance;

  sky.moonObjectPosition.x = Math.sin((nowDeg - 180) * Math.PI/180)*sky.moonObjectPosition.distance;
  sky.moonObjectPosition.z = Math.cos((nowDeg - 180) * Math.PI/180)*sky.moonObjectPosition.distance;

  sky.sunObject.position.x = sky.sunObjectPosition.x;
  sky.sunObject.position.y = sky.sunObjectPosition.y;
  sky.sunObject.position.z = sky.sunObjectPosition.z;
  sky.sunLight.position.x = sky.sunObjectPosition.x;
  sky.sunLight.position.y = sky.sunObjectPosition.y;
  sky.sunLight.position.z = sky.sunObjectPosition.z;


  sky.moonObject.position.x = sky.moonObjectPosition.x;
  sky.moonObject.position.y = sky.moonObjectPosition.y;
  sky.moonObject.position.z = sky.moonObjectPosition.z;
  sky.moonLight.position.x = sky.moonObjectPosition.x;
  sky.moonLight.position.y = sky.moonObjectPosition.y;
  sky.moonLight.position.z = sky.moonObjectPosition.z;

  // console.log(positionOnSky);
  // sky.sunObject.position.x =
};




const GAME_WORLD = {
  init,

  scene,
  environment,
  skyGroup,
  sky,
  updateSkyPosition,
  updateSkyObjectPosition,
}


export {GAME_WORLD}
