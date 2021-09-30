import {
  MAIN
} from '../../../../../main.js';

const colors = [
  [255, 20, 0],
  [255, 120, 0],
  [255, 255, 255],
  [255, 10, 10],
]



function changeColor(){
  const sun = MAIN.game.scene.lights.lightMain;
  const time = MAIN.game.scene.time;
  const allMinutes = 12*60;
  const currentMinute = time.h*60 + time.m;
  const colorsPart = allMinutes/colors.length;
  const currentPart = Math.floor(currentMinute/colorsPart);
  const nextPart = currentPart+1 === colors.length? currentPart:currentPart+1;

  const firstColorValue = colors[currentPart];
  const secondColorValue = colors[nextPart];

  function interpolate(f,s,value){
    const normalizeF = f/255;
    const normalizeS = s/255;


    const f_ = normalizeF*(1-value);
    const s_ = normalizeS*value;

    return Math.round((f_+s_)*255);

  };

  const intValue = (currentMinute - (currentPart*colorsPart))/colorsPart;





  const sunColor = [
    interpolate(colors[currentPart][0],colors[nextPart][0],intValue),
    interpolate(colors[currentPart][1],colors[nextPart][1],intValue),
    interpolate(colors[currentPart][2],colors[nextPart][2],intValue),

  ];

  sun.color.set(`rgb(${sunColor})`);

};

function update(){
  const sunDistance = 10;
  const time = MAIN.game.scene.time;
  const sun = MAIN.game.scene.lights.lightMain;
  const lightAdditional = MAIN.game.scene.lights.lightAdditional;
  const deg = ((180/12)* time.h + (180/12/60)* time.m)-90;

  const p = {
    x:Math.sin(deg*Math.PI/180)*sunDistance,
    y:Math.cos(deg*Math.PI/180)*sunDistance,
  }
  sun.position.set(p.x,p.y,0);
  sun.lookAt(0,0,0);
  lightAdditional.position.set(-p.x,p.y,0);
  lightAdditional.lookAt(0,0,0);

  changeColor();

  // console.log(sun)
};


const SUN = {
  update
};

export {
  SUN
};
