


import {
  MAIN
} from '../../../../main.js';


let globalChoosenCredit = null;
const CREDIT = {
  //создание меню выбора кредитов
  //trigger at socket.js   MAIN.socket.on('GAME_data')
  showChooseCreditMenu(){
    const creditMenu = `
    <section id="chooseCreditMenuSection">
      <div id="chooseCreditMenuContainer">
        <div id="chooseCreditMenuSection_title">
          Choose your credit
        </div>
        <div id="creditCardsContainer">
        </div>
        <div id="chooseCreditMenuSection_footer">
          Accept
        <div>
      </div>
    </section>
    `;
    document.body.insertAdjacentHTML('beforeend',creditMenu);
    MAIN.interface.deleteTouches(document.querySelector('#chooseCreditMenuSection'));

    function accept(){
      if(globalChoosenCredit != null){
          const data = {
            player:MAIN.userData.login,
            gameID:MAIN.game.data.commonData.id,
            credit:globalChoosenCredit,
          };
          MAIN.socket.emit('GAME_choseCredit',data);
      };
    };



    const asseptButton = document.querySelector('#chooseCreditMenuSection_footer');
    asseptButton.onclick = accept;
    asseptButton.ontouchstart = accept;

    for(let credit in MAIN.game.configs.credits){
        const thisCredit = MAIN.game.configs.credits[credit];
        const card = `
        <div class="creditCard" id='credit_${credit}'>
          <div class="creditCard_title">$ ${thisCredit.amount}</div>
          <div class="creditCard_line ">Interest Rate: ${thisCredit.procent}</div>
          <div class="creditCard_line">Loan Term: ${thisCredit.pays}</div>
          <div class="creditCard_line">Loan Deferral: ${thisCredit.deferment}</div>
        </div>
        `
        document.querySelector('#creditCardsContainer').insertAdjacentHTML('beforeend',card);

        const cardElement = document.querySelector(`#credit_${credit}`);
        cardElement.onclick = checkCredit;
        cardElement.ontouchstart = checkCredit;

        function checkCredit(event){
          event.preventDefault();
          globalChoosenCredit = thisCredit;


          let allCards = document.querySelector('#creditCardsContainer').childNodes;
          for (let i = 0; i < allCards.length; i++) {
            if(allCards[i].nodeName === "DIV"){
              allCards[i].classList.remove('choosenCredit');
            };
          };
          cardElement.classList.add('choosenCredit');
        };
    };
  },



};
export {
  CREDIT
};
