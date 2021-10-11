//модуль действий пользователя
import {
  MAIN
} from '../../main.js';
import {
  MCONSOLE
} from './mobileConsole/mobileConsole.js';
import {
  GAME_INTERFACE
} from './game/gameInterface.js';


function pushRaycast(click){
  const mouse = {x:0,y:0};
  mouse.x = ( INTERFACE.mouse.x / window.innerWidth ) * 2 - 1;
  mouse.y = - ( INTERFACE.mouse.y / window.innerHeight ) * 2 + 1;
  MAIN.renderer.raycaster.setFromCamera(mouse, MAIN.renderer.camera);
  const intersects = MAIN.renderer.raycaster.intersectObjects( MAIN.game.scene.hitBoxGroup.children  );
  if(intersects[0]){
    if(click === 2){
      INTERFACE.game.camera.moveCameraTo(  intersects[0].object.userData.position);
      intersects[0].object.userData.onClick(intersects[0].point);
    };
  };
};

function deleteTouches(elem){
  elem.addEventListener('wheel',(event) => {
    event.preventDefault();
  });

  elem.addEventListener('mousedown',(event)=>{
    event.preventDefault();
  });

  elem.addEventListener('contextmenu',(event)=>{
    event.preventDefault();
  });

  elem.addEventListener('dblclick',(event)=>{
    event.preventDefault();
  });
  elem.addEventListener('touchstart',(event)=>{
    event.preventDefault();
  });

  elem.addEventListener('touchmove',(event)=>{
    event.preventDefault();
  });
};



function init() {
  deleteTouches(document.querySelector('#sectorMenu'));



  INTERFACE.game = GAME_INTERFACE;
  INTERFACE.console = MCONSOLE;
  INTERFACE.console.init();

  const target = MAIN.renderer.renderer.domElement;
  target.addEventListener('mousemove', function(event) {
    INTERFACE.mouse.x = event.clientX;
    INTERFACE.mouse.y = event.clientY;
  });
  target.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  target.addEventListener('mousedown', function(event) {
    INTERFACE.game.ceilMenu.hideSectorMenu();
    event.preventDefault();
    if (event.button === 0) {
      INTERFACE.mouse.onclickPosition.x = event.clientX;
      INTERFACE.mouse.onclickPosition.y = event.clientY;
      INTERFACE.mouse.clicked = true;
    };
    if (event.button === 2) {
      INTERFACE.mouse.oncontextPosition.x = event.clientX;
      INTERFACE.mouse.oncontextPosition.y = event.clientY;
      INTERFACE.mouse.context = true;
    };

  });
  target.addEventListener('mouseup', function(event) {
    event.preventDefault();
    if (event.button === 0) {
      INTERFACE.mouse.clicked = false;
    };
    if (event.button === 2) {
      INTERFACE.mouse.context = false;
    };
  });
  target.addEventListener('dblclick',function(event){
    INTERFACE.game.ceilMenu.hideSectorMenu();
    event.preventDefault();
    pushRaycast(2);
  });



  target.addEventListener('wheel', function(event) {
    INTERFACE.game.ceilMenu.hideSectorMenu();
    event.preventDefault();
    INTERFACE.game.camera.changeZoom(event.deltaY * 0.005);
    INTERFACE.game.camera.rotate(event.deltaX * 0.5);
  });


  target.addEventListener('touchstart', function(event) {
    INTERFACE.game.ceilMenu.hideSectorMenu();
    event.preventDefault();
    if (event.targetTouches.length === 2) {
      const x1 = event.targetTouches[0].pageX;
      const x2 = event.targetTouches[1].pageX;
      const y1 = event.targetTouches[0].pageY;
      const y2 = event.targetTouches[1].pageY;
      // INTERFACE.touch.length =  Math.hypot(x2-x1, y2-y1);
      INTERFACE.touch.length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      INTERFACE.touch.double = true;
    };
    if (event.targetTouches.length === 1) {
      INTERFACE.touch.single = true;
      INTERFACE.mouse.x = event.targetTouches[0].pageX;
      INTERFACE.mouse.y = event.targetTouches[0].pageY;
      INTERFACE.touch.coords.x = event.targetTouches[0].pageX;
      INTERFACE.touch.coords.y = event.targetTouches[0].pageY;

      if((Date.now() - INTERFACE.touch.lastTime) < 250){
        target.dispatchEvent(new CustomEvent("touchDoubleClick", {
        }));
      };
      INTERFACE.touch.lastTime = Date.now();
    };
  });
  target.addEventListener('touchDoubleClick',function(event){
    event.preventDefault();
    pushRaycast(2);
  });

  target.addEventListener('touchmove', function(event) {
    // event.preventDefault();
    if (event.targetTouches.length === 2) {
      const x1 = event.targetTouches[0].pageX;
      const x2 = event.targetTouches[1].pageX;
      const y1 = event.targetTouches[0].pageY;
      const y2 = event.targetTouches[1].pageY;
      // INTERFACE.touch.length =  Math.hypot(x2-x1, y2-y1);
      const length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      const deltaLength = length - INTERFACE.touch.length;
      INTERFACE.touch.length = length;

      if (deltaLength >= INTERFACE.touch.maxDivergence * (-1) && deltaLength <= INTERFACE.touch.maxDivergence) {
        const valueX = event.targetTouches[0].pageX - INTERFACE.touch.shift.x;
        const valueY = event.targetTouches[0].pageY - INTERFACE.touch.shift.y;

        //баг скачков
        if (valueX > -100 && valueX < 100) {
          if(valueX <-3 || valueX > 3){
            INTERFACE.game.camera.rotate(-valueX * 0.5);
          };
        };
        if (valueY > -100 && valueY < 100) {
          if(valueY <-3 || valueY > 3){
            INTERFACE.game.camera.shifts.z = -valueY * 0.01;
          }else{
            //чтобы не поднималос когда 2 пальца не отпущены
            INTERFACE.game.camera.shifts.z = 0;
          }
        }else{
          INTERFACE.game.camera.shifts.z = 0;
        }

        INTERFACE.touch.shift.x = event.targetTouches[0].pageX;
        INTERFACE.touch.shift.y = event.targetTouches[0].pageY;


      } else if (deltaLength > INTERFACE.touch.maxDivergence) {
        //баг скачков
        if (deltaLength > -100 && deltaLength < 100) {
          INTERFACE.game.camera.changeZoom(-deltaLength * 0.05)
        };
      } else if (deltaLength < INTERFACE.touch.maxDivergence * (-1)) {
        //баг скачков
        if (deltaLength > -100 && deltaLength < 100) {
          INTERFACE.game.camera.changeZoom(-deltaLength * 0.05)
        };
      };
    };
    if (event.targetTouches.length === 1) {
      INTERFACE.game.camera.shifts.x = (INTERFACE.touch.coords.x - event.targetTouches[0].pageX) * (0.025);
      INTERFACE.game.camera.shifts.y = (INTERFACE.touch.coords.y - event.targetTouches[0].pageY) * (-0.025);

      INTERFACE.touch.coords.x = event.targetTouches[0].pageX;
      INTERFACE.touch.coords.y = event.targetTouches[0].pageY;
    };
  });

  target.addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.targetTouches.length != 2) {
      INTERFACE.touch.double = false;
      INTERFACE.touch.doubbleTouchShiftValue.x = 0;
      INTERFACE.touch.doubbleTouchShiftValue.y = 0;
    };
    INTERFACE.touch.single = false;
    INTERFACE.game.camera.shifts.y = 0;
    INTERFACE.game.camera.shifts.x = 0;
  });
};

