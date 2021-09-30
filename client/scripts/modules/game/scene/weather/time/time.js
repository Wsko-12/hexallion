import {
  MAIN
} from '../../../../../main.js';


function update(){
  TIME.g += 1;

  TIME.m += 1;
  if(TIME.m === 60){
    TIME.m = 0;
    TIME.h += 1;
    if(TIME.h === 12){
      TIME.h = 0;
    };
  };

  MAIN.game.scene.sun.update();

  setTimeout(()=>{
    update();
  },100)
}
function init(){
  TIME.m = 0;
  TIME.h = 0;
  TIME.g = 0;
  update();

};




const TIME = {
  init,
};

export {
  TIME
};
