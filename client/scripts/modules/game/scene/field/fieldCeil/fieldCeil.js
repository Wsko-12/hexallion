import {
  MAIN
} from '../../../../../main.js';

import * as THREE from '../../../../../libs/ThreeJsLib/build/three.module.js';




class FieldCeil {
  constructor(properties) {

    this.type = properties.type;
    this.position = properties.position;
    this.hitBox = properties.hitBox;
    this.indexes = properties.indexes;

    this.sectors = [null,null,null,null,null,null];

    this.cityCeil = properties.type === 'Northfield' || properties.type === 'Southcity' || properties.type === 'Westown' ? true:false;
    //means player can't build nothing on this ceil
    this.blockCeil = properties.type === 'meadow' || properties.type === 'sea' ? false:true;
  };

  findNeighbours(){
    //MAIN.game.data.map;
    this.neighbours = [null,null,null,null,null,null];
    if(this.indexes.z < 5){

      if(MAIN.game.data.map[this.indexes.z - 1]){
        if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]){
            this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
        };
      };
      if(MAIN.game.data.map[this.indexes.z][this.indexes.x +1]){
          this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
      };
      if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x + 1]){
          this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x + 1];
      };
      if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]){
          this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
      };
      if(MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]){
          this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
      };
      if(MAIN.game.data.map[this.indexes.z-1]){
        if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1]){
            this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1];
        };
      };
    };
    if(this.indexes.z === 5){
        if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]){
            this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
        };
        if(MAIN.game.data.map[this.indexes.z][this.indexes.x + 1]){
            this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
        };
        if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]){
            this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
        };
        if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1]){
            this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1];
        };
        if(MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]){
            this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
        };
        if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1]){
            this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1];
        };
    };
    if(this.indexes.z > 5){
      if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x + 1]){
          this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x + 1];
      };

      if(MAIN.game.data.map[this.indexes.z][this.indexes.x + 1]){
          this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
      };
      if(MAIN.game.data.map[this.indexes.z + 1]){
        if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]){
            this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
        };
      };
      if(MAIN.game.data.map[this.indexes.z + 1]){
        if(MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1]){
            this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1];
        };
      };
      if(MAIN.game.data.map[this.indexes.z]){
        if(MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]){
            this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
        };
      };
      if(MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]){
          this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
      };
    };
  };

  findSectorByClick(intersectCoords){
    const position = {
      x:0,
      y:0,
    };
    position.x = intersectCoords.x - this.position.x;
    position.z = intersectCoords.z - this.position.z;

    let atan2 = Math.atan2( position.z,position.x )/Math.PI * 180;
    let angle = 180 - atan2;
    //подправляем под нужный нам поворот
    angle += 90;
    if(angle>360){
      angle = angle-360;
    }
    //делаем его по часовой стрелке
    angle = 360 - angle;
    const sector = Math.floor(angle/60)
    return sector
  };
  onClick(intersectCoords){
    this.addChosenTemporaryHex();
    const selectedSector = this.findSectorByClick(intersectCoords);
    this.addChosenSectorTemporaryMesh(selectedSector);
  };
  addChosenTemporaryHex(){
    if(MAIN.game.scene.temporaryHexMesh){
      MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
      MAIN.game.scene.temporaryHexMesh.geometry.dispose();
      MAIN.game.scene.temporaryHexMesh.material.dispose();
    };
    const mesh = new THREE.Mesh( MAIN.game.scene.assets.geometries.hitboxCeil.clone(), new THREE.MeshBasicMaterial({color:0xc1ffbb,side:THREE.DoubleSide,transparent:true,opacity:0.5,}));
    const position = this.position;
    mesh.position.set(position.x,position.y+0.005,position.z);
    MAIN.game.scene.temporaryHexMesh = mesh;
    MAIN.renderer.scene.add(mesh);
  };
  addChosenSectorTemporaryMesh(selectedSector){
    if(MAIN.game.scene.temporarySectorMesh){
      MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
      MAIN.game.scene.temporarySectorMesh.geometry.dispose();
      MAIN.game.scene.temporarySectorMesh.material.dispose();
    };
    const mesh = new THREE.Mesh( MAIN.game.scene.assets.geometries.hexsectorTemporaryMesh.clone(), new THREE.MeshBasicMaterial({color:0x00ff00,side:THREE.DoubleSide,transparent:true,opacity:0.5}));
    mesh.rotation.set(0,(selectedSector*(-60) * Math.PI/180),0)
    MAIN.game.scene.temporarySectorMesh = mesh;
    const position = this.position;
    mesh.position.set(position.x,position.y,position.z);
    MAIN.renderer.scene.add(mesh);
  };
};

export {
  FieldCeil
};