function checkEvents() {
  /******PC*****/

  /*
    Camera move
  */
  if (INTERFACE.mouse.context) {
    INTERFACE.game.camera.shifts.z = (INTERFACE.mouse.oncontextPosition.y - INTERFACE.mouse.y) * (0.01);
    INTERFACE.game.camera.rotate((INTERFACE.mouse.oncontextPosition.x - INTERFACE.mouse.x) * 0.5);
    INTERFACE.mouse.oncontextPosition.x = INTERFACE.mouse.x;
    INTERFACE.mouse.oncontextPosition.y = INTERFACE.mouse.y;
  } else {
    if (!INTERFACE.touch.double) {
      INTERFACE.game.camera.shifts.z = 0;
    };
  };
  const cameraMoveActiveZone = 50;
  if (!INTERFACE.mouse.clicked) {
    if (INTERFACE.mouse.y < window.innerHeight / cameraMoveActiveZone) {
      //move forward
      INTERFACE.game.camera.shifts.y = INTERFACE.game.camera.shifts.speed;
    } else if (INTERFACE.mouse.y > (window.innerHeight - window.innerHeight / cameraMoveActiveZone)) {
      //move backward
      INTERFACE.game.camera.shifts.y = -INTERFACE.game.camera.shifts.speed;
    } else {
      if (!INTERFACE.touch.single) {
        INTERFACE.game.camera.shifts.y = 0;
      };
    };

    if (INTERFACE.mouse.x < (window.innerWidth / cameraMoveActiveZone)) {
      //move left
      INTERFACE.game.camera.shifts.x = -INTERFACE.game.camera.shifts.speed;
    } else if (INTERFACE.mouse.x > (window.innerWidth - window.innerWidth / cameraMoveActiveZone)) {
      //move right
      INTERFACE.game.camera.shifts.x = INTERFACE.game.camera.shifts.speed;
    } else {
      if (!INTERFACE.touch.single) {
        INTERFACE.game.camera.shifts.x = 0;
      };
    };
  } else {
    INTERFACE.game.camera.shifts.x = (INTERFACE.mouse.onclickPosition.x - INTERFACE.mouse.x) * (0.01);
    INTERFACE.game.camera.shifts.y = (INTERFACE.mouse.onclickPosition.y - INTERFACE.mouse.y) * (-0.01);
    INTERFACE.mouse.onclickPosition.x = INTERFACE.mouse.x;
    INTERFACE.mouse.onclickPosition.y = INTERFACE.mouse.y;
  };
};



const INTERFACE = {
  init,
  checkEvents,
  mouse: {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    clicked: false,
    onclickPosition: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    },
    context: false,
    oncontextPosition: {
      x: 0,
      y: 0
    },
  },

  touch: {
    single: false,
    double: false,
    length: 0,
    maxDivergence: 10,
    lastTime:Date.now(),
    shift: {
      x: 0,
      y: 0,
    },
    doubbleTouchShiftValue: {
      x: 0,
      y: 0,
    },
    coords: {
      x: 0,
      y: 0,
    },
  },

  sectorMenuIsDisplayed:{

  },

  //события будут проверяться в рендере  после того, как все будет готово.
  //смена флага происходит в scene.js
  startedCheckEvents: false,
};

export {
  INTERFACE
};
