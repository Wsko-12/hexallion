import * as THREE from '../ThreeJsLib/build/three.module.js';

import {
  GAME
} from './main.js';


// new THREE.Color("rgb(255, 0, 0)");



const skyOptions =
[
  {
    time:'0+',
    color:[24,23,41],//rgb(24, 23, 41)!!!!!!!!
    intens:0.05,
  },
  {
    time:'1+',
    color:[32, 30, 73],//rgb(32, 30, 73)
    intens:0.08,
  },
  {
    time:'2+',
    color:[29, 30, 61],//rgb(29, 30, 61)
    intens:0.1,
  },
  {
    time:'3+',
    color:[75,57,103],//rgb(75, 57, 103)
    intens:0.2,
  },
  {
    time:'4+',
    color:[148,100,153],//rgb(148, 100, 153)
    intens:0.3,
  },
  {
    time:'5+',
    color:[255,190,213],//rgb(255, 190, 213)
    intens:0.5,
  },
  {
    time:'6+',
    color:[251,196,144],//rgb(251, 196, 144)
    intens:0.5,
  },
  {
    time:'7+',
    color:[148,252,234],//rgb(148, 252, 234)
    intens:0.5,
  },
  {
    time:'8+',
    color:[105,239,255],//rgb(105, 239, 255)
    intens:0.5,
  },
  {
    time:'9+',
    color:[96,241,255],//rgb(96, 241, 255)
    intens:0.6,
  },
  {
    time:'10+',
    color:[112,233,255],
    intens:0.8,
  },
  {
    time:'11+',
    color:[160,235,255],
    intens:1,
  },
  {
    time:'12+',
    color:[183,255,253],//rgb(167, 218, 239)
    intens:1,
  },

  {
    time:'13+',
    color:[177,255,255],
    intens:1,
  },
  {
    time:'14+',
    color:[181,236,255],
    intens:1,
  },
  {
    time:'15+',
    color:[109,218,255],// rgb(109, 218, 255)
    intens:1,
  },
  {
    time:'16+',
    color:[65,206,255],// rgb(65,206,255)
    intens:1,
  },
  {
    time:'17+',
    color:[41,185,255],// rgb(41,185,255)
    intens:0.8,
  },
  {
    time:'18+',
    color:[133, 219, 196],// rgb(133, 219, 196)
    intens:0.7,
  },
  {
    time:'19+',
    color:[226, 225, 185],// rgb(226, 225, 185)
    intens:0.6,
  },
  {
    time:'20+',
    color:[233, 194, 142],// rgb(233, 194, 142)
    intens:0.5,
  },
  {
    time:'21+',
    color:[210, 107, 107],// rgb(210, 107, 107)
    intens:0.5,
  },
  {
    time:'22+',
    color:[139, 102, 150],// rgb(139, 102, 150)
    intens:0.4,
  },
  {
    time:'23+',
    color:[69, 71, 136],// rgb(69, 71, 136)
    intens:0.3,
  },
];
const nowSkyOptions = skyOptions[0];



