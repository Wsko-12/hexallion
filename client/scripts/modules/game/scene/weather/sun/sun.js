import {
  MAIN
} from '../../../../../main.js';


//цвета солнца в зависимости от времени суток
const colors = [
  [50, 0, 20,0.8],//0
  [0, 0, 0,0.5],//2
  [0, 0, 0,1],//4
  [0, 0, 0,1],//6
  [120, 0, 0,1],//8
  [210, 50, 0,0.5],//10
  [180, 150, 150,1],//12
  [180, 180, 180,1],//14
  [180, 180, 180,1],//16
  [180, 180, 150,1],//18
  [200, 100, 5,1],//20
  [120, 0, 0,1],//22

]

//размыте блумом чтобы днем не пересвечивало
const bloomTrashhold = [
  [0.75],//0
  [0.75],//2
  [0.75],//4
  [0.8],//6
  [1],//8
  [1],//10
  [1],//12
  [1],//14
  [1],//16
  [1],//18
  [1],//20
  [0.9],//22

];


function changeColor(){
  const sun = MAIN.game.scene.lights.lightMain;
  const time = MAIN.game.scene.time;
  const allMinutes = 24*60;
  const currentMinute = time.h*60 + time.m;
  const colorsPart = allMinutes/colors.length;
  const currentPart = Math.floor(currentMinute/colorsPart);
  const nextPart = currentPart+1 === colors.length? 0 : currentPart+1;

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
  MAIN.game.scene.lights.moonlight.intensity = 1-MAIN.renderer.postrocessors.bloomPass.threshold;
  if(currentPart === 11){
    MAIN.game.scene.lights.buildingLights.visible = true;
    MAIN.game.scene.lights.buildingPointLights.forEach((item, i) => {
      item.visible = true;
    });
  };
  //currentPart === 0 чтобы вырубить в самом начале
  if(currentPart === 6){
    MAIN.game.scene.lights.buildingLights.visible = false;
    MAIN.game.scene.lights.buildingPointLights.forEach((item, i) => {
      item.visible = false;
    });
  };
};

function update(){
  const sunDistance = 10;
  const time = MAIN.game.scene.time;
  const sun = MAIN.game.scene.lights.lightMain;
  const lightAdditional = MAIN.game.scene.lights.lightAdditional;
  const deg = ((180/12)* time.h + (180/12/60)* time.m);
  const p = {
    x:Math.sin((deg + 110)*Math.PI/180)*sunDistance,
    y:Math.cos((deg + 110)*Math.PI/180)*sunDistance,
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
