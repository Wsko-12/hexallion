import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';
import {BufferGeometryUtils} from '../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


const PATH = {
  show:async function(data){
    //грузовик в той же клетке что и фабрика
    if(data.path.length === 1){
      let prom = new Promise((res)=>{
        res(data);
      });
      return prom;
    };
    PATH.clear();
    const geometry = [];
    const redGeometry = [];
    let truckOnRoad = false;
    data.path.forEach((ceil, i) => {
      if(i != 0 && ceil.roadEmpty){
        truckOnRoad = true;
      };
      //если старт
      if(i === 0){
        const sector = ceil.neighbours.indexOf(data.path[i+1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        const marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();

        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        if(i <= data.value && !truckOnRoad){
          geometry.push(marker);
        }else{
          redGeometry.push(marker);
        };



      }else if(i === data.path.length - 1){
        //конец
        const sector = ceil.neighbours.indexOf(data.path[i-1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        const marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);

        if(i <= data.value && !truckOnRoad){
          geometry.push(marker);
        }else{
          redGeometry.push(marker);
        };

      }else{
        let sector = ceil.neighbours.indexOf(data.path[i-1]);
        let name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        let marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);

        if(i <= data.value && !truckOnRoad){
          geometry.push(marker);
        }else{
          redGeometry.push(marker);
        };


        sector = ceil.neighbours.indexOf(data.path[i+1]);
        name = ceil.sectors[sector];
        //значит клетка город
        if(name === null){
          name = 'road'
        }
        marker =  MAIN.game.scene.assets.geometries[`pathMarker_${name}`].clone();
        marker.rotateY((sector*(-60) * Math.PI/180));
        marker.translate(ceil.position.x,ceil.position.y+0.025,ceil.position.z);
        if(i < data.value  && !truckOnRoad){
          geometry.push(marker);
        }else{
          redGeometry.push(marker);
        };
      };

    });

    const newGeometry = BufferGeometryUtils.mergeBufferGeometries(geometry);
    const pathMesh = new THREE.Mesh(newGeometry,MAIN.game.scene.pathMaterial);
    MAIN.game.scene.pathGroup.add(pathMesh);


    if(redGeometry.length){
      const newRedGeometry = BufferGeometryUtils.mergeBufferGeometries(redGeometry);
      const pathRedMesh = new THREE.Mesh(newRedGeometry,MAIN.game.scene.pathMaterialRed);
      MAIN.game.scene.pathGroup.add(pathRedMesh);
    };


    let prom = new Promise((res)=>{
      res(data);
    });
    return prom;
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
