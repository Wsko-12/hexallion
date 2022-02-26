


import {
  MAIN
} from '../../../../main.js';


let globalChoosenCredit = null;
const CREDIT = {
  //создание меню выбора кредитов
  //trigger at socket.js   MAIN.socket.on('GAME_data')
  showChooseCreditMenu(){
    // const creditMenu = `
    // <section id="chooseCreditMenuSection">
    //   <div id="chooseCreditMenuContainer">
    //     <div id="chooseCreditMenuSection_title">
    //       Choose your credit
    //     </div>
    //     <div id="creditCardsContainer">
    //     </div>
    //     <div id="CreditMenu_Button">
    //       Accept
    //     <div>
    //   </div>
    // </section>
    // `;

    const creditMenu = `
      <section id="chooseCreditMenuSection">
        <div id="chooseCreditMenuContainer">
          <div class="CreditMenu_Title">
            ${MAIN.interface.lang.credit.menuTitle[MAIN.interface.lang.flag]}
          </div>
          <div id="CreditMenu_List">
          </div>
          <div id="CreditMenu_Button">
            <span style="margin:auto">${MAIN.interface.lang.credit.startButton[MAIN.interface.lang.flag]}</span>
          </div>
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



    const asseptButton = document.querySelector('#CreditMenu_Button');
    asseptButton.onclick = accept;
    asseptButton.ontouchstart = accept;

    for(let credit in MAIN.game.configs.credits){
        const thisCredit = MAIN.game.configs.credits[credit];
        // const card = `
        // <div class="creditCard" id='credit_${credit}'>
        //   <div class="creditCard_title">$ ${thisCredit.amount}</div>
        //   <div class="creditCard_line ">Interest Rate: ${thisCredit.procent}</div>
        //   <div class="creditCard_line">Loan Term: ${thisCredit.pays}</div>
        //   <div class="creditCard_line">Loan Deferral: ${thisCredit.deferment}</div>
        // </div>
        // `

        const card = `
        <div class="CreditMenu_Card card" id="credit_${credit}">
          <div class="card-header">
              loan <span class="card-header-span creditColor-${credit}"> | ${thisCredit.title} </span>
          </div>

          <div class="CreditMenu_Card_title creditColor-${credit}">
            ${thisCredit.title}
          </div>

          <div class="CreditMenu_Card_amount">
            $<span>${thisCredit.amount}</span>
          </div>

          <div class="CreditMenu_Card_line">
            ${MAIN.interface.lang.credit.procent[MAIN.interface.lang.flag]}: <span class="CreditMenu_Card_line-span">${thisCredit.procent}</span>
          </div>
          <div class="CreditMenu_Card_line">
            ${MAIN.interface.lang.credit.payments[MAIN.interface.lang.flag]}: <span class="CreditMenu_Card_line-span">${thisCredit.pays}</span>
          </div>
          <div class="CreditMenu_Card_line">
            ${MAIN.interface.lang.credit.deferral[MAIN.interface.lang.flag]}: <span class="CreditMenu_Card_line-span">${thisCredit.deferment}</span>
          </div>
        </div>
        `;

        document.querySelector('#CreditMenu_List').insertAdjacentHTML('beforeend',card);

        const cardElement = document.querySelector(`#credit_${credit}`);
        cardElement.onclick = checkCredit;
        cardElement.ontouchstart = checkCredit;

        function checkCredit(event){
          event.preventDefault();
          globalChoosenCredit = credit;


          let allCards = document.querySelector('#CreditMenu_List').childNodes;
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
