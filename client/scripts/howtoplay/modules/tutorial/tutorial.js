import {
  MAIN
} from '../../main.js';
const TUTORIAL = {
  section:null,
  step:null,
};
TUTORIAL.start = function(){
  document.querySelector('#balanceSection').style.display = 'none';
  TUTORIAL.section = document.querySelector('#tutorialSection');
  const content = {
    header:'Добро пожаловать в Hexallion!',
    body:`
        Эту игру сначала я задумывал как настольную, после того как нам с друзьями надоело играть в Монополию.
        Из-за того, что было невозможно постоянно встречаться и тестировать баланс, я задумал написать ее веб версию,
        но увлекся и решил сделать из нее полноценную видеоигру с уклоном на настолку.
        <br/>
        <br/>
        Это экономическая стратегия, в которой вам предстоить строить заводы и производства, на которых будут добываться ресурсы или производиться из уже имеющихся и в дальнейшем продаваться в города.
        <br/>
        <br/>
        Однако, не все так просто. Нужно следить за спросом на продукцию, за логистикой, ну и элемент удачи никуда не пропадал.
        Ваша задача - выбить всех конкурентов с рынка, обонкротив их. Ну, обо всем по порядку.`,
    button:'Далее',
    fn:function(){
      const content = {
          header:'Кредит',
          body:`
            Каждый игрок в начале игры выбирает стартовый кредит.
            <br/>
            <br/>
            У кредита есть следующие параметры:
            <br/>
             - Сумма, которую получит игрок
            <br/>
             - Процент, который игрок оплатит за этот кредит
             <br/>
            - Отсрочка —  количество шагов до первого платежа
            <br/>
             - Количество платежей
             <br/>
             - Сумма платежа
             <br/>
             <br/>
             В настольной игре, в начале каждого своего хода, игрок переставляет жетон кредита на своем планшете в следующий слот.
              <br/>
             В веб-версии это все происходит автоматически.
              <br/>
             Когда заканчивается отсрочка, с баланса игрока начинают списываться Сумма платежа.
          `,
          button:'Выбрать',
          fn:function(){
            MAIN.interface.game.credit.showChooseCreditMenu();
          },
      };
      setTimeout(()=>{
        TUTORIAL.main(content);
      },100);




    },
  };
  TUTORIAL.main(content);
};

TUTORIAL.main = function(data){
  TUTORIAL.section.innerHTML = '';
  TUTORIAL.section.style.display = 'block';
  const content = `
    <div class="tutorialSection-main">
      <div class="tutorialSection-main-header">
       ${data.header}
      </div>
      <div class="tutorialSection-main-text">
        ${data.body}
      </div>
      <div class="tutorialSection-main-button" id="tutorial_main_button">
        <span>${data.button}</span>
      </div>
    </div>
  `;
  TUTORIAL.section.insertAdjacentHTML('beforeEnd',content);
  const button = document.querySelector('#tutorial_main_button');
  function action(){
    TUTORIAL.section.innerHTML = '';
    TUTORIAL.section.style.display = 'none';
    if(data.fn){
      data.fn();
    };
  };
  button.onclick = button.ontouchstart = action;

};

TUTORIAL.second = function(data){
  TUTORIAL.section.innerHTML = '';
  TUTORIAL.section.style.display = 'block';
  const content = `
    <div class="tutorialSection-second">
      <div class="tutorialSection-second-label icon-tutorial" id="tutorial_second_label">

      </div>
      <div class="tutorialSection-second-body" id="tutorial_second_body">
        <div class="tutorialSection-second-body-container">
          ${data.body}
        </div>


          ${data.button ? `
            <div class="tutorialSection-second-body-button" id="tutorial_second_button">
            <span>${data.button}</span>
            </div>`:''}
      </div>
  `;
  TUTORIAL.section.insertAdjacentHTML('beforeEnd',content);


  const labelButton = document.querySelector('#tutorial_second_label');
  let hided = false;
  function hide(){
    const body = document.querySelector('#tutorial_second_body');
    if(hided){
      body.style.display = 'flex';
      hided = false;
    }else{
      body.style.display = 'none';
      hided = true;
    };
  };
  labelButton.onclick = labelButton.ontouchstart = hide;





  const button = document.querySelector('#tutorial_second_button');
  if(button){
    function action(){
      // TUTORIAL.section.innerHTML = '';
      // TUTORIAL.section.style.display = 'none';
      if(data.fn){
        data.fn();
      };
    };
    button.onclick = button.ontouchstart = action;
  };


};


export {TUTORIAL};
