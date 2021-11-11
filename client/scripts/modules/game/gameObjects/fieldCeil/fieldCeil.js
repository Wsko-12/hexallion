import {
  MAIN
} from '../../../../main.js';

import * as THREE from '../../../../libs/ThreeJsLib/build/three.module.js';
import {
  BufferGeometryUtils
} from '../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';


import {
  City
} from '../city/city.js';

class FieldCeil {
  constructor(properties) {

    this.type = properties.type;
    this.position = properties.position;
    this.hitBox = properties.hitBox;
    this.meshRotation = properties.meshRotation;
    this.indexes = properties.indexes;
    this.roadEmpty = false;

    this.sectors = [null, null, null, null, null, null];
    //тут лежат объекты сектора более подробно
    this.sectorsData = [null, null, null, null, null, null];
    this.centralRoad = false;

    this.cityCeil = properties.type === 'Northfield' || properties.type === 'Southcity' || properties.type === 'Westown' ? true : false;
    //means player can't build nothing on this ceil
    this.blockCeil = properties.type === 'meadow' || properties.type === 'sea' || properties.type === 'sand' || properties.type === 'steelMine' || properties.type === 'goldMine'? false : true;


    if (this.cityCeil) {
      const city = new City({
        name: this.type,
        position: properties.position
      });
      MAIN.game.data.cities[this.type] = city;
    };
  };