const sunOptions =
[
  {
    time:'0+',
    color:[0,0,0],//rgb(0, 0, 20)!!!!!!!!
    intens:0,
  },
  {
    time:'1+',
    color:[0,0,0],
    intens:0,
  },
  {
    time:'2+',
    color:[0,0,0],
    intens:0,
  },
  {
    time:'3+',
    color:[255,0,0],//0, 35, 67!!!!!!!!
    intens:0,
  },
  {
    time:'4+',
    color:[255,0,0],
    intens:0,
  },
  {
    time:'5+',
    color:[255,0,0],//rgb(255, 0, 92)
    intens:0.4,
  },
  {
    time:'6+',
    color:[255,0,0],
    intens:0.4,
  },
  {
    time:'7+',
    color:[255,0,0],//rgb(255, 168, 0)
    intens:0.5,
  },
  {
    time:'8+',
    color:[255,100,0],//rgb(255, 115, 0)
    intens:0.5,
  },
  {
    time:'9+',
    color:[255,150,83],//rgb(255, , 83)
    intens:0.6,
  },
  {
    time:'10+',
    color:[255,225,66],//rgb(255, 225, 66)
    intens:0.8,
  },
  {
    time:'11+',
    color:[255,234,143],//rgb(255, 234, 143)
    intens:0.8,
  },
  {
    time:'12+',
    color:[255,244,196],//rgb(255, 244, 196)
    intens:0.8,
  },

  {
    time:'13+',
    color:[255,244,196],//rgb(255, 244, 196)
    intens:0.9,
  },
  {
    time:'14+',
    color:[255,244,0],
    intens:0.8,
  },
  {
    time:'15+',
    color:[255,150,0],//rgb(255, 150, 0)
    intens:0.8,
  },
  {
    time:'16+',
    color:[255,50,0],//rgb(255, 150, 60)
    intens:0.8,
  },
  {
    time:'17+',
    color:[255,20,105],//rgb(255, 100, 0)
    intens:0.8,
  },
  {
    time:'18+',
    color:[255,10,0],//rgb(255, 40, 0)
    intens:0.7,
  },
  {
    time:'19+',
    color:[247,5,0],//rgb(247, 30, 0)
    intens:0.3,
  },
  {
    time:'20+',
    color:[255,0,0],//rgb(255, 20, 0)
    intens:0.3,
  },
  {
    time:'21+',
    color:[255,0,0],//rgb(255, 10, 0)
    intens:0.3,
  },
  {
    time:'22+',
    color:[255,0,0],//rgb(255, 0, 0)
    intens:0.1,
  },
  {
    time:'23+',
    color:[0,4,122],
    intens:0,
  },
];
const nowSunOptions = skyOptions[0];

const moonOptions =
[
  {
    time:'0+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.1,
  },
  {
    time:'1+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.08,
  },
  {
    time:'2+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.05,
  },
  {
    time:'3+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.05,
  },
  {
    time:'4+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.03,
  },
  {
    time:'5+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.02,
  },
  {
    time:'6+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.01,
  },
  {
    time:'7+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.01,
  },
  {
    time:'8+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.01,
  },
  {
    time:'9+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'10+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'11+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'12+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },

  {
    time:'13+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'14+',
    color:[255,244,0],
    intens:0,
  },
  {
    time:'15+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'16+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'17+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0,
  },
  {
    time:'18+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.01,
  },
  {
    time:'19+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.01,
  },
  {
    time:'20+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.02,
  },
  {
    time:'21+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.04,
  },
  {
    time:'22+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.04,
  },
  {
    time:'23+',
    color:[179,241,255],//rgb(179, 241, 255)
    intens:0.04,
  },
];
const nowMoonOptions = moonOptions[0];



// function searchIntensity(obj){
//   const thatHour = GAME.time.date.hours;
//   const nextHour = thatHour + 1 != 24 ? thatHour+1:0;
//   let options,nowOptions;
//
//   switch (obj) {
//     case 'sky':
//       options = skyOptions;
//       nowOptions = nowSkyOptions;
//       break;
//     case 'sun':
//       options = skyOptions;
//       nowOptions = nowSkyOptions;
//       break;
//
//     case 'moon':
//         options = moonOptions;
//         nowOptions = nowMoonOptions;
//         break;
//
//   };
//   const thatHourOption = options[thatHour];
//   const nextHourOption = options[nextHour];
//   const iDif = nextHourOption.intens - thatHourOption.intens;
//
//   nowOptions.intens =thatHourOption.intens + iDif/60 * GAME.time.date.minutes;
//
//   return nowOptions.intens;
// };

function searchColorAndIntensity(obj){
  const thatHour = GAME.time.date.hours;
  const nextHour = thatHour + 1 != 24 ? thatHour+1:0;

  let options,nowOptions;

  switch (obj) {
    case 'sky':
      options = skyOptions;
      nowOptions = nowSkyOptions;
      break;
    case 'sun':
      options = sunOptions;
      nowOptions = nowSunOptions;
      break;
    case 'moon':
        options = moonOptions;
        nowOptions = nowMoonOptions;
        break;

  };
  const thatHourOption = options[thatHour];
  const nextHourOption = options[nextHour];




  const rDif = nextHourOption.color[0] - thatHourOption.color[0];
  const gDif = nextHourOption.color[1] - thatHourOption.color[1];
  const bDif = nextHourOption.color[2] - thatHourOption.color[2];

  nowOptions.color[0] = Math.floor(thatHourOption.color[0] + rDif/60 * GAME.time.date.minutes);
  nowOptions.color[1] = Math.floor(thatHourOption.color[1] + gDif/60 * GAME.time.date.minutes);
  nowOptions.color[2] = Math.floor(thatHourOption.color[2] + bDif/60 * GAME.time.date.minutes);


  const iDif = nextHourOption.intens - thatHourOption.intens;

  nowOptions.intens =thatHourOption.intens + iDif/60 * GAME.time.date.minutes;

  return nowOptions;


}




