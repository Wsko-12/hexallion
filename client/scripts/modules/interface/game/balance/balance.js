import {
  MAIN
} from '../../../../main.js';

// trigger socket.js -> MAIN.socket.on('GAME_applyCredit')
function updateCreditHistory(){
  const credit = MAIN.game.data.playerData.credit
  document.querySelector(`#creditHistory_paysLeft`).innerHTML = `Осталось платежей: ${credit.pays}`;
  document.querySelector(`#creditHistory_deferral`).innerHTML = `Отсрочка: ${credit.deferment}`; //`Payments defferal: ${credit.deferment}`;
  document.querySelector(`#creditHistory_paysCoast`).innerHTML = `Цена платежа: $${(credit.amount / credit.allPays) + (credit.amount / credit.allPays) * (credit.procent / 100)}`; //Cost of payment
  document.querySelector(`#creditHistory_allCount`).innerHTML = `Осталось оплатить: $${((credit.amount / credit.allPays) + (credit.amount / credit.allPays) * (credit.procent / 100))*credit.pays}`; 

  document.querySelector(`#creditHistory_ProgressLine`).style.width = ((credit.allPays - credit.pays)/credit.allPays*100)+'%'
};

function addBalanceMessage(message,amount){
  let color;
  if(amount > 0){
    color = '#62e27a';
  }else{
    color = 'red';
  };
  if(amount === 0){
    color = 'white';
  }
  const minus = amount >= 0 ? false:true;
  const sign = minus?'-$':'$'
  const div = `
    <div class="balanceList_child" style="color:${color}">
      <div>${message}</div>
      <div>${sign}${Math.abs(amount)}</div>
    </div>
  `
  document.querySelector('#balanceList').insertAdjacentHTML('afterBegin',div);
};
function init(amount){
  const interfaceSection = document.querySelector('#gameInterface')
  // interfaceSection.insertAdjacentHTML('beforeEnd',section);
  const balanceSection = document.querySelector('#balanceSection');
  const balanceDiv = document.querySelector('#balanceDiv');
  balanceDiv.innerHTML = amount;

  const balanceHistorySection = `
    <div id="balanceHistoryClicker">
    <div>
    <div id='balanceHistory'>
      <div class='balanceHistory_title'>Credit</div>
      <div id='creditHistory'>
          <div id='creditHistory_paysLeft' class="creditHistory_text"></div>
          <div id='creditHistory_deferral' class="creditHistory_text"></div>
          <div id='creditHistory_allCount' class="creditHistory_text"></div>
          <div id='creditHistory_paysCoast' class="creditHistory_text"></div>
          <div class='creditHistory_CreditProgress'>
            <div id='creditHistory_ProgressLine'></div>
          </div>

      </div>
      <div class='balanceHistory_title'>Balance</div>
      <div id='balanceList'></div>
    </div>
  `;
  balanceSection.insertAdjacentHTML('beforeEnd',balanceHistorySection);


  // for(let i =0;i<100;i++){
  //   addBalanceMessage('test',(50-i));
  // }


  // MAIN.interface.deleteTouches(balanceDiv);

  const balanceHistoryClicker = document.querySelector('#balanceHistoryClicker');
  MAIN.interface.deleteTouches(balanceHistoryClicker);
  MAIN.interface.returnTouches(document.querySelector('#balanceList'));



  const balanceHistory = document.querySelector('#balanceHistory');

  let balanceHistoryOpened = false;






  function showBalanceHistory(event){
    if(event.target === balanceDiv || event.target === balanceHistoryClicker){
      if(balanceHistoryOpened){
        balanceHistoryOpened = false;
        balanceHistoryClicker.style.display = 'none';
        balanceHistory.style.display = 'none';
      }else{
        balanceHistoryClicker.style.display = 'block';
        balanceHistory.style.display = 'block';
        balanceHistoryOpened = true;
        updateCreditHistory();
      };
    };

  };

  balanceDiv.onclick = showBalanceHistory;
  balanceDiv.ontouchstart = showBalanceHistory;

  balanceHistoryClicker.onclick = showBalanceHistory;
  balanceHistoryClicker.ontouchstart = showBalanceHistory;


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
  let startedBalance = MAIN.game.data.playerData.balance;
  MAIN.game.data.playerData.balance = newBalance;
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
  updateCreditHistory,
  addBalanceMessage,
};
export {BALANCE};
