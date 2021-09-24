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
  for (let z = 0; z < map.length; z++) {
    for (let x = 0; x < map[z].length; x++) {
      if(map[z][x] != 'block'){

        const position = getPositionByIndex(z,x);
        if(map[z][x] === 'sea'){
          const waterGeometry = MAIN.game.scene.assets.geometries.waterCeil.clone();
          waterGeometry.translate(position.x,0,position.z);
          waterArray.push(waterGeometry);
          const waterBottomGeometry = MAIN.game.scene.assets.geometries.waterCeilBottom.clone();
          waterBottomGeometry.translate(position.x,0,position.z);
          geometriesArray.push(waterBottomGeometry);
        }else{
          const ceilGeometry = MAIN.game.scene.assets.geometries.hex.clone();
          ceilGeometry.translate(position.x,0,position.z);
          geometriesArray.push(ceilGeometry);
        };
      };
    };
  };
  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometriesArray);
  const ceilsMaterial = new THREE.MeshPhongMaterial();
  const ceilsMesh = new THREE.Mesh(mergedGeometry,ceilsMaterial);


 /*Два типа воды, один с маткапом, второй с пфонгом
  на маткапе мне не нравится блик от солнца
  но он выглядит живее

  возможно, если добавить на Phong envMap, то будет что-то похожее
 */


  // const mergedWaterGeometry = BufferGeometryUtils.mergeBufferGeometries(waterArray);
  // const waterMaterial = new THREE.MeshMatcapMaterial({matcap:MAIN.game.scene.assets.textures.waterMat,normalMap:MAIN.game.scene.assets.textures.water_normal,blending:THREE.MultiplyBlending});
  // const water = new THREE.Mesh(mergedWaterGeometry,waterMaterial);

  const mergedWaterGeometry = BufferGeometryUtils.mergeBufferGeometries(waterArray);
  const waterMaterial = new THREE.MeshPhongMaterial({color:0x385e8b,normalMap:MAIN.game.scene.assets.textures.water_normal,shininess:200,transparent:true,opacity:0.7});
  const water = new THREE.Mesh(mergedWaterGeometry,waterMaterial);

  function animation(){
    const texture = MAIN.game.scene.assets.textures.water_normal;
    const time = MAIN.game.scene.uTime.value;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    water.material.normalScale.x = Math.sin(time)-1;
    water.material.normalScale.y = Math.sin(time)+1;
    texture.offset.x =time*0.05;
    requestAnimationFrame(animation);
  }
   animation()

  MAIN.renderer.scene.add( water );

  MAIN.renderer.scene.add(ceilsMesh)



};

export {
  FIELD
};
