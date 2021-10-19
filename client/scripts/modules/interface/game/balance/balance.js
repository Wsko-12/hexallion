import {
  MAIN
} from '../../../../main.js';

// trigger socket.js -> MAIN.socket.on('GAME_applyCredit')
function init(amount){
  const section = `
    <section id='balanceSection'>
    <div id='balanceDiv'>
      $${amount}
    </div>

    </section>
  `
  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd',section);
};

function notEnoughMoney(){
  let colorIndex = 0;
  let curentAnimate = 0;
  const maxAnimate = 6;
  const div = document.querySelector('#balanceDiv');
  function animate(){
    if(colorIndex == 0){
      div.style.color = 'red';
      colorIndex++;
    }else{
      div.style.color = 'white'
      colorIndex--;
    };
    curentAnimate++;
    if(curentAnimate < maxAnimate){
      setTimeout(animate,100);
    }else{
      div.style.color = 'white'
    };
  };
  animate();
};
function change(newBalance){
  const div = document.querySelector('#balanceDiv');
  let startedBalance = MAIN.game.playerData.balance;
  MAIN.game.playerData.balance = newBalance;
  let curentAnimate = 0;
  const maxAnimate = 10;
  function interpolate(f,s,value){

    const f_ = f*(10-value)/10;
    const s_ = s*(value/10);

    return Math.round((f_+s_));
  };
  function animate(){
    const value = interpolate(startedBalance,newBalance,curentAnimate);
    if(value > startedBalance){
      div.style.color = 'green'
    }else if(value < startedBalance){
      div.style.color = 'red'
    };
    div.innerHTML = '$'+value;
    curentAnimate++;
    if(curentAnimate < maxAnimate){
      setTimeout(animate,50)
    }else{
      div.style.color = 'white';
      div.innerHTML = '$'+newBalance;
    };
  };
  animate();
};
const BALANCE = {
  init,
  notEnoughMoney,
  change,
};
export {BALANCE};
