// модуль, отвечающий за перемещение камеры
import {
  MAIN
} from '../../../main.js';

function changeZoom(value) {
  CAMERA.configs.zoom.current += value;
  if (CAMERA.configs.zoom.current > CAMERA.configs.zoom.max) {
    CAMERA.configs.zoom.current = CAMERA.configs.zoom.max;
  };
  if (CAMERA.configs.zoom.current < CAMERA.configs.zoom.min) {
    CAMERA.configs.zoom.current = CAMERA.configs.zoom.min;
  };
};

function rotate(value) {
  CAMERA.configs.rail.angle += value;
  if (CAMERA.configs.rail.angle > 360) {
    CAMERA.configs.rail.angle = CAMERA.configs.rail.angle - 360;
  };
  if (CAMERA.configs.rail.angle < 0) {
    CAMERA.configs.rail.angle = 360 + CAMERA.configs.rail.angle;
  };
};

function changeCameraAngleByValue(value) {
  //нужно для мобильных
  CAMERA.configs.rail.yAngle.current += value;
  if (CAMERA.configs.rail.yAngle.current > CAMERA.configs.rail.yAngle.max) {
    CAMERA.configs.rail.yAngle.current = CAMERA.configs.rail.yAngle.max;
  };
  if (CAMERA.configs.rail.yAngle.current < CAMERA.configs.rail.yAngle.min) {
    CAMERA.configs.rail.yAngle.current = CAMERA.configs.rail.yAngle.min;
  };
};

function changeCameraAngle() {
  CAMERA.configs.rail.yAngle.current += CAMERA.shifts.z;
  if (CAMERA.configs.rail.yAngle.current > CAMERA.configs.rail.yAngle.max) {
    CAMERA.configs.rail.yAngle.current = CAMERA.configs.rail.yAngle.max;
  };
  if (CAMERA.configs.rail.yAngle.current < CAMERA.configs.rail.yAngle.min) {
    CAMERA.configs.rail.yAngle.current = CAMERA.configs.rail.yAngle.min;
  };
};

function changeTargetPosition(position) {
  // позиция меняется следующим образом:
  // текущая точка считается как 0:0
  // и к ней уже прибавляется сдвиг по градусу, откуда смотрит камера
  // если это сдвиг вправо-влево, то есть сдвиг по градусу -90
  if (position) {
    CAMERA.configs.target.point.x = position.x;
    CAMERA.configs.target.point.z = position.z;
    return;
  } else {
    //вверх - низ
    CAMERA.configs.target.point.x += -CAMERA.shifts.y * Math.sin(CAMERA.configs.rail.angle * Math.PI / 180);
    CAMERA.configs.target.point.z += -CAMERA.shifts.y * Math.cos(CAMERA.configs.rail.angle * Math.PI / 180);
    // лево-право
    CAMERA.configs.target.point.x += -CAMERA.shifts.x * Math.sin((CAMERA.configs.rail.angle - 90) * Math.PI / 180);
    CAMERA.configs.target.point.z += -CAMERA.shifts.x * Math.cos((CAMERA.configs.rail.angle - 90) * Math.PI / 180);

    if (CAMERA.configs.target.point.x > 10) {
      CAMERA.configs.target.point.x = 10;
    };
    if (CAMERA.configs.target.point.x < -10) {
      CAMERA.configs.target.point.x = -10;
    };
    if (CAMERA.configs.target.point.z > 10) {
      CAMERA.configs.target.point.z = 10;
    };
    if (CAMERA.configs.target.point.z < -10) {
      CAMERA.configs.target.point.z = -10;
    };
  };

};

function update() {
  changeTargetPosition();
  changeCameraAngle();
  const camera = MAIN.renderer.camera;

  CAMERA.configs.rail.radius.current = (CAMERA.configs.rail.yAngle.max - CAMERA.configs.rail.yAngle.current) * 0.5 * CAMERA.configs.zoom.current;
  CAMERA.configs.rail.radius.current === 0 ? CAMERA.configs.rail.radius.current = 0.1 : false;
  CAMERA.configs.rail.height = CAMERA.configs.rail.yAngle.current * CAMERA.configs.zoom.current;

  const position = {
    x: CAMERA.configs.target.point.x + (CAMERA.configs.rail.radius.current * Math.sin(CAMERA.configs.rail.angle * Math.PI / 180)),
    y: CAMERA.configs.rail.height,
    z: CAMERA.configs.target.point.z + (CAMERA.configs.rail.radius.current * Math.cos(CAMERA.configs.rail.angle * Math.PI / 180)),
  };

  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(CAMERA.configs.target.point.x, 0, CAMERA.configs.target.point.z);

};

function init() {
  const cameraGUI = MAIN.GUI.addFolder('Camera');
  const target = cameraGUI.addFolder('Targer');
  target.add(CAMERA.configs.target.point, 'x').min(-10).max(10).onChange(() => {
    // update();
  });
  target.add(CAMERA.configs.target.point, 'z').min(-10).max(10).onChange(() => {
    // update();
  });
  //
  cameraGUI.add(CAMERA.configs.zoom, 'current').name('zoom').min(2).max(10).onChange(() => {
    // update();
  });

  cameraGUI.add(CAMERA.configs.rail.yAngle, 'current').name('yAngle').min(1).max(4).onChange(() => {
    // update();
  });

  cameraGUI.add(CAMERA.configs.rail, 'angle').name('angle').min(0).max(360).onChange(() => {
    // update();
  });
};


const CAMERA = {
  configs: {
    target: {
      point: {
        x: 0,
        y: 0,
        z: 0
      },
      x: 0,
      y: 0,

      angle: 0,
      radius: {
        max: 10,
        min: 1,
        current: 10,
      },

    },
    rail: {
      radius: {
        current: 10,
      },
      //two finger up/down min:-10,max:10,
      yAngle: {
        min: 1,
        max: 4,
        current: 2,
      },
      height: 10,
      angle: 90,
    },
    //pinch/wheel min:1,max:10,
    zoom: {
      max: 20,
      min: 2,
      current: 8,
    },
  },
  shifts: {
    x: 0,
    y: 0,
    z: 0,
    speed: 0.25,
  },
  rotate,
  changeZoom,
  update,
  init,
  changeTargetPosition,
};

export {
  CAMERA
};
