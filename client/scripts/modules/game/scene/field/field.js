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
import { Water } from '../../../../libs/ThreeJsLib/examples/jsm/objects/Water2.js';



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
        const geometry = MAIN.game.scene.assets.geometries.meadow.clone();
        const position = getPositionByIndex(z,x);
        geometry.translate(position.x,0,position.z);
        if(map[z][x] === 'sea'){
          waterArray.push(geometry);
        }else{
          geometriesArray.push(geometry);
        };
      };
    };
  };
  const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometriesArray);
  const ceilsMaterial = new THREE.MeshToonMaterial({map:MAIN.game.scene.assets.textures.meadow_color,gradientMap:MAIN.game.scene.assets.textures.toonGradient,alphaTest:0.5});
  const ceilsMesh = new THREE.Mesh(mergedGeometry,ceilsMaterial);


  const mergedWaterGeometry = BufferGeometryUtils.mergeBufferGeometries(waterArray);
  const water = new Water( mergedWaterGeometry, {
					color: 0xacc8ff,//#acc8ff
					scale: 0.5,
					flowDirection: new THREE.Vector2( 1, 1 ),
					textureWidth: 128,
					textureHeight: 128,
          clipBias:2,
          reflectivity:0.5,
				} );





        MAIN.renderer.scene.add( water );

  MAIN.renderer.scene.add(ceilsMesh)



};

export {
  FIELD
};
