/*
 * Этот модуль создает начальное поле
 */



import {
  MAIN
} from '../../../../main.js';
import {
  SCENE
} from '../scene.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';
import {BufferGeometryUtils} from '../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';
// import { Reflector } from '../../../../libs/ThreeJsLib/examples/jsm/objects/Reflector.js';



function getPositionByIndex(z,x){
  const RADIUS = 1;
  const ROUNDS = 5;
  const position = {
    x:0,
    y:0,
    z:0,
  }
    //строим по оси z
  if(z % 2){
    //для нечетных по z
    position.z = (RADIUS + RADIUS/2) * z;
  }else{
    //для четных  по z
    position.z = (RADIUS + RADIUS/2) * z;
  }
  //строим левый край всей карты
  position.x += 0.86602540378 * RADIUS * Math.abs(z-ROUNDS);

  //выстраиваем их по x
  position.x += 0.86602540378 * RADIUS*2 * x;

  //центрируем всю карту по x
  position.x -= 0.86602540378 * RADIUS*2*ROUNDS;

  //центрируем всю карту по z
  position.z -= (RADIUS + RADIUS/2)*ROUNDS;


  return position;
};







const FIELD = {};
FIELD.create = () => {

  //двумерный массив карты
  const map = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];

  //забиваем его значениями из генирирования карты
  let map_index = 0;
  for (let z = 0; z < map.length; z++) {
    for (let x = 0; x < map[z].length; x++) {
      map[z][x] = MAIN.game.commonData.mapArray[map_index];
      map_index++;
    };
  };
  MAIN.game.data.map = map;




  //раскидываем все поле
  const geometriesArray = [];
  const waterArray = [];
  const lightArray = [];
  for (let z = 0; z < map.length; z++) {
    for (let x = 0; x < map[z].length; x++) {
      if(map[z][x] != 'block'){

        const position = getPositionByIndex(z,x);
        // if(map[z][x] === 'sea'){
        //   // const waterGeometry = MAIN.game.scene.assets.geometries.waterCeil.clone();
        //   // waterGeometry.translate(position.x,0,position.z);
        //   // waterArray.push(waterGeometry);
        //   // const waterBottomGeometry = MAIN.game.scene.assets.geometries.waterCeilBottom.clone();
        //   // waterBottomGeometry.translate(position.x,0,position.z);
        //   // geometriesArray.push(waterBottomGeometry);
        // }else{
        //   const ceilGeometry = MAIN.game.scene.assets.geometries.forestCeil.clone();
        //   ceilGeometry.translate(position.x,0,position.z);
        //   geometriesArray.push(ceilGeometry);
        // };


        function getRandomDeg(){
          const deg = Math.floor(Math.random() * 6)*60 * Math.PI/180;
          return deg;
        };

        let geometry;
        let cityGeometry;
        let lightGeometry;
        let waterGeometry;
        switch (map[z][x] ) {
          case 'forest':
            geometry = MAIN.game.scene.assets.geometries.forestCeil.clone();
            break;
          case 'sand':
            geometry = MAIN.game.scene.assets.geometries.sandCeil.clone();
            break;
          case 'sea':
            waterGeometry = MAIN.game.scene.assets.geometries.waterCeil.clone();
            geometry = MAIN.game.scene.assets.geometries.waterBottom.clone();
            break;
          case 'mountain':
            geometry = MAIN.game.scene.assets.geometries.mountainCeil.clone();
          break;
          case 'Westown':
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            cityGeometry = MAIN.game.scene.assets.geometries.westownCeil.clone();
            lightGeometry = MAIN.game.scene.assets.geometries.westownLight.clone();
          break;
          default:
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
        };

          geometry.rotateY(getRandomDeg());
          geometry.translate(position.x,0,position.z);
          geometriesArray.push(geometry);
          const randomDeg = getRandomDeg();
          if(cityGeometry){
            cityGeometry.rotateY(randomDeg);
            cityGeometry.translate(position.x,0,position.z);
            geometriesArray.push(cityGeometry);
          };
          if(lightGeometry){
            lightGeometry.rotateY(randomDeg);
            lightGeometry.translate(position.x,0,position.z);
            lightArray.push(lightGeometry);
            const light = new THREE.PointLight( 0xffa900, 0.5, 2 );
            light.position.set(position.x,0.5,position.z);
              MAIN.renderer.scene.add( light );
              MAIN.game.scene.lights.buildingPointLights.push(light);
          };

          if(waterGeometry){
            waterGeometry.translate(position.x,0,position.z);
            waterArray.push(waterGeometry);
          };
      };
    };
  };
  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometriesArray);
  // const ceilsMaterial = new THREE.MeshPhongMaterial({envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:0.7,map:MAIN.game.scene.assets.textures.ceils_color,shininess:10});
  const ceilsMaterial = new THREE.MeshPhongMaterial({color:0xd8d8d8,envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:0.15,shininess:0});

  const ceilsMaterialGUI = MAIN.GUI.addFolder(' ceilsMaterial');
  const ceilsMaterialConfig = {
    color:'#d8d8d8',
  }
  ceilsMaterialGUI.addColor(ceilsMaterialConfig, 'color').onChange(()=>{
    ceilsMaterial.color.set(ceilsMaterialConfig.color)
  });
  ceilsMaterialGUI.add(ceilsMaterial, 'reflectivity',0,1).step(0.05).name('reflectivity');
  ceilsMaterialGUI.add(ceilsMaterial, 'shininess',0,500).step(5).name('shininess');

  const ceilsMesh = new THREE.Mesh(mergedGeometry,ceilsMaterial);
  ceilsMesh.castShadow = true;
  ceilsMesh.receiveShadow = true;



  const mergedLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
  const mergedLightMaterial = new THREE.MeshBasicMaterial({map:MAIN.game.scene.assets.textures.lights,transparent:true,alphaTest:0.5});
  const lightMesh = new THREE.Mesh(mergedLightGeometry,mergedLightMaterial)
  MAIN.renderer.scene.add( lightMesh );
  MAIN.game.scene.lights.buildingLights = lightMesh;


  const mergedWaterGeometry = BufferGeometryUtils.mergeBufferGeometries(waterArray);
  const waterMaterial = new THREE.MeshPhongMaterial({color:0x6baadd,shininess:500,transparent:true,opacity:0.5,envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:1});
  const water = new THREE.Mesh(mergedWaterGeometry,waterMaterial);
  water.receiveShadow = true;

  MAIN.renderer.scene.add( water );

  MAIN.renderer.scene.add(ceilsMesh)



};

export {
  FIELD
};