  findNeighbours() {
    //MAIN.game.data.map;
    this.neighbours = [null, null, null, null, null, null];
    if (this.indexes.z < 5) {

      if (MAIN.game.data.map[this.indexes.z - 1]) {
        if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]) {
          this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
        };
      };
      if (MAIN.game.data.map[this.indexes.z][this.indexes.x + 1]) {
        this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
      };
      if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x + 1]) {
        this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x + 1];
      };
      if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]) {
        this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
      };
      if (MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]) {
        this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
      };
      if (MAIN.game.data.map[this.indexes.z - 1]) {
        if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1]) {
          this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1];
        };
      };
    };
    if (this.indexes.z === 5) {
      if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]) {
        this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
      };
      if (MAIN.game.data.map[this.indexes.z][this.indexes.x + 1]) {
        this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
      };
      if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]) {
        this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
      };
      if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1]) {
        this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1];
      };
      if (MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]) {
        this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
      };
      if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1]) {
        this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x - 1];
      };
    };
    if (this.indexes.z > 5) {
      if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x + 1]) {
        this.neighbours[0] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x + 1];
      };

      if (MAIN.game.data.map[this.indexes.z][this.indexes.x + 1]) {
        this.neighbours[1] = MAIN.game.data.map[this.indexes.z][this.indexes.x + 1];
      };
      if (MAIN.game.data.map[this.indexes.z + 1]) {
        if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x]) {
          this.neighbours[2] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x];
        };
      };
      if (MAIN.game.data.map[this.indexes.z + 1]) {
        if (MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1]) {
          this.neighbours[3] = MAIN.game.data.map[this.indexes.z + 1][this.indexes.x - 1];
        };
      };
      if (MAIN.game.data.map[this.indexes.z]) {
        if (MAIN.game.data.map[this.indexes.z][this.indexes.x - 1]) {
          this.neighbours[4] = MAIN.game.data.map[this.indexes.z][this.indexes.x - 1];
        };
      };
      if (MAIN.game.data.map[this.indexes.z - 1][this.indexes.x]) {
        this.neighbours[5] = MAIN.game.data.map[this.indexes.z - 1][this.indexes.x];
      };
    };
  };

  findSectorByClick(intersectCoords) {
    const position = {
      x: 0,
      y: 0,
    };
    position.x = intersectCoords.x - this.position.x;
    position.z = intersectCoords.z - this.position.z;

    let atan2 = Math.atan2(position.z, position.x) / Math.PI * 180;
    let angle = 180 - atan2;
    //подправляем под нужный нам поворот
    angle += 90;
    if (angle > 360) {
      angle = angle - 360;
    }
    //делаем его по часовой стрелке
    angle = 360 - angle;
    const sector = Math.floor(angle / 60)
    return sector
  };
  onClick(intersectCoords) {
    //для режима пошагового меню не показывается если не ход игрока

    if (this.cityCeil) {
      MAIN.interface.game.city.openMenu(MAIN.game.data.cities[this.type]);
    };


    if (MAIN.game.data.commonData.turnBasedGame) {
      if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login || MAIN.game.data.commonData.turnsPaused) {
        return;
      };
    };
    if (!this.blockCeil) {
      this.addChosenTemporaryHex();
      const selectedSector = this.findSectorByClick(intersectCoords);
      if (this.sectors[selectedSector] === null) {
        this.addChosenSectorTemporaryMesh(selectedSector);
        this.showSectorMenu(selectedSector);
      } else {
        if (this.sectorsData[selectedSector]) {
          this.sectorsData[selectedSector].onClick();
        };
      }
    } else {
      if (MAIN.game.scene.temporaryHexMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
        MAIN.game.scene.temporaryHexMesh.geometry.dispose();
        MAIN.game.scene.temporaryHexMesh.material.dispose();
      };
      if (MAIN.game.scene.temporarySectorMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
        MAIN.game.scene.temporarySectorMesh.geometry.dispose();
        MAIN.game.scene.temporarySectorMesh.material.dispose();
      };
      if (!this.cityCeil) {
        this.addChosenBlockTemporaryHex();
      };
    };

  };




  calculateSectorMenuButtons(sector) {
    //Ищем что можно построить на этом секторе;
    const buttons = [];
    const ceil = this.type;
    let nearCeil = this.neighbours[sector];
    if (nearCeil != null) {
      nearCeil = nearCeil.type
    };

    //check all builds
    for (let building in MAIN.game.configs.buildings) {
      const thisBuilding = MAIN.game.configs.buildings[building];
      //check can we build this building on this ceil
      thisBuilding.ceil.forEach((buildCeil, i) => {
        if (buildCeil === ceil) {
          //nearCeil for this building
          thisBuilding.nearCeil.forEach((buildNearCeil, i) => {
            if (buildNearCeil == nearCeil || buildNearCeil === 'all') {
              buttons.push(building);
            };
          });
        };
      });
    };

    return buttons;
  };

  showSectorMenu(sector) {
    if (this.type === 'meadow' || this.type === 'sand' || this.type === 'steelMine' || this.type === 'goldMine') {
      if (this.sectors[sector] === null) {
        const that = this;
        MAIN.interface.game.ceilMenu.showSectorMenu(that, sector, this.calculateSectorMenuButtons(sector));
      };
    };
    if (this.type === 'sea') {
      if (this.sectors[sector] === null) {
        let nonEmptySectors = 0;
        // чтобы нельзя было строить больше 2
        this.sectors.forEach((thisSector, i) => {
          if (thisSector === 'bridge' || thisSector === 'bridgeStraight') {
            nonEmptySectors++;
          };
        });
        if (nonEmptySectors < 2) {
          const that = this;
          MAIN.interface.game.ceilMenu.showSectorMenu(that, sector, this.calculateSectorMenuButtons(sector));
        };
      };
    };
  };

  //добавляет меш шестиугольника
  addChosenTemporaryHex() {
    if (MAIN.game.scene.temporaryHexMesh) {
      MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
      MAIN.game.scene.temporaryHexMesh.geometry.dispose();
      MAIN.game.scene.temporaryHexMesh.material.dispose();
    };
    const mesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.hitboxCeil.clone(), new THREE.MeshBasicMaterial({
      color: 0xc1ffbb,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    }));
    const position = this.position;
    mesh.position.set(position.x, position.y + 0.005, position.z);
    MAIN.game.scene.temporaryHexMesh = mesh;
    MAIN.renderer.scene.add(mesh);
  };
  //добавляет меш треугольника(сектора)
  addChosenSectorTemporaryMesh(selectedSector) {
    if (MAIN.game.scene.temporarySectorMesh) {
      MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
      MAIN.game.scene.temporarySectorMesh.geometry.dispose();
      MAIN.game.scene.temporarySectorMesh.material.dispose();
    };
    const mesh = new THREE.Mesh(MAIN.game.scene.assets.geometries.hexsectorTemporaryMesh.clone(), new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    }));
    mesh.rotation.set(0, (selectedSector * (-60) * Math.PI / 180), 0)
    MAIN.game.scene.temporarySectorMesh = mesh;
    const position = this.position;
    mesh.position.set(position.x, position.y, position.z);
    MAIN.renderer.scene.add(mesh);
    this.getSectorPosition(selectedSector)
  };

  //добавляет красный меш
  addChosenBlockTemporaryHex() {
    if (MAIN.game.scene.temporaryHexMesh) {
      MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
      MAIN.game.scene.temporaryHexMesh.geometry.dispose();
      MAIN.game.scene.temporaryHexMesh.material.dispose();
    };
    const meshName = this.type.toLowerCase() + 'Ceil';
    const geometry = MAIN.game.scene.assets.geometries[meshName].clone();
    geometry.rotateY(this.meshRotation);
    //z conflict
    geometry.translate(0, 0.01, 0);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    }));
    const position = this.position;
    mesh.position.set(position.x, position.y + 0.005, position.z);
    MAIN.game.scene.temporaryHexMesh = mesh;
    MAIN.renderer.scene.add(mesh);
    let smoothValue = 0.5;
    //постепенное удаление красного меша
    function smoothRemoveTemporaryMesh() {
      smoothValue -= 0.01;
      if (smoothValue > 0) {
        if (MAIN.game.scene.temporaryHexMesh === mesh) {
          mesh.material.opacity = smoothValue;
          requestAnimationFrame(smoothRemoveTemporaryMesh);
        };
      } else {
        if (MAIN.game.scene.temporaryHexMesh === mesh) {
          MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
          MAIN.game.scene.temporaryHexMesh.geometry.dispose();
          MAIN.game.scene.temporaryHexMesh.material.dispose();
        };
      };
    };
    smoothRemoveTemporaryMesh();
  };

  buildOnSector(sector, building) {
    if (this.sectors[sector] === null) {
      const newGeometryArray = [MAIN.renderer.scene.ceilsMesh.geometry];
      // const newGeometryArray = [ MAIN.game.scene.buildingsMesh.geometry];


      if (!this.centralRoad) {

        this.centralRoad = true;
        let centralRoadGeometry
        if (this.type === 'meadow' || this.type === 'sand' || this.type === 'steelMine' || this.type === 'goldMine' ) {
          centralRoadGeometry = MAIN.game.scene.assets.geometries.roadCenter.clone();
        };
        if (this.type === 'sea') {
          centralRoadGeometry = MAIN.game.scene.assets.geometries.bridgeCentral.clone();
        };
        centralRoadGeometry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(centralRoadGeometry);
      };

      let buildGeommetry;
      if (building === 'road') {
        let cityClose = false;
        if (this.neighbours[sector]) {
          if (this.neighbours[sector].cityCeil) {
            cityClose = true;
          };
        };
        if (cityClose) {
          buildGeommetry = MAIN.game.scene.assets.geometries.cityStorage.clone();
          buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
          buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
          newGeometryArray.push(buildGeommetry);
        } else {
          buildGeommetry = MAIN.game.scene.assets.geometries[building].clone();
          buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
          buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
          newGeometryArray.push(buildGeommetry);

          function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
          };
          //выбираем один из элементов декора
          const decorRandom = getRandomIntInclusive(1, 4);
          //ставится он в 50%
          if (Math.random() > 0.5) {
            const decorGeometry = MAIN.game.scene.assets.geometries['roadDecor' + decorRandom].clone();
            decorGeometry.rotateY((sector * (-60) * Math.PI / 180));
            decorGeometry.translate(this.position.x, this.position.y, this.position.z);
            newGeometryArray.push(decorGeometry);

          };
        };






        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;
        this.sectors[sector] = 'road';



        const lightArray = [MAIN.game.scene.lights.buildingLights.geometry];
        const thisLightGeometry = MAIN.game.scene.assets.geometries.roadLight.clone()
        thisLightGeometry.rotateY((sector * (-60) * Math.PI / 180));
        thisLightGeometry.translate(this.position.x, this.position.y, this.position.z);
        lightArray.push(thisLightGeometry);
        const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);

        MAIN.game.scene.lights.buildingLights.geometry.dispose();
        delete MAIN.game.scene.lights.buildingLights.geometry;
        MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

      };

      if (building === 'bridge') {
        let lightGeometry;
        if (this.neighbours[sector].type === 'meadow' || this.neighbours[sector].type === 'sand' || this.neighbours[sector].type === 'steelMine' || this.neighbours[sector].type === 'goldMine' || this.neighbours[sector].cityCeil) {
          buildGeommetry = MAIN.game.scene.assets.geometries.bridge.clone();
          buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
          buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
          newGeometryArray.push(buildGeommetry);
          this.sectors[sector] = 'bridge';

          lightGeometry = MAIN.game.scene.assets.geometries.bridgeLight.clone();
        };
        if (this.neighbours[sector].type === 'sea') {
          buildGeommetry = MAIN.game.scene.assets.geometries.bridgeStraight.clone();
          buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
          buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
          newGeometryArray.push(buildGeommetry);
          this.sectors[sector] = 'bridgeStraight';


          lightGeometry = MAIN.game.scene.assets.geometries.bridgeStraightLight.clone();
        };



        // если два построено, то добавляем борты
        let nonEmptySectors = 0;

        this.sectors.forEach((thisSector, i) => {
          if (thisSector === 'bridge' || thisSector === 'bridgeStraight') {
            nonEmptySectors++;
          };
        });
        if (nonEmptySectors === 2) {
          this.sectors.forEach((thisSector, i) => {
            if (thisSector === null || thisSector === 'full') {
              const borderGeometry = MAIN.game.scene.assets.geometries.bridgeBorder.clone();
              borderGeometry.rotateY((i * (-60) * Math.PI / 180));
              borderGeometry.translate(this.position.x, this.position.y, this.position.z);
              newGeometryArray.push(borderGeometry);
            };
          });
        };

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;

        if (lightGeometry) {
          const lightArray = [MAIN.game.scene.lights.buildingLights.geometry];
          lightGeometry.rotateY((sector * (-60) * Math.PI / 180));
          lightGeometry.translate(this.position.x, this.position.y, this.position.z);
          lightArray.push(lightGeometry);

          const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
          MAIN.game.scene.lights.buildingLights.geometry.dispose();
          delete MAIN.game.scene.lights.buildingLights.geometry;
          MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;
        };
      };


      if (building === 'sawmill') {
        buildGeommetry = MAIN.game.scene.assets.geometries.sawmill.clone();
        buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
        buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(buildGeommetry);

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;


        const lightGeometry = MAIN.game.scene.assets.geometries.sawmillLight.clone();
        const lightArray = [MAIN.game.scene.lights.buildingLights.geometry];
        lightGeometry.rotateY((sector * (-60) * Math.PI / 180));
        lightGeometry.translate(this.position.x, this.position.y, this.position.z);
        lightArray.push(lightGeometry);

        const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
        MAIN.game.scene.lights.buildingLights.geometry.dispose();
        delete MAIN.game.scene.lights.buildingLights.geometry;
        MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

        this.sectors[sector] = 'sawmill';
      };

      if (building === 'waterStation') {
        buildGeommetry = MAIN.game.scene.assets.geometries.waterStation.clone();
        buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
        buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(buildGeommetry);

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;


        // const lightGeometry = MAIN.game.scene.assets.geometries.sawmillLight.clone();
        // const lightArray =  [MAIN.game.scene.lights.buildingLights.geometry];
        // lightGeometry.rotateY((sector*(-60) * Math.PI/180));
        // lightGeometry.translate(this.position.x,this.position.y,this.position.z);
        // lightArray.push(lightGeometry);

        // const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
        // MAIN.game.scene.lights.buildingLights.geometry.dispose();
        // delete MAIN.game.scene.lights.buildingLights.geometry;
        // MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

        this.sectors[sector] = 'waterStation';


        //также у соседнего сектора закрываем доступ к стройке тут
        const indexInNeighbour = this.neighbours[sector].neighbours.indexOf(this);
        this.neighbours[sector].sectors[indexInNeighbour] = 'full';
      };

      if (building === 'sandMine') {
        buildGeommetry = MAIN.game.scene.assets.geometries.sandMine.clone();
        buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
        buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(buildGeommetry);

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;


        // const lightGeometry = MAIN.game.scene.assets.geometries.sawmillLight.clone();
        // const lightArray =  [MAIN.game.scene.lights.buildingLights.geometry];
        // lightGeometry.rotateY((sector*(-60) * Math.PI/180));
        // lightGeometry.translate(this.position.x,this.position.y,this.position.z);
        // lightArray.push(lightGeometry);

        // const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
        // MAIN.game.scene.lights.buildingLights.geometry.dispose();
        // delete MAIN.game.scene.lights.buildingLights.geometry;
        // MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

        this.sectors[sector] = 'sandMine';
      };

      if (building === 'steelMill') {
        buildGeommetry = MAIN.game.scene.assets.geometries.steelMill.clone();
        buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
        buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(buildGeommetry);

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;


        // const lightGeometry = MAIN.game.scene.assets.geometries.sawmillLight.clone();
        // const lightArray =  [MAIN.game.scene.lights.buildingLights.geometry];
        // lightGeometry.rotateY((sector*(-60) * Math.PI/180));
        // lightGeometry.translate(this.position.x,this.position.y,this.position.z);
        // lightArray.push(lightGeometry);

        // const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
        // MAIN.game.scene.lights.buildingLights.geometry.dispose();
        // delete MAIN.game.scene.lights.buildingLights.geometry;
        // MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

        this.sectors[sector] = 'steelMill';
      };

      if (building === 'goldMill') {
        buildGeommetry = MAIN.game.scene.assets.geometries.goldMill.clone();
        buildGeommetry.rotateY((sector * (-60) * Math.PI / 180));
        buildGeommetry.translate(this.position.x, this.position.y, this.position.z);
        newGeometryArray.push(buildGeommetry);

        const newGeometry = BufferGeometryUtils.mergeBufferGeometries(newGeometryArray);
        MAIN.renderer.scene.ceilsMesh.geometry.dispose();
        delete MAIN.renderer.scene.ceilsMesh.geometry;
        MAIN.renderer.scene.ceilsMesh.geometry = newGeometry;


        // const lightGeometry = MAIN.game.scene.assets.geometries.sawmillLight.clone();
        // const lightArray =  [MAIN.game.scene.lights.buildingLights.geometry];
        // lightGeometry.rotateY((sector*(-60) * Math.PI/180));
        // lightGeometry.translate(this.position.x,this.position.y,this.position.z);
        // lightArray.push(lightGeometry);

        // const newLightGeometry = BufferGeometryUtils.mergeBufferGeometries(lightArray);
        // MAIN.game.scene.lights.buildingLights.geometry.dispose();
        // delete MAIN.game.scene.lights.buildingLights.geometry;
        // MAIN.game.scene.lights.buildingLights.geometry = newLightGeometry;

        this.sectors[sector] = 'goldMill';
      };

    };
  };

  getSectorPosition(sector) {
    const zeroPoint = this.position;
    const radius = (Math.sqrt(3) / 2) / 1.5;
    const angle = (sector * (-60) + 150) * Math.PI / 180;

    const position = {
      x: Math.sin(angle) * radius,
      y: 0,
      z: Math.cos(angle) * radius,
    };
    position.x += this.position.x;
    position.z += this.position.z;


    return position;
    // MAIN.game.scene.testMesh.position.set(position.x,position.y,position.z);
  };




  getDistanceToCeil(ceil) {
    const thisVector = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
    const ceilVector = new THREE.Vector3(ceil.position.x, ceil.position.y, ceil.position.z);
    return thisVector.distanceTo(ceilVector);
  };
};

export {
  FieldCeil
};