// function searchColor(obj){
//   const thatHour = GAME.time.date.hours;
//   const nextHour = thatHour + 1 != 24 ? thatHour+1:0;
//
//   let options,nowOptions;
//
//   switch (obj) {
//     case 'sky':
//       options = skyOptions;
//       nowOptions = nowSkyOptions;
//       break;
//     case 'sun':
//       options = sunOptions;
//       nowOptions = nowSunOptions;
//       break;
//     case 'moon':
//         options = moonOptions;
//         nowOptions = nowMoonOptions;
//         break;
//
//   };
//
//
//   const thatHourOption = options[thatHour];
//   const nextHourOption = options[nextHour];
//
//
//   const rDif = nextHourOption.color[0] - thatHourOption.color[0];
//   const gDif = nextHourOption.color[1] - thatHourOption.color[1];
//   const bDif = nextHourOption.color[2] - thatHourOption.color[2];
//
//   nowOptions.color[0] = Math.floor(thatHourOption.color[0] + rDif/60 * GAME.time.date.minutes);
//   nowOptions.color[1] = Math.floor(thatHourOption.color[1] + gDif/60 * GAME.time.date.minutes);
//   nowOptions.color[2] = Math.floor(thatHourOption.color[2] + bDif/60 * GAME.time.date.minutes);
//
//
//   return nowOptions.color;
//
//
// };


const changeSkyColor = function(){
    const skyOptions = searchColorAndIntensity('sky');

    GAME.gameWorld.environment.color.r = skyOptions.color[0]/255;
    GAME.gameWorld.sky.light.color.r = skyOptions.color[0]/255;
    GAME.gameWorld.environment.color.g = skyOptions.color[1]/255;
    GAME.gameWorld.sky.light.color.g = skyOptions.color[1]/255;
    GAME.gameWorld.environment.color.b = skyOptions.color[2]/255;
    GAME.gameWorld.sky.light.color.b = skyOptions.color[2]/255;

    GAME.gameWorld.sky.light.intensity = skyOptions.intens;





    const sunOptions = searchColorAndIntensity('sun');
    GAME.gameWorld.sky.sunObject.material.color.r = sunOptions.color[0]/255;
    GAME.gameWorld.sky.sunObject.material.color.g = sunOptions.color[1]/255;
    GAME.gameWorld.sky.sunObject.material.color.b = sunOptions.color[2]/255;

    GAME.gameWorld.sky.sunLight.color.r = sunOptions.color[0]/255;
    GAME.gameWorld.sky.sunLight.color.g = sunOptions.color[1]/255;
    GAME.gameWorld.sky.sunLight.color.b = sunOptions.color[2]/255;

    GAME.gameWorld.sky.sunLight.intensity = sunOptions.intens;

    const moonOptions= searchColorAndIntensity('moon');
    GAME.gameWorld.sky.moonObject.material.color.r = moonOptions.color[0]/255;
    GAME.gameWorld.sky.moonObject.material.color.g = moonOptions.color[1]/255;
    GAME.gameWorld.sky.moonObject.material.color.b = moonOptions.color[2]/255;

    GAME.gameWorld.sky.moonLight.color.r = moonOptions.color[0]/255;
    GAME.gameWorld.sky.moonLight.color.g = moonOptions.color[1]/255;
    GAME.gameWorld.sky.moonLight.color.b = moonOptions.color[2]/255;

    GAME.gameWorld.sky.moonLight.intensity = moonOptions.intens;





};

const changeSunColor = function(){


}

function init(){

};


const WEATHER = {
  init,
  changeSkyColor,
};

export {WEATHER};
