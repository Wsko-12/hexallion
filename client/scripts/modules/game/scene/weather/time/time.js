import {
  MAIN
} from '../../../../../main.js';


function update(){
  TIME.g += 1;

  TIME.m += 1;
  if(TIME.m === 60){
    TIME.m = 0;
    TIME.h += 1;
    if(TIME.h === 24){
      TIME.h = 0;
    };
  };

  MAIN.game.scene.sun.update();

  // setTimeout(()=>{
  //   update();
  // },150);
}
function init(){
  TIME.m = 0;
  TIME.h = 14;
  TIME.g = 0;
  TIME.time = 'morning';
  update();

  const timeGUI = MAIN.GUI.addFolder('time');
  timeGUI.add(TIME, 'h', 0, 23).step(1).onChange(function(value) {
    TIME.h = Number(value);
    MAIN.game.scene.sun.update();
  });

  timeGUI.add(TIME, 'time', { morning: 'morning', day: 'day', evening: 'evening' } ).onChange((value)=>{
    TIME.time = value;
    MAIN.game.scene.sun.update();
  });

};




const TIME = {
  init,
};

export {
  TIME
};
