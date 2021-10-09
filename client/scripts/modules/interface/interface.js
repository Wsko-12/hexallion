
//модуль действий пользователя
import {
  MAIN
} from '../../main.js';
import {
  CAMERA
} from './camera/camera.js';
import {
  MCONSOLE
} from './mobileConsole/mobileConsole.js';





function init(){
  INTERFACE.camera = CAMERA;
  INTERFACE.console = MCONSOLE;
  INTERFACE.console.init();
  const target = MAIN.renderer.renderer.domElement;
  target.addEventListener('mousemove',function(event){
    INTERFACE.mouse.x = event.clientX;
    INTERFACE.mouse.y = event.clientY;
  });


  //

  //


  //disable pinch zoom on touchpad
  target.addEventListener('wheel', function(event) {
			event.preventDefault();
      // console.log(event.deltaY)
  });
  //disable pinch zoom on phones
  target.addEventListener('touchstart',function(event){
    	event.preventDefault();
      if(event.targetTouches.length === 2){
        INTERFACE.doubbleTouch = true;
        const x1 = event.targetTouches[0].pageX;
        const x2 = event.targetTouches[1].pageX;
        const y1 = event.targetTouches[0].pageY;
        const y2 = event.targetTouches[1].pageY;
        INTERFACE.dobleTouchLength = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
      };
  });
  target.addEventListener('touchmove',function(event){
    if(event.targetTouches.length === 2){
      const x1 = event.targetTouches[0].pageX;
      const x2 = event.targetTouches[1].pageX;
      const y1 = event.targetTouches[0].pageY;
      const y2 = event.targetTouches[1].pageY;
      const length = Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
      const deltaLength = length - INTERFACE.dobleTouchLength;
      INTERFACE.dobleTouchLength = length;

      if(deltaLength > INTERFACE.doubleTouchMaxDivergence*(-1) && deltaLength < INTERFACE.doubleTouchMaxDivergence){
        const rotateValueX = event.targetTouches[0].pageX - INTERFACE.doubbleTouchShiftValue.x;

        INTERFACE.console.log(rotateValueX);
        INTERFACE.doubbleTouchShiftValue.x =  event.targetTouches[0].pageX;

      }else if (deltaLength > INTERFACE.doubleTouchMaxDivergence) {
        // INTERFACE.console.log('zoom in')
      }else if(deltaLength < INTERFACE.doubleTouchMaxDivergence*(-1)){
        // INTERFACE.console.log('zoom out')
      }
    };
  });

  target.addEventListener('touchend',function(event){
      event.preventDefault();
      if(event.targetTouches.length != 2){
        INTERFACE.doubbleTouch = false;
        INTERFACE.doubbleTouchShiftValue.x = 0;
        INTERFACE.doubbleTouchShiftValue.y = 0;
      };
  });
};

function checkEvents(){
  /******PC*****/

  /*
    Camera move
  */
  const cameraMoveActiveZone = 10;
  //move forward
  if(INTERFACE.mouse.y < window.innerHeight/cameraMoveActiveZone){
    // console.log('forward');
  };

  //move backward
  if(INTERFACE.mouse.y > (window.innerHeight - window.innerHeight/cameraMoveActiveZone)){
    // console.log('backward');
  };

  //move left
  if(INTERFACE.mouse.x < (window.innerWidth/cameraMoveActiveZone)){
    // console.log('left');
  };

  //move right
  if(INTERFACE.mouse.x >  (window.innerWidth - window.innerWidth/cameraMoveActiveZone)){
    // console.log('right');
  };


};

const INTERFACE = {
  init,
  checkEvents,
  mouse:{x:0,y:0},
  doubleTouchMaxDivergence:5 ,
  doubbleTouch:false,
  doubbleTouchShiftValue:{
    x:0,
    y:0,
  },



  //события будут проверяться в рендере  после того, как все будет готово.
  //смена флага происходит в scene.js
  startedCheckEvents:false,
};

export {
  INTERFACE
};
