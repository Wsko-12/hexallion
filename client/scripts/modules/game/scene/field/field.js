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
import {FieldCeil} from '../../gameObjects/fieldCeil/fieldCeil.js';
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
      map[z][x] = MAIN.game.data.commonData.mapArray[map_index];
      map_index++;
    };
  };
  MAIN.game.data.map = map;


  //раскидываем все поле
  const geometriesArray = [];
  const waterArray = [];
  const lightArray = [];
  const hitBoxMaterial = MAIN.game.scene.hitBoxMaterial;



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
        let hitboxGeometry = MAIN.game.scene.assets.geometries.hitboxCeil.clone();
        switch (map[z][x] ) {
          case 'forest':
            geometry = MAIN.game.scene.assets.geometries.forestCeil.clone();
            const forestHitBox = MAIN.game.scene.assets.geometries.forestHitBox.clone();
            hitboxGeometry = BufferGeometryUtils.mergeBufferGeometries([hitboxGeometry,forestHitBox]);
            break;
          case 'sand':
            geometry = MAIN.game.scene.assets.geometries.sandCeil.clone();
            break;
          case 'steelMine':
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            break;
          case 'goldMine':
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            break;
          case 'oilMine':
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            break;
          case 'sea':
            waterGeometry = MAIN.game.scene.assets.geometries.waterCeil.clone();
            geometry = MAIN.game.scene.assets.geometries.waterBottom.clone();
            break;
          case 'mountain':
            geometry = MAIN.game.scene.assets.geometries.mountainCeil.clone();
            const mountainHitBox = MAIN.game.scene.assets.geometries.mountainHitBox.clone();
            hitboxGeometry = BufferGeometryUtils.mergeBufferGeometries([hitboxGeometry,mountainHitBox]);
          break;
          case 'Westown':
            // geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            cityGeometry = MAIN.game.scene.assets.geometries.westownCeil.clone();
            lightGeometry = MAIN.game.scene.assets.geometries.westownLight.clone();
          break;
          case 'Northfield':
            // geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            // cityGeometry = MAIN.game.scene.assets.geometries.northfieildCeil.clone();
            // lightGeometry = MAIN.game.scene.assets.geometries.northfieildLight.clone();
            cityGeometry = MAIN.game.scene.assets.geometries.westownCeil.clone();
            lightGeometry = MAIN.game.scene.assets.geometries.westownLight.clone();
          break;
          case 'Southcity':
            // geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
            // cityGeometry = MAIN.game.scene.assets.geometries.southcityCeil.clone();
            // lightGeometry = MAIN.game.scene.assets.geometries.southcityLight.clone();
            cityGeometry = MAIN.game.scene.assets.geometries.westownCeil.clone();
            lightGeometry = MAIN.game.scene.assets.geometries.westownLight.clone();
          break;
          default:
            geometry = MAIN.game.scene.assets.geometries.meadowCeil.clone();
        };





          // if(map[z][x] === 'meadow'){
          //   for(let i = 0; i<3;i++){
          //     if(Math.random()>0.3){
          //       const decorElemntNumber = Math.floor(Math.random() * 5);
          //       const decorGeometry = MAIN.game.scene.assets.geometries[`meadowDecor_${decorElemntNumber}`].clone();
          //       decorGeometry.rotateY(getRandomDeg());
          //
          //       const decorPosition = {
          //         x:position.x,
          //         y:0,
          //         z:position.z,
          //       };
          //
          //       const decorDegShift = 60 * Math.floor(Math.random()*7);
          //       const radius = 0.25 + Math.random()*0.7;
          //       decorPosition.x += Math.sin(decorDegShift*Math.PI/180)* radius;
          //       decorPosition.z += Math.cos(decorDegShift*Math.PI/180)*radius;
          //
          //
          //       decorGeometry.translate(decorPosition.x,0,decorPosition.z);
          //
          //       geometriesArray.push(decorGeometry);
          //     };
          //   };
          // };



          const randomDeg = getRandomDeg();
          if(geometry){
            geometry.rotateY(randomDeg);
            geometry.translate(position.x,0,position.z);

            geometriesArray.push(geometry);
          };


          if(cityGeometry){
            cityGeometry.rotateY(randomDeg);
            cityGeometry.translate(position.x,0,position.z);

            geometriesArray.push(cityGeometry);
            //add box to hitBoxes
            const cityHitBox = MAIN.game.scene.assets.geometries.cityHitBox.clone();
            hitboxGeometry = BufferGeometryUtils.mergeBufferGeometries([hitboxGeometry,cityHitBox]);
          };
          if(lightGeometry){
            lightGeometry.rotateY(randomDeg);
            lightGeometry.translate(position.x,0,position.z);
            lightArray.push(lightGeometry);
            const light = new THREE.PointLight( 0xffa900, 0.5, 2 );
            light.name = 'cityPointLight';
            light.position.set(position.x,0.5,position.z);
              MAIN.renderer.scene.add( light );
              MAIN.game.scene.lights.buildingPointLights.push(light);
          };

          if(waterGeometry){
            waterGeometry.translate(position.x,0,position.z);
            waterArray.push(waterGeometry);
          };


          const hitBoxMesh = new THREE.Mesh(hitboxGeometry, hitBoxMaterial);
          hitBoxMesh.name = 'fieldHitBox';
          hitBoxMesh.position.set(position.x,0.01,position.z);
          MAIN.game.scene.hitBoxGroup.add(hitBoxMesh);

          //here add class names fieldCeil

          const ceilPSroperties = {
            position:position,
            indexes:{z,x},
            meshRotation:randomDeg,
            type:map[z][x],
            hitBox: hitBoxMesh,
          };
          const ceil = new FieldCeil(ceilPSroperties);
          map[z][x] = ceil;
          // console.log(ceil);
          hitBoxMesh.userData = ceil;

      };
    };
  };
  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometriesArray);
  // const ceilsMaterial = new THREE.MeshPhongMaterial({envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:0.7,map:MAIN.game.scene.assets.textures.ceils_color,shininess:10});
  const ceilsMaterial = MAIN.game.scene.mainMaterial;

  // const ceilsMaterialGUI = MAIN.GUI.addFolder(' ceilsMaterial');
  // const ceilsMaterialConfig = {
  //   color:'#ffffff',
  // }
  // ceilsMaterialGUI.addColor(ceilsMaterialConfig, 'color').onChange(()=>{
  //   ceilsMaterial.color.set(ceilsMaterialConfig.color)
  // });
  // ceilsMaterialGUI.add(ceilsMaterial, 'reflectivity',0,1).step(0.05).name('reflectivity');
  // ceilsMaterialGUI.add(ceilsMaterial, 'shininess',0,500).step(5).name('shininess');

  const ceilsMesh = new THREE.Mesh(mergedGeometry,ceilsMaterial);
  ceilsMesh.name = 'ceilsMesh';
  ceilsMesh.castShadow = true;
  ceilsMesh.receiveShadow = true;


  const mergedLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
  const mergedLightMaterial = new THREE.MeshBasicMaterial({map:MAIN.game.scene.assets.textures.lights,transparent:true,alphaTest:0.05,depthWrite:false});
  const lightMesh = new THREE.Mesh(mergedLightGeometry,mergedLightMaterial);
  lightMesh.name = 'lightMesh';
  MAIN.renderer.scene.add( lightMesh );
  MAIN.game.scene.lights.buildingLights = lightMesh;


  const mergedWaterGeometry = BufferGeometryUtils.mergeBufferGeometries(waterArray);
  const waterMaterial = new THREE.MeshPhongMaterial({color:0xffffff,shininess:500,transparent:true,opacity:0.8,envMap:MAIN.game.scene.assets.textures.sceneEnvMap,reflectivity:1});
  const water = new THREE.Mesh(mergedWaterGeometry,waterMaterial);
  water.name = 'waterMesh';
  water.receiveShadow = true;

  MAIN.game.scene.lights.buildingLights.visible = false;
  MAIN.game.scene.lights.buildingPointLights.forEach((item, i) => {
    item.visible = false;
  });

  MAIN.renderer.scene.add( water );
  MAIN.renderer.scene.ceilsMesh = ceilsMesh;
  MAIN.renderer.scene.add(ceilsMesh);



  for (let z = 0; z < map.length; z++) {
    for (let x = 0; x < map[z].length; x++) {
      map[z][x].findNeighbours();
    };
  };
};

export {
  FIELD
};
