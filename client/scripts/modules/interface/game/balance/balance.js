import {
  MAIN
} from '../../../../main.js';

// trigger socket.js -> MAIN.socket.on('GAME_applyCredit')
function updateCreditHistory(){
  const credit = MAIN.game.data.playerData.credit;

  if(credit.pays === 0){
    const creditCard =   document.querySelector('#balanceMenu_CreditCard');
    if(creditCard){
      creditCard.style.display = 'none';
    };
  };

  document.querySelector(`#creditHistory_paysCoast`).innerHTML = `${(credit.amount / credit.allPays) + (credit.amount / credit.allPays) * (credit.procent / 100)}`; //Cost of payment
  document.querySelector(`#creditHistory_allCount`).innerHTML = `${((credit.amount / credit.allPays) + (credit.amount / credit.allPays) * (credit.procent / 100))*credit.pays}`;
  document.querySelector('#balanceMenu_balanceValue').innerHTML = MAIN.game.data.playerData.balance;

  const creditConfig = MAIN.game.configs.credits[credit.creditName];

  let deferralLine = '';
  for(let i=1;i<=creditConfig.deferment;i++){
    if(i === creditConfig.deferment - credit.deferment ){
      if(credit.pays === creditConfig.pays){
        deferralLine+=`<div class="balanceMenu-creditCard-gap"></div>`
      }else{
        deferralLine+=`<div class="balanceMenu-creditCard-hole balanceMenu-creditCard-DeferralHole"></div>`
      };
    }else{
      deferralLine+=`<div class="balanceMenu-creditCard-hole balanceMenu-creditCard-DeferralHole"></div>`
    };
  };

  document.querySelector('#balanceMenu_Container_Deferral_Container').innerHTML = deferralLine;


  let paymentsLine = '';
  for(let i=1;i<=creditConfig.pays;i++){
    if(i === creditConfig.pays - credit.pays ){
      if(credit.deferral === 0){
        paymentsLine+=`<div class="balanceMenu-creditCard-hole balanceMenu-creditCard-PaymentHole"></div>`
      }else{
        paymentsLine+=`<div class="balanceMenu-creditCard-gap"></div>`
      };
    }else{
      paymentsLine+=`<div class="balanceMenu-creditCard-hole balanceMenu-creditCard-PaymentHole"></div>`
    };
  };

  document.querySelector('#balanceMenu_Container_Payments_Container').innerHTML = paymentsLine;




  document.querySelector('#balanceHistory_productsInCirculation').innerHTML = calculateProductsWorth();

};

function calculateProductsWorth(){
  const player = MAIN.game.data.playerData;
  const cities = MAIN.game.data.cities;
  const prices = {};
  for(let product in MAIN.game.configs.products){
    let averagePrice = 0;
    for(let city in cities){
      const thisCity = cities[city];
      averagePrice += thisCity.getCurrentProductPrice(product);
    };
    prices[product] = Math.round(averagePrice/Object.keys(cities).length);
  };


  let products = [];
  for(let factory in player.factories){
    const thisFactory = player.factories[factory];
    products = products.concat(thisFactory.getAllProducts());
  };

  for(let truck in player.trucks){
    const thisTruck = player.trucks[truck];
    products = products.concat(thisTruck.getProductPriceData());
  };

  let sum = 0;
  products.forEach((prod, i) => {
    const price = prices[prod.name];
    sum += price + Math.round(price*0.15*prod.quality);
  });
  return sum;

};

