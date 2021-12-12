import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';
import {BufferGeometryUtils} from '../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


const PATH = {
  show(pathArray){
    PATH.clear();
    let geometry = [];
    pathArray.forEach((ceil, i) => {

      //если старт
      if(i === 0){
        const sector = ceil.neighbours.indexOf(pathArray[i+1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        const marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();

        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        geometry.push(marker);
      }else if(i === pathArray.length - 1){
        //конец
        const sector = ceil.neighbours.indexOf(pathArray[i-1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        const marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        geometry.push(marker);
      }else{
        let sector = ceil.neighbours.indexOf(pathArray[i-1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        let marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        geometry.push(marker);

        sector = ceil.neighbours.indexOf(pathArray[i+1]);
        name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        geometry.push(marker);
      };

    });

    const newGeometry = BufferGeometryUtils.mergeBufferGeometries(geometry);
    const pathMesh = new THREE.Mesh(newGeometry,MAIN.game.scene.pathMaterial);


    MAIN.game.scene.pathGroup.add(pathMesh);
  },

  clear(){
    MAIN.game.scene.pathGroup.children.forEach((children, i) => {
      children.geometry.dispose();
    });

    MAIN.game.scene.pathGroup.clear();

  },




};

export {
  PATH
};
