import {
  MAIN
} from '../../../../../main.js';


//цвета солнца в зависимости от времени суток
const colors = [
  [210, 20, 0,0.5],
  [255, 235, 85,1],
  [200, 200, 200,1],
  [200, 200, 200,1],
  [220, 150, 50,1],
  [235, 15, 5,0.5],
]

//размыте блумом чтобы днем не пересвечивало
const bloomTrashhold = [
  [0.8],
  [0.95],
  [1],
  [1],
  [0.9],
  [0.8],
]


function changeColor(){
  const sun = MAIN.game.scene.lights.lightMain;
  const time = MAIN.game.scene.time;
  const allMinutes = 12*60;
  const currentMinute = time.h*60 + time.m;
  const colorsPart = allMinutes/colors.length;
  const currentPart = Math.floor(currentMinute/colorsPart);
  const nextPart = currentPart+1 === colors.length? currentPart : currentPart+1;

  const firstColorValue = colors[currentPart];
  const secondColorValue = colors[nextPart];

  function interpolate(f,s,value){
    const normalizeF = f/255;
    const normalizeS = s/255;

    const f_ = normalizeF*(1-value);
    const s_ = normalizeS*value;

    return Math.round((f_+s_)*255);

  };

  function interpolateBloom(f,s,value){
    const normalizeF = f;
    const normalizeS = s;

    const f_ = normalizeF*(1-value);
    const s_ = normalizeS*value;

    return f_+s_;

  };


  const intValue = (currentMinute - (currentPart*colorsPart))/colorsPart;



  const sunColor = [
    interpolate(colors[currentPart][0],colors[nextPart][0],intValue),
    interpolate(colors[currentPart][1],colors[nextPart][1],intValue),
    interpolate(colors[currentPart][2],colors[nextPart][2],intValue),

  ];

  sun.color.set(`rgb(${sunColor})`);
  sun.intensity = interpolate(colors[currentPart][3],colors[nextPart][3],intValue);
  MAIN.game.scene.lights.sky.material.color.set(`rgb(${sunColor})`);
  MAIN.renderer.postrocessors.bloomPass.threshold =  interpolateBloom(bloomTrashhold[currentPart][0],bloomTrashhold[nextPart][0],intValue);
  console.log(MAIN.renderer.postrocessors.bloomPass.threshold)

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
  sun.position.set(0,p.y,p.x);
  sun.lookAt(0,0,0);
  lightAdditional.position.set(0,p.y,-p.x);
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
