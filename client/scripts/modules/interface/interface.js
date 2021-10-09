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





function init() {
  INTERFACE.camera = CAMERA;
  INTERFACE.camera.init();

  INTERFACE.console = MCONSOLE;
  INTERFACE.console.init();
  const target = MAIN.renderer.renderer.domElement;
  target.addEventListener('mousemove', function(event) {
    INTERFACE.mouse.x = event.clientX;
    INTERFACE.mouse.y = event.clientY;
    // INTERFACE.camera.update();
  });
  target.addEventListener('contextmenu', function(event) {
    event.preventDefault();
  });
  target.addEventListener('mousedown', function(event) {
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
    if (event.button === 0) {
      INTERFACE.mouse.clicked = false;
    };
    if (event.button === 2) {
      INTERFACE.mouse.context = false;
    };
  });


  //disable pinch zoom on touchpad
  target.addEventListener('wheel', function(event) {
    event.preventDefault();
    INTERFACE.camera.changeZoom(event.deltaY * 0.005);
    INTERFACE.camera.rotate(event.deltaX * 0.5);
  });
  //disable pinch zoom on phones
  target.addEventListener('touchstart', function(event) {
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

      INTERFACE.touch.coords.x = event.targetTouches[0].pageX;
      INTERFACE.touch.coords.y = event.targetTouches[0].pageY;

    };
  });
  target.addEventListener('touchmove', function(event) {
    if (event.targetTouches.length === 2) {
      const x1 = event.targetTouches[0].pageX;
      const x2 = event.targetTouches[1].pageX;
      const y1 = event.targetTouches[0].pageY;
      const y2 = event.targetTouches[1].pageY;
      // INTERFACE.touch.length =  Math.hypot(x2-x1, y2-y1);
      const length = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
      const deltaLength = length - INTERFACE.touch.length;
      INTERFACE.touch.length = length;

      if (deltaLength > INTERFACE.touch.maxDivergence * (-1) && deltaLength < INTERFACE.touch.maxDivergence) {
        const valueX = event.targetTouches[0].pageX - INTERFACE.touch.shift.x;
        const valueY = event.targetTouches[0].pageY - INTERFACE.touch.shift.y;

        //баг скачков
        if (valueX > -50 && valueX < 50) {
          INTERFACE.camera.rotate(-valueX * 0.5);
        };
        if (valueY > -50 && valueY < 50) {
          INTERFACE.camera.shifts.z = -valueY * 0.01;
        };

        INTERFACE.touch.shift.x = event.targetTouches[0].pageX;
        INTERFACE.touch.shift.y = event.targetTouches[0].pageY;


      } else if (deltaLength > INTERFACE.touch.maxDivergence) {
        //баг скачков
        if (deltaLength > -100 && deltaLength < 100) {
          INTERFACE.camera.changeZoom(-deltaLength * 0.01)
        };
      } else if (deltaLength < INTERFACE.touch.maxDivergence * (-1)) {
        //баг скачков
        if (deltaLength > -100 && deltaLength < 100) {
          INTERFACE.camera.changeZoom(-deltaLength * 0.01)
        };
      };
    };
    if (event.targetTouches.length === 1) {
      INTERFACE.camera.shifts.y = (INTERFACE.touch.coords.y - event.targetTouches[0].pageY) * (-0.025);
      INTERFACE.camera.shifts.x = (INTERFACE.touch.coords.x - event.targetTouches[0].pageX) * (0.025);

      INTERFACE.touch.coords.x = event.targetTouches[0].pageX;
      INTERFACE.touch.coords.y = event.targetTouches[0].pageY;
    };
  });

  target.addEventListener('touchend', function(event) {
    event.preventDefault();
    if (event.targetTouches.length != 2) {
      INTERFACE.touch.double = false;
      INTERFACE.doubbleTouchShiftValue.x = 0;
      INTERFACE.doubbleTouchShiftValue.y = 0;
    };
    INTERFACE.touch.single = false;
    INTERFACE.camera.shifts.y = 0;
    INTERFACE.camera.shifts.x = 0;
  });
};

function checkEvents() {
  /******PC*****/

  /*
    Camera move
  */
  if (INTERFACE.mouse.context) {
    INTERFACE.camera.shifts.z = (INTERFACE.mouse.oncontextPosition.y - INTERFACE.mouse.y) * (0.01);
    INTERFACE.camera.rotate((INTERFACE.mouse.oncontextPosition.x - INTERFACE.mouse.x) * 0.5);
    INTERFACE.mouse.oncontextPosition.x = INTERFACE.mouse.x;
    INTERFACE.mouse.oncontextPosition.y = INTERFACE.mouse.y;
  } else {
    if (!INTERFACE.touch.double) {
      INTERFACE.camera.shifts.z = 0;
    };
  };
  const cameraMoveActiveZone = 50;
  if (!INTERFACE.mouse.clicked) {
    if (INTERFACE.mouse.y < window.innerHeight / cameraMoveActiveZone) {
      //move forward
      INTERFACE.camera.shifts.y = INTERFACE.camera.shifts.speed;
    } else if (INTERFACE.mouse.y > (window.innerHeight - window.innerHeight / cameraMoveActiveZone)) {
      //move backward
      INTERFACE.camera.shifts.y = -INTERFACE.camera.shifts.speed;
    } else {
      if (!INTERFACE.touch.single) {
        INTERFACE.camera.shifts.y = 0;
      };
    };

    if (INTERFACE.mouse.x < (window.innerWidth / cameraMoveActiveZone)) {
      //move left
      INTERFACE.camera.shifts.x = -INTERFACE.camera.shifts.speed;
    } else if (INTERFACE.mouse.x > (window.innerWidth - window.innerWidth / cameraMoveActiveZone)) {
      //move right
      INTERFACE.camera.shifts.x = INTERFACE.camera.shifts.speed;
    } else {
      if (!INTERFACE.touch.single) {
        INTERFACE.camera.shifts.x = 0;
      };
    };
  } else {
    INTERFACE.camera.shifts.x = (INTERFACE.mouse.onclickPosition.x - INTERFACE.mouse.x) * (0.01);
    INTERFACE.camera.shifts.y = (INTERFACE.mouse.onclickPosition.y - INTERFACE.mouse.y) * (-0.01);
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
  doubleTouchMaxDivergence: 5,
  doubbleTouch: false,
  doubbleTouchShiftValue: {
    x: 0,
    y: 0,
  },

  touch: {
    single: false,
    double: false,
    length: 0,
    maxDivergence: 5,
    shift: {
      x: 0,
      y: 0,
    },
    coords: {
      x: 0,
      y: 0,
    },
  },


  //события будут проверяться в рендере  после того, как все будет готово.
  //смена флага происходит в scene.js
  startedCheckEvents: false,
};

export {
  INTERFACE
};
