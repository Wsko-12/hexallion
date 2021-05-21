import {
  GAME
} from './main.js';

const dayLength = {
  realMinutes:0.5,// при 6 минутах игровой год длиться тогда 36 часов - полтары реальных суток;
};
dayLength.minutLoop =  function(){
  const realSeconds = dayLength.realMinutes * 60;
  //сколько игровых минут должно пройти в одну секунду реального времени;
  // 1440 --- realSeconds,
  // x --- 1;
  const x = 1440/realSeconds;
  return 1000/x;//как часто должен включаться луп
};
const date = {
  globalMinutes:0,
  minutes:0,
  hours:8,
  day:1,
  month:1,
  year:0,
};






const dayLoop = function(){
  date.globalMinutes++;
  date.minutes++;
  if(date.minutes === 60){
    date.minutes = 0;
    date.hours++;
    alert(date.hours)
  };
  if(date.hours === 24){
    date.hours = 0;
    date.day++;
  };
  if(date.day === 31){
    date.day = 1;
    date.month++;
  };
  if(date.month === 13){
    date.month = 1;
    date.year++;
  };
  GAME.gameWorld.updateSkyObjectPosition();
  GAME.weather.changeSkyColor();







  setTimeout(dayLoop,dayLength.minutLoop());
};





const init = function(){
  dayLoop();
};

const TIME = {
  init,
  dayLoop,
  date,
};

export {TIME};
