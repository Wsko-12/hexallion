import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../../libs/ThreeJsLib/build/three.module.js';

// import * as DAT from '../../../libs/gui/dat.gui.module.js';
import { BufferGeometryUtils } from '../../../../../libs/ThreeJsLib/examples/jsm/utils/BufferGeometryUtils.js';



class Cloud {
  constructor(first){
    this.object3D = null;
    this.id = generateId('Cloud',4);


    if(first){
      this.position = {x:0,y:0,z:0};
      this.position.x = (Math.random()-0.5) * 15;
      this.position.z = (Math.random()-0.5) * 15;
    }else{
      this.position = {x:0,y:0,z:-10};
      this.position.x = (Math.random()-0.5) * 15;
    }

    this.scale = 0;

    this.startDelete = false;
    this.create();
  };
  create(){
    const cloudGeometry = [];
   for(let i = 0; i< (1+ Math.round(Math.random()*10));i++){
     const geometry = new THREE.SphereGeometry( (Math.random()*2 + 0.5), 9, 5 );
     geometry.translate((Math.random()-0.5)*10,(Math.random()-0.5)*2,(Math.random()-0.5)*10);
     geometry.scale(1,0.5,Math.random() + 1);
     geometry.scale(0.5,0.5,0.5);
     cloudGeometry.push(geometry);
   };

   this.object3D = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(cloudGeometry),MAIN.game.scene.cloudsMaterial);
   // MAIN.game.scene.testMesh = testMesh;
   // this.object3D.castShadow = true;





   this.object3D.position.set(this.position.x,8,this.position.z);
   MAIN.game.scene.cloudsGroup.add(this.object3D);
  };


  animate(){
    if(!this.startDelete){
      if(this.scale < 1){
        this.scale += 0.005;
        this.object3D.scale.set(this.scale,this.scale,this.scale);
      };
      this.position.z += 0.005;
      this.object3D.position.set(this.position.x,8,this.position.z);


      if(this.position.z > 5){
        if(!this.startDelete){
            this.delete();
        };
      };
    };

  };


  delete(){
    this.startDelete = true;

    let animateStatus = 0;
    const that = this
    function animate(){
      if(that.scale > 0){
        that.scale -= 0.001;
        that.object3D.scale.set(that.scale,that.scale,that.scale);

        that.position.z += 0.005;
        that.object3D.position.set(that.position.x,8,that.position.z);
        window.requestAnimationFrame(animate);
      }else{
        that.object3D.removeFromParent();
        that.object3D.geometry.dispose();

        delete CLOUDS.all[that.id];

        const cloud = new Cloud(false);
        CLOUDS.all[cloud.id] = cloud;
      };
    };
    animate();

  };

};


function init(){


  for(let i = 0; i< 5; i++){
    const cloud = new Cloud(true);
    CLOUDS.all[cloud.id] = cloud;
  };





};

function animate(){
  for(let cloud in CLOUDS.all){
    CLOUDS.all[cloud].animate()
  }

};

// const cloudGeometry = [];
// for(let i = 0; i< (1+ Math.round(Math.random()*10));i++){
//   const geometry = new THREE.SphereGeometry( (Math.random()*2 + 0.5), 9, 5 );
//   geometry.translate((Math.random()-0.5)*3.5,(Math.random()-0.5)*3.5,(Math.random()-0.5)*3.5);
//   geometry.scale(1,Math.random()+0.2,1);
//   geometry.scale(0.5,0.5,0.5);
//   cloudGeometry.push(geometry);
// };
//
// const cloudMesh = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(cloudGeometry),MAIN.game.scene.cloudsMaterial);
// // MAIN.game.scene.testMesh = testMesh;
// cloudMesh.castShadow = true;
// cloudMesh.position.set(0,8,0);
// RENDERER.scene.add(cloudMesh);


const CLOUDS = {
  all:{},
  init,
  animate,
};


export {
  CLOUDS
};
