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
        Ваша задача - выбить всех конкурентов с рынка, обонкротив их. Ну, обо всем по порядку.
        <br/>
        <br/>
        Если ваше устройство Android, рекомендую зайти в настройки и включить full screen.
        `,
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
TUTORIAL.controls = function(){
  MAIN.tutorial.step = 'controls_1';

  TUTORIAL.second({
    body:`
      Теперь давайте поговорим об управлении.
      <br/>
      <br/>
      Для перемещения камеры используйте <span class="tutorialSection-important">левую</span> кнопку мыши или <span class="tutorialSection-important">один</span> палец на телефоне.
      <div class="tutorialSection-imageDiv tutorialSection-image-controls_1"></div>
    `,
    button:'Далее',
    fn(){
      TUTORIAL.step = 'controls_2';
      TUTORIAL.second({
        body:`
          <br/>
          <br/>
          <br/>
          Для вращения камеры используйте <span class="tutorialSection-important">правую</span> кнопку мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
          <div class="tutorialSection-imageDiv tutorialSection-image-controls_2"></div>
        `,
        button:'Далее',
        fn(){
          TUTORIAL.step = 'controls_3';
          TUTORIAL.second({
            body:`
              <br/>
              <br/>
              <br/>
              Для изменения угла камеры используйте <span class="tutorialSection-important">правую</span> кнопку мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
              <div class="tutorialSection-imageDiv tutorialSection-image-controls_3"></div>
            `,
            button:'Далее',
            fn(){
              TUTORIAL.step = 'controls_4';
              TUTORIAL.second({
                body:`
                  <br/>
                  <br/>
                  <br/>
                  Для изменения зума камеры используйте <span class="tutorialSection-important">колесико</span> мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
                  <div class="tutorialSection-imageDiv tutorialSection-image-controls_4"></div>
                `,
                button:'Далее',
                fn(){
                  TUTORIAL.step = 'controls_4';
                  TUTORIAL.second({
                    body:`
                      <br/>
                      <br/>
                      <br/>
                      Для взаимодействия с объектами используйте <span class="tutorialSection-important">двойной клик</span> или <span class="tutorialSection-important">двойной тап</span> на телефоне.
                      <div class="tutorialSection-imageDiv tutorialSection-image-controls_5"></div>
                    `,
                    button:'Понятно',
                    fn(){
                      TUTORIAL.building();
                    },
                  });
                },
              });
            },
          });
        },
      });
    },
  });

};


TUTORIAL.building = function(){
  TUTORIAL.step = 'building_1';
  const ceil = MAIN.gameData.map[2][4];
  MAIN.interface.game.camera.moveCameraTo(ceil.position);
  ceil.addChosenSectorTemporaryMesh(3);
  TUTORIAL.second({
    body:`
      Давайте построим лесопилку
      <br/>
      <br/>
      Выберите сектор ( <span class="tutorialSection-important">двойной клик</span> или  <span class="tutorialSection-important">двойной тап</span>) рядом с лесом.
    `,
  });
};
TUTORIAL.building_2 = function(){
  TUTORIAL.step = 'building_2';
  TUTORIAL.second({
    body:`
      <br/>
      <br/>
      купите и постройте лесопилку.
      <br/>
      <br/>
    `,
  });
};

TUTORIAL.building_3 = function(){
  TUTORIAL.step = 'building_3';
  TUTORIAL.second({
    body:`
      Отлично, теперь нужно установить настройки и запустить Вашу лесопилку.
      Кликните на Вашу леспилку, чтобы сделать это.
    `,
  });
};

TUTORIAL.factory_1 = function(){
  TUTORIAL.step = 'factory_1';
  TUTORIAL.second({
    body:`
      Данные настройки можно будет поменять в любой момент, однако, все ресурсы которые есть на этой фабрике пропадут.
      <br/>
      <br/>
      Они отвечают за следующее:
      <br/>
      <span class="tutorialSection-important">Скорость</span> снижает количество шагов для производства продукта.
      <br/>
      <span class="tutorialSection-important">Низкие затраты</span> снижает стоимость производства продукта.
      <br/>
      <span class="tutorialSection-important">Качество</span> увеличивает качество ресурса и повышает его стоимость на рынке.
      <br/>
      <span class="tutorialSection-important">Склад</span> увеличивает вместимость склада.
      <br/>
      <br/>
      Установите настройки и запустите производство.

    `,
  });
};

TUTORIAL.steps_1 = function(){
  TUTORIAL.step = 'steps_1';
  TUTORIAL.second({
    body:`
      Существует два режима игры:
      <br/>
      <br/>
      <span class="tutorialSection-important">Пошаговый</span> — игрок может строить, отправлять грузовики и тд только когда его ход.
      <br/>
      <span class="tutorialSection-important">Тиковый</span> — все игроки одновременно могут строить и отправлять грузовики, каждые 10сек ( или больше, в зависимости сколько выбрано при создании игры) происходит тик, при котором на фабрике, в кредите и тд совершается ход.
    `,
    button:'Включить шаги',
    fn(){
      MAIN.interface.game.turn.init();
      MAIN.interface.game.turn.makeTimer();
    },
  });
};


export {TUTORIAL};
