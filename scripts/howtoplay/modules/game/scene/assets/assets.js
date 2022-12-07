/*
* В этом модуле после загрузки будут хранится все модели, все текстуры, все материалы
*/


import {
  MAIN
} from '../../../../main.js';
import * as THREE from '../../../../../libs/ThreeJsLib/build/three.module.js';

import {
  ATLAS
} from './atlas.js';
import {GLTFLoader} from '../../../../../libs/ThreeJsLib/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const ASSETS = {};

//MAIN.game.scene.assets


ASSETS.geometries = {};
ASSETS.textures = {};




// ASSETS.loadModels = async function(){
//   modelIndex++;
//
//   const modelData = ATLAS.models[modelIndex];
//   // console.log(modelData)
//   const path = ATLAS.modelsPath+modelData.folder+modelData.file;
//   if(modelIndex < ATLAS.models.length){
//     loader.load(path,(model)=>{
//       ASSETS.models[modelData.name] = model.scene.children[0];
//
//     });
//   }else{
//     return true;
//   };
// };



ASSETS.load = async function(){
  let modelIndex = -1;
  let modelsPromise = new Promise((resolve, reject) => {
    function loadModels(){
      modelIndex++;
      document.querySelector('#loadingProgress').style.width = `${((modelIndex/ATLAS.models.length)*100)/2}%`
      if(modelIndex < ATLAS.models.length){
        const modelData = ATLAS.models[modelIndex];

        // перезагрузка
        if(ASSETS.geometries[modelData.name]){
          setTimeout(loadModels)
          return;
        };
        // /перезагрузка


        const path = ATLAS.modelsPath+modelData.folder+modelData.file;
        loader.load(path,(model)=>{
          ASSETS.geometries[modelData.name] = model.scene.children[0].geometry;
          // ASSETS.geometries[modelData.name].scale(0.98,0.98,0.98);
          loadModels();
        });
      }else{
        resolve('all geometries loaded');
      };
    };
    loadModels();
  });
 let modelsLoaded = await modelsPromise;
 if(modelsLoaded){
   let textureIndex = -1;
   let texturesPromise = new Promise((resolve, reject) => {

     function loadTextures(){
       textureIndex++;
       document.querySelector('#loadingProgress').style.width = `${50+((textureIndex/ATLAS.textures.length)*100)/2}%`
       if(textureIndex < ATLAS.textures.length){
         const textureData = ATLAS.textures[textureIndex];

         // перезагрузка
         if(ASSETS.textures[textureData.name]){
           setTimeout(loadTextures);
           return;
         };
         // /перезагрузка



         const path = ATLAS.texturePath+textureData.folder+textureData.file;
         textureLoader.load(path,(texture)=>{
           ASSETS.textures[textureData.name] = texture;
           ASSETS.textures[textureData.name].flipY = false;
           ASSETS.textures[textureData.name].magFilter = THREE.NearestFilter;
            ASSETS.textures[textureData.name].minFilter = THREE.NearestFilter;
           loadTextures();
         });
       }else{
         resolve('all textures loaded');
       };
     };
     loadTextures();
   });
   let texturesLoaded = await texturesPromise;
   if(texturesLoaded){
     return true;
   };
 };

};

ASSETS.getGeometry = (name) =>{
  const geometry = ASSETS.geometries[name].clone();
  return geometry;
};

export {
  ASSETS
};