function addBalanceMessage(message,amount){
  const statistics = MAIN.game.data.playerData.statistics;
  // thisStepProfit:0,
  // thisStepLose:0,
  //
  // lastStepProfit:0,
  // lastStepLose:0,
  // allGameProfit:0,
  // allGameLose:0,

  // maxProfit:0,
  // maxLose:0,
  if(message === null){
    //значит,что следующий ход
    const div = `
      <div class="balanceMenu_balanceList-item" style="border:none">
      </div>
    `;
    document.querySelector('#balanceMenu_balanceList').insertAdjacentHTML('afterBegin',div);
    updatePayPerStep();

    statistics.lastStepProfit = statistics.thisStepProfit;
    statistics.lastStepLose = statistics.thisStepLose;
    statistics.thisStepProfit = 0;
    statistics.thisStepLose = 0;
    if(statistics.lastStepProfit > statistics.maxProfit){
      statistics.maxProfit = statistics.lastStepProfit;
    };
    if(statistics.lastStepLose > statistics.maxLose){
      statistics.maxLose = statistics.lastStepLose;
    };
    console.log(statistics);
    return;


  };
  updatePayPerStep();
  let color;
  if(amount > 0){
    color = '#00a01e';
    statistics.thisStepProfit += amount;
    statistics.allGameProfit += amount;
  }else{
    statistics.thisStepLose += Math.abs(amount);
    statistics.allGameLose += Math.abs(amount);
    color = 'red';
  };
  if(amount === 0){
    color = '#303030';
  }
  const minus = amount >= 0 ? false:true;
  const sign = minus?'-$':'$'

  const language = MAIN.interface.lang.balanceMessages;

  if(MAIN.interface.lang.flag === 'ru'){
    if(message.startsWith('Tax payment')) {message = language.tax.ru + ' ' +MAIN.game.data.playerData.tax.procent + '%'};

    if(message.startsWith('Sale of ')){
      const strPart = message.substr(8);
      message = language.sale.ru +' '+ language[message.substr(8)].ru;
    };

    if(message.startsWith('Buying a truck')){
      // const strPart = message.substr(8);
      message = language.truckBuying.ru;
    };

    if(message.startsWith('Credit payment')){
        message = language.creditPayment.ru;
    };


  }else{
    if(message.startsWith('Tax payment')) {message = massage + ' ' + MAIN.game.data.playerData.tax.procent + '%'};
  }

  if(message.startsWith('Production on')){
    const strPart = message.substr(14);

    if(MAIN.interface.lang.flag === 'eng'){
        message = `${language[strPart].eng} salary`;
    };

    if(MAIN.interface.lang.flag === 'ru'){
        message = `Зарплата на ${language[strPart].ru}`;
    };


  };

  if(message.startsWith('Сonstruction of the ')){
    const strPart = message.substr(20);

    if(MAIN.interface.lang.flag === 'eng'){
      message = language[message.substr(20)].eng +' '+ language.construction.eng;
    };

    if(MAIN.interface.lang.flag === 'ru'){
      message = language.construction.ru +' '+ language[message.substr(20)].ru;
    };
  };









  const div = `
    <div class="balanceMenu_balanceList-item" style="color:${color}">
      <div class="balanceMenu_balanceList-item_left">
        ${message}
      </div>
      <div class="balanceMenu_balanceList-item_right">
        ${sign}${Math.abs(amount)}
      </div>
    </div>
  `;
  document.querySelector('#balanceMenu_balanceList').insertAdjacentHTML('afterBegin',div);
  document.querySelector('#balanceHistory_productsInCirculation').innerHTML = calculateProductsWorth();
};
function init(amount){
  const interfaceSection = document.querySelector('#gameInterface')
  // interfaceSection.insertAdjacentHTML('beforeEnd',section);
  const balanceSection = document.querySelector('#balanceSection');
  const balanceDiv = document.querySelector('#balanceDiv');

  const balanceDivSpan = document.querySelector('#balanceDiv_span');
  balanceDivSpan.innerHTML = amount;

  const creditUser = MAIN.game.data.playerData.credit;
  const creditConfig = MAIN.game.configs.credits[creditUser.creditName];


  const language = MAIN.interface.lang.balance;
  const langFlag = MAIN.interface.lang.flag;



  const balanceHistorySection = `
    <div id="balanceHistoryClicker">
    <div>
    <div id="balanceMenu_Container">
      <div class="card" id='balanceMenu_CreditCard'>
        <div class="card-header">
            loan <span class="card-header-span creditColor-${creditUser.creditName}"> | ${creditConfig.title}</span>
        </div>
        <div id="balanceMenu_Container_Amount" class="creditColor-${creditUser.creditName}">
          <span>$${creditConfig.amount}</span>
        </div>
        <div id="balanceMenu_Container_DeferalPart">
          <div class="balanceMenu_Container_Titles">
           ${language.deferral[langFlag]}
          </div>
          <div id="balanceMenu_Container_Deferral_Container">

          </div>

        </div>
        <div id="balanceMenu_Container_PaymentsPart">
          <div id='balanceMenu_Container_PaymentsPart_Header'>
            <div class="balanceMenu_Container_Titles">
              ${language.payments[langFlag]}
            </div>

            <div class="balanceMenu_Container_Titles_Payment">
              $<span id="creditHistory_paysCoast">1880</span>/${language.step[langFlag]}
            </div>
          </div>

          <div id="balanceMenu_Container_Payments_Container">

          </div>
        </div>

      </div>


      <div id="balanceMenu_balanceHistory" class="card">

        <div class="card-header">
            balance <span class="card-header-span"> | ${MAIN.game.data.playerData.login} </span>
        </div>

        <div id="balanceMenu_amount">
          $<span id="balanceMenu_balanceValue">${MAIN.game.data.playerData.balance}</span>

        </div>

        <div class="balanceMenu_balanceHeader">
          <div class="balanceMenu_balanceHeader_Left">
            <div class="balanceMenu_balanceHeader_Loan">
              <span style="text-transform:uppercase;font-size:15px">${language.loan[langFlag]}</span>
              <span style="font-size:12px">${language.debt[langFlag]}: $<span id="creditHistory_allCount">130000</span></span>
            </div>
            <div class="balanceMenu_balanceHeader_Titles">
              ${language.productsInCirculation[langFlag]}: $<span id='balanceHistory_productsInCirculation'></span>
            </div>
            <div style="color:#C73636" class="balanceMenu_balanceHeader_Titles">
              ${language.stepPay[langFlag]}: $<span id="balanceHistory_payPerStep"></span>
            </div>
          </div>
          <div class="balanceMenu_balanceHeader_Right">
            <div class="balanceMenu_balanceHeader_Tax-top">
              ${language.tax[langFlag]}
            </div>
            <div id="balanceMenu_Tax" class="balanceMenu_balanceHeader_Tax-bottom">
              <span id="balanceHistory_tax"></span>%
            </div>
          </div>
        </div>

        <div id="balanceMenu_balanceList">

        </div>


      </div>
    </div>
  `;
  balanceSection.insertAdjacentHTML('beforeEnd',balanceHistorySection);


  const balanceHistoryClicker = document.querySelector('#balanceHistoryClicker');
  MAIN.interface.deleteTouches(balanceHistoryClicker);
  MAIN.interface.returnTouches(document.querySelector('#balanceMenu_balanceList'));



  const balanceHistory = document.querySelector('#balanceMenu_balanceHistory');

  let balanceHistoryOpened = false;






  function showBalanceHistory(event){
    if(event.target === balanceDiv || event.target === balanceHistoryClicker || event.target === balanceDivSpan){
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

    updatePayPerStep();
  };

  MAIN.interface.deleteTouches(balanceDiv);
  balanceDiv.onclick = showBalanceHistory;
  balanceDiv.ontouchstart = showBalanceHistory;

  MAIN.interface.deleteTouches(balanceHistoryClicker);
  balanceHistoryClicker.onclick = showBalanceHistory;
  balanceHistoryClicker.ontouchstart = showBalanceHistory;

};



function updatePayPerStep(){
  const div = document.querySelector('#balanceHistory_payPerStep');

  let pay = 0;

  for(let factory in MAIN.game.data.playerData.factories){
    const thisFactory = MAIN.game.data.playerData.factories[factory];
    if(thisFactory.settingsSetted){
      pay += thisFactory.settings.stepPrice;
    };
  };

  if(MAIN.game.data.playerData.credit.pays > 0 && MAIN.game.data.playerData.credit.deferment === 0){
    const credit = MAIN.game.data.playerData.credit;
    pay += (credit.amount / credit.allPays) + (credit.amount / credit.allPays) * (credit.procent / 100)
  };


  pay += MAIN.game.data.playerData.tax.value;

  div.innerHTML = pay;

  document.querySelector('#balanceHistory_tax').innerHTML = MAIN.game.data.playerData.tax.procent;

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
  const div = document.querySelector('#balanceDiv_span');
  const parentDiv = document.querySelector('#balanceDiv');
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
      parentDiv.style.color = '#00a01e'
    }else if(value < startedBalance){
      parentDiv.style.color = '#C73636'
    };
    div.innerHTML = value;
    curentAnimate++;
    if(curentAnimate < maxAnimate){
      setTimeout(animate,50)
    }else{
      parentDiv.style.color = 'white';
      if(newBalance < 0){
        parentDiv.style.color = '#C73636';
      }
      div.innerHTML = newBalance;
    };
  };
  animate();
  document.querySelector('#balanceMenu_balanceValue').innerHTML = MAIN.game.data.playerData.balance;
};
const BALANCE = {
  init,
  notEnoughMoney,
  change,
  updateCreditHistory,
  addBalanceMessage,
};
export {BALANCE};
