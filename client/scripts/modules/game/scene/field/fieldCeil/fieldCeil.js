import {
  MAIN
} from '../../../../../main.js';

import * as THREE from '../../../../../libs/ThreeJsLib/build/three.module.js';
import {BufferGeometryUtils} from '../../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';




class FieldCeil {
  constructor(properties) {

    this.type = properties.type;
    this.position = properties.position;
    this.hitBox = properties.hitBox;
    this.meshRotation = properties.meshRotation;
    this.indexes = properties.indexes;

    this.sectors = [null,null,null,null,null,null];
    this.centralRoad = false;

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
    if(!this.blockCeil){
      this.addChosenTemporaryHex();
      const selectedSector = this.findSectorByClick(intersectCoords);
      if(this.sectors[selectedSector] === null){
        this.addChosenSectorTemporaryMesh(selectedSector);
        this.showSectorMenu(selectedSector);
      };
    }else{
      if(MAIN.game.scene.temporaryHexMesh){
        MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
        MAIN.game.scene.temporaryHexMesh.geometry.dispose();
        MAIN.game.scene.temporaryHexMesh.material.dispose();
      };
      if(MAIN.game.scene.temporarySectorMesh){
        MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
        MAIN.game.scene.temporarySectorMesh.geometry.dispose();
        MAIN.game.scene.temporarySectorMesh.material.dispose();
      };
      if(!this.cityCeil){
        this.addChosenBlockTemporaryHex();
      };
    };
  };






  showSectorMenu(sector){
    if(this.type === 'meadow'){
      if(this.sectors[sector] === null){
        const that = this;
        function calculateSectorMenuButtons(){
          //Ищем что можно построить на этом секторе;
          const buttons = [];
          const ceil = that.type;
          let nearCeil = that.neighbours[sector];
          if(nearCeil != null){
            nearCeil = nearCeil.type
          };

          //check all builds
          for(let building in MAIN.game.configs.buildings){
            const thisBuilding = MAIN.game.configs.buildings[building];
            //check can we build this building on this ceil
            thisBuilding.ceil.forEach((buildCeil, i) => {
              if(buildCeil === ceil){
                //nearCeil for this building
                thisBuilding.nearCeil.forEach((buildNearCeil, i) => {
                  if(buildNearCeil == nearCeil || buildNearCeil === 'all'){
                    buttons.push(building);
                  };
                });
              };
            });
          };

          return buttons;
        };
        MAIN.interface.game.ceilMenu.showSectorMenu(that,sector,calculateSectorMenuButtons());
      };
    };
  };

  //добавляет меш шестиугольника
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
  //добавляет меш треугольника(сектора)
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

  //добавляет красный меш
  addChosenBlockTemporaryHex(){
    if(MAIN.game.scene.temporaryHexMesh){
      MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
      MAIN.game.scene.temporaryHexMesh.geometry.dispose();
      MAIN.game.scene.temporaryHexMesh.material.dispose();
    };
    const meshName = this.type.toLowerCase() + 'Ceil';
    const geometry = MAIN.game.scene.assets.geometries[meshName].clone();
    geometry.rotateY(this.meshRotation);
    //z conflict
    geometry.translate(0,0.01,0);
    const mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide,transparent:true,opacity:0.5,}));
    const position = this.position;
    mesh.position.set(position.x,position.y+0.005,position.z);
    MAIN.game.scene.temporaryHexMesh = mesh;
    MAIN.renderer.scene.add(mesh);
    let smoothValue = 0.5;
    //постепенное удаление красного меша
    function smoothRemoveTemporaryMesh(){
      smoothValue -= 0.01;
      if(smoothValue > 0){
        if(MAIN.game.scene.temporaryHexMesh === mesh){
          mesh.material.opacity = smoothValue;
          requestAnimationFrame(smoothRemoveTemporaryMesh);
        };
      }else{
        if(MAIN.game.scene.temporaryHexMesh === mesh){
          MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
          MAIN.game.scene.temporaryHexMesh.geometry.dispose();
          MAIN.game.scene.temporaryHexMesh.material.dispose();
        };
      };
    };
    smoothRemoveTemporaryMesh();
  };

  buildOnSector(sector,building){
    if(this.sectors[sector] === null){
      const newGeometryArray = [MAIN.renderer.scene.ceilsMesh.geometry];
      // const newGeometryArray = [ MAIN.game.scene.buildingsMesh.geometry];


      if(!this.centralRoad){
        this.centralRoad = true;
        const centralRoadGeometry = MAIN.game.scene.assets.geometries.roadCenter.clone();
        centralRoadGeometry.translate(this.position.x,this.position.y,this.position.z);
        newGeometryArray.push(centralRoadGeometry);
      };

      let buildGeommetry;
      //потом убрать заглушку
      if(building === 'road'){
        buildGeommetry =  MAIN.game.scene.assets.geometries[building].clone();
        buildGeommetry.rotateY((sector*(-60) * Math.PI/180));
        buildGeommetry.translate(this.position.x,this.position.y,this.position.z);
        newGeometryArray.push(buildGeommetry);
        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;
        this.sectors[sector] = 'road';


        const lightArray =  [MAIN.game.scene.lights.buildingLights.geometry];
        const thisLightGeometry = MAIN.game.scene.assets.geometries.roadLight.clone()
        thisLightGeometry.rotateY((sector*(-60) * Math.PI/180));
        thisLightGeometry.translate(this.position.x,this.position.y,this.position.z);
        lightArray.push(thisLightGeometry);
        const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);

        MAIN.game.scene.lights.buildingLights.geometry.dispose();
        delete MAIN.game.scene.lights.buildingLights.geometry;
        MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

      };


      //  MAIN.game.scene.buildingsMesh.geometry.dispose();
      // delete  MAIN.game.scene.buildingsMesh.geometry;
      //  MAIN.game.scene.buildingsMesh.geometry = newGeometry;
    };
  };
};

export {
  FieldCeil
};
