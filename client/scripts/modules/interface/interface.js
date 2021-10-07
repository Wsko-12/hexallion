import {
  MAIN
} from '../../main.js';


function init(){
  document.addEventListener('mousemove',function(e){
    INTERFACE.mouse.x = e.clientX;
    INTERFACE.mouse.y = e.clientY;
  });

};

function initGameInterface(){
  //PC
  document.addEventListener('dblclick',function(e){
    const mouse = {x:0,y:0};
    mouse.x = ( INTERFACE.mouse.x / window.innerWidth ) * 2 - 1;
    mouse.y = - ( INTERFACE.mouse.y / window.innerHeight ) * 2 + 1;
    MAIN.renderer.raycaster.setFromCamera(mouse, MAIN.renderer.camera);
    const intersects = MAIN.renderer.raycaster.intersectObjects( MAIN.game.scene.hitBoxGroup.children  );
    if(intersects[0]){
      intersects[0].object.userData.onDblClick(intersects[0].point);
    };
  });


};

const INTERFACE = {
  init,
  initGameInterface,
  mouse:{x:0,y:0},
};

export {
  INTERFACE
};
