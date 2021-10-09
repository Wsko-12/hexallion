import {
  MAIN
} from '../../../main.js';

function init(){
  const mobileConsole = document.createElement("div");
  mobileConsole.id = 'mobileConsole';
  document.body.appendChild(mobileConsole);
};

function log(message){
  const mobileConsole = document.querySelector("#mobileConsole");
  mobileConsole.insertAdjacentHTML('beforeend', '</br>' + message);
  mobileConsole.scrollTop = mobileConsole.scrollHeight;
};






const MCONSOLE = {
  init,
  log,
};

export {
  MCONSOLE
};
