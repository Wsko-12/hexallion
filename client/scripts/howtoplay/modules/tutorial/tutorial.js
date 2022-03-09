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
        <br/>
        Каждую игру клетки на поле будут раскладываться случайным образом, поэтому выстраивать победную тактику придется по-разному.
        <br/>
        <br/>
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

TUTORIAL.balance_1 = function(){
  TUTORIAL.step = 'balance';
  TUTORIAL.second({
    body:`
      Отлично, у Вас есть деньги.
      </br>
      </br>
      Чтобы узнать состояние Вашего <span class="tutorialSection-important">Баланса</span>, нажмите на сумму вашего счета вверху экрана
    `,
  });
};



TUTORIAL.controls = function(){
  TUTORIAL.step = 'controls_1';

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
          Для вращения камеры используйте <span class="tutorialSection-important">правую</span> кнопку мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
          <div class="tutorialSection-imageDiv tutorialSection-image-controls_2"></div>
        `,
        button:'Далее',
        fn(){
          TUTORIAL.step = 'controls_3';
          TUTORIAL.second({
            body:`
              Для изменения угла камеры используйте <span class="tutorialSection-important">правую</span> кнопку мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
              <div class="tutorialSection-imageDiv tutorialSection-image-controls_3"></div>
            `,
            button:'Далее',
            fn(){
              TUTORIAL.step = 'controls_4';
              TUTORIAL.second({
                body:`
                  Для изменения зума камеры используйте <span class="tutorialSection-important">колесико</span> мыши или <span class="tutorialSection-important">два</span> пальца на телефоне.
                  <div class="tutorialSection-imageDiv tutorialSection-image-controls_4"></div>
                `,
                button:'Далее',
                fn(){
                  TUTORIAL.step = 'controls_4';
                  TUTORIAL.second({
                    body:`
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
      Купите и постройте лесопилку.
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
      Установите настройки и <span class="tutorialSection-important">Запустите</span> производство.

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
      TUTORIAL.steps_2();
    },
  });
};

TUTORIAL.steps_2 = function(){
  TUTORIAL.step = 'steps_2';
  TUTORIAL.second({
    body:`
      Теперь Вы можете понаблюдать за процессом производства на вашей фабрике.
      <br/>
      <br/>
      Откройте <span class="tutorialSection-important">Карточку</span> вашей фабрики кликнув два раза на фабрику.
    `,
  });
};

TUTORIAL.factory_2 = function(){
  TUTORIAL.step = 'factory_2';
  TUTORIAL.second({
    body:`
      В верхней части карточки фабрики находится <span class="tutorialSection-important">Линия производства</span>.
      <div class="tutorialSection-imageDiv tutorialSection-image-factory_1"></div>
      <br/>
      <br/>
      В линии производства показан прогресс продукта и сколько шагов ему осталось до того, как он произведется.
      <div class="tutorialSection-imageDiv tutorialSection-image-factory_2"></div>
      Чтобы уменьшить количество шагов для производства, нужно добавить очки к параметру <span class="tutorialSection-important">Скорость</span> в настройках фабрики.
      <br/>
      <br/>
      Чтобы изменить настройки, кликните на <div class="tutorialSection-iconDiv icon-settings"></div> вверху карточки.
      <br/>
      <span class="tutorialSection-important">Важно!</span> При изменении настроек все продукты на фабрике пропадут
      <br/>
      <br/>
      За каждый шаг с вашего баланса будет списываться расходы на этой фабрике.
      <br/>
      Чтобы уменьшить расходы производства, нужно добавить очки к параметру <span class="tutorialSection-important">Низкие затраты</span> в настройках фабрики.
      <br/>
      Если Вы поставите фабрику на паузу <div class="tutorialSection-iconDiv icon-pause"></div>, то со счета будет списана только половина зарплаты на этой фабрике и удалится текущий производимый продукт.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.factory_3();
    },
  });
};

TUTORIAL.factory_3 = function(){
  TUTORIAL.step = 'factory_3';
  TUTORIAL.second({
    body:`
        Внизу карточки фабрики указан <span class="tutorialSection-important">Склад</span> фабрики.
        <div class="tutorialSection-imageDiv tutorialSection-image-factory_3"></div>
        <br/>
        <br/>
        После того, как ресурс будет готов, он попадет на <span class="tutorialSection-important">Склад</span> фабрики, который указан внизу фабрики
        <div class="tutorialSection-imageDiv tutorialSection-image-factory_4"></div>
        <span class="tutorialSection-important">Важно!</span> Если склад заполнен, то производство нового ресурса не начнется.
        <br/>
        Чтобы открыть дополнительные ячейки склада, нужно добавить очки к параметру <span class="tutorialSection-important">Склад</span> в настройках фабрики.
        <br/>
        <br/>
        Точки на жетоне продукта показывают <span class="tutorialSection-important">Качество</span> этого ресурса.
        <br/>
         Качество увеличивает цену ресурса.
         Чтобы увеличить качество, нужно добавить очки к параметру <span class="tutorialSection-important">Качество</span> в настройках фабрики.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.road_1();
    },
  });
};

TUTORIAL.road_1 = function(){
  MAIN.interface.game.factory.closeMenu();
  TUTORIAL.step = 'road_1';
  const ceil = MAIN.gameData.map[2][4];
  MAIN.interface.game.camera.moveCameraTo(ceil.position);
  ceil.addChosenSectorTemporaryMesh(2);
  TUTORIAL.second({
    body:`
        Пока Ваша лесопилка добывает дерево, давайте позаботимся о том, как его продать.
        <br/>
        <br/>
        Для начала, давайте построим дорогу к городу.
        <br/>
        <br/>
        Выберите сектор ( <span class="tutorialSection-important">двойной клик</span> или  <span class="tutorialSection-important">двойной тап</span>) и постройте дорогу <div class="tutorialSection-iconDiv icon-road"></div>.
    `,
  });
};

TUTORIAL.road_2 = function(){
  TUTORIAL.step = 'road_2';
  TUTORIAL.second({
    body:`
      Дороги можно строить во всех 6 направлениях.
      <br/>
      <span class="tutorialSection-important">Важно!</span> При строительстве мостов помните, что их можно построить только в 2 направления. Это значит, что на мостах нет "перекрестков".
    `,
    button:'Далее',
    fn(){
      TUTORIAL.truck_1();
    },
  });
};


TUTORIAL.truck_1 = function(){
  TUTORIAL.step = 'truck_1';
  TUTORIAL.second({
    body:`
      Теперь приобретите себе <span class="tutorialSection-important">Грузовик</span>.
      <br/>
      На начальных этапах игры одного грузовика будет достаточно.
      <br/>
      <br/>
      Кликните на <div class="tutorialSection-iconDiv-dark icon-truck"></div> в левой части экрана, чтобы открыть меню грузовиков.
    `,
  });
};

TUTORIAL.truck_2 = function(){
  TUTORIAL.step = 'truck_2';
  TUTORIAL.second({
    body:`
      <br/>
      <br/>
      Купите грузовик.
      <br/>
      <br/>
    `,
  });
};

TUTORIAL.sell_1 = function(){
  TUTORIAL.step = 'sell_1';
  TUTORIAL.second({
    body:`
      Отлично, все готово для продажи, кроме самого продукта.
      <br/>
      <br/>
      Откройте карточку фабрики и нажимайте <span class="tutorialSection-important">Закончить ход</span> до тех пор, пока продукт не будет на складе.
    `,
  });
};
TUTORIAL.sell_2 = function(){
  TUTORIAL.step = 'sell_2';
  TUTORIAL.second({
    body:`
      Теперь можно продать продукт.
      <br/>
      <br/>
      Кликните на <span class="tutorialSection-important">жетон</span> продукта на складе, чтобы загрузить его в грузовик.
    `,
  });
};

TUTORIAL.truck_3 = function(){
  TUTORIAL.step = 'truck_3';
  TUTORIAL.second({
    body:`
      Тут как в настольной игре, когда на стол ставится грузовик, игрок кидает кубик и может ходить на столько шагов, сколько выпало на кубике.
      <br/>
      <br/>
      <span class="tutorialSection-important">Важно!</span> При выпадении 6 грузовик пропускает ход.
      <br/>
      <br/>
      Грузовик может передвигаться только по свободным дорогам. Если на перекрестке будет стоять другой грузовик — он не сможет проехать в этом месте.
      <br/>
      Но это не касается городов. Если в городе стоит грузовик, то через него могут проезжать другие.
      <br/>
      <br/>
      Кликнете на город и продайте продукт <div class="tutorialSection-iconDiv icon-money"></div> 

    `,
  });
};

TUTORIAL.economy_1 = function(){
  TUTORIAL.step = 'economy_1';
  TUTORIAL.second({
    body:`
      Поздравляю с первой выручкой! :)
      <br/>
      Пора поговорить про экономику.
      <br/>
      <br/>
      Кликните на <span class="tutorialSection-important">Город</span> в котором вы совершили продажу два раза чтобы открыть его планшет.
    `,
  });
};


TUTORIAL.economy_2 = function(){
  TUTORIAL.step = 'economy_2';
  TUTORIAL.second({
    body:`
      На планшете города Вы можете видеть склады города и его <span class="tutorialSection-important">Баланс</span>.
      <br/>
      <br/>
      Всякий раз, когда Вы тратите деньги (выплаты кредита, постройки, покупка грузовиков, зарплаты и тд), они распределяются между всеми городами поровну.
      <br/>
      Но если Вы что-то продаете в город, то идет списание только с его счета на ваш баланс.
      <br/>
      <br/>
      Это значит, что если торговать только с одним городом, то вскоре Вы не сможете продавать в этот город продукты по хорошей цене, из-за того, что у города попросту не будет денег чтобы с вами расплатиться.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.economy_3();
    },
  });
};

TUTORIAL.economy_3 = function(){
  TUTORIAL.step = 'economy_3';
  TUTORIAL.second({
    body:`
      Перейдите во вкладку стройматериалов <div class="tutorialSection-iconDiv icon-shop-construction"></div>
    `,
  });
};

TUTORIAL.economy_4 = function(){
  TUTORIAL.step = 'economy_4';
  TUTORIAL.second({
    body:`
      Город потребляет продукты с определенной скоростью в шаг со своего склада.
      <br/>
      <br/>
      Городу не выгодно покупать продукты, если его склад этого продукта заполнен, поэтому, он купит у Вас этот продукт со <span class="tutorialSection-important">Скидкой</span>.
      <br/>
      Скидка будет равна проценту заполнености склада.
      <br/>
      <br/>
      Это значит, что если склад продукта в городе будет заполнен на 100%, город купит продукт у Вас за бесплатно.
      <br/>
      Поэтому внимательно следите, что и куда поставляют ваши конкуренты.
    `,
    button:'Понятно',
    fn(){
      MAIN.interface.game.city.closeMenu();
      TUTORIAL.factory_4();
    },
  });
};

TUTORIAL.factory_4 = function(){
  TUTORIAL.step = 'factory_4';
  TUTORIAL.second({
    body:`
      <br/>
      Давайте займемся не только <span class="tutorialSection-important">Добычей</span> продукта, а так же их <span class="tutorialSection-important">Переработкой</span>.
      <br/>
    `,
    button:'Далее',
    fn(){
      TUTORIAL.factory_5();
    },
  });
};
TUTORIAL.factory_5 = function(){
  TUTORIAL.step = 'factory_5';
  const ceil = MAIN.gameData.map[2][4];
  MAIN.interface.game.camera.moveCameraTo(ceil.position);
  ceil.addChosenSectorTemporaryMesh(5);
  TUTORIAL.second({
    body:`
      <br/>
      Выберите сектор и постройте на нем <span class="tutorialSection-important">Картонажная фабрика</span>.
      <br/>
    `,
  });
};
TUTORIAL.factory_6 = function(){
  TUTORIAL.step = 'factory_6';
  TUTORIAL.second({
    body:`
      У <span class="tutorialSection-important">Перерабатывающих заводов</span> немного другие настройки
      <br/>
      <br/>
      Кликнете на завод, чтобы открыть меню настроек
    `,
  });
};

TUTORIAL.factory_7 = function(){
  TUTORIAL.step = 'factory_7';
  TUTORIAL.second({
    body:`
      <span class="tutorialSection-important">Объем производства</span> указывает, сколько произведется продуктов за раз. 
      <br/>
      По стандарту на всех заводах производится 2 продукта из одного. (Например, из одного дерева получается 2 бумаги).
      <br/>
      Повышая этот параметр нужно также повысить параметр <span class="tutorialSection-important">Склада</span>, потому что по стандарту на складе 2 свободных места.
      <br/>
      <br/>
      Так же на этих заводах нет параметра <span class="tutorialSection-important">Качество</span> — оно зависит от того, какого качества перерабатываемые продукты.
      <br/>
      <br/>
      Установите настройки и <span class="tutorialSection-important">Запустите</span> завод.
    `,
  });
};


TUTORIAL.factory_8 = function(){
  TUTORIAL.step = 'factory_8';
  TUTORIAL.second({
    body:`
      <br/>
      Откройте <span class="tutorialSection-important">Карточку</span> Картонажного завода.
      <br/>
    `,
  });
};

TUTORIAL.factory_9 = function(){
  TUTORIAL.step = 'factory_9';
  TUTORIAL.second({
    body:`
      На <span class="tutorialSection-important">Перерабатывающие</span> заводы нужно поставлять сырье.
      <br/>
      В верхней части карточки находится <span class="tutorialSection-important">Склад сырья</span>.
      <div class="tutorialSection-imageDiv tutorialSection-image-factory_5"></div>
      <br/>
      <br/>
      Если в <span class="tutorialSection-important">Рецептах</span> выбран продукт и сырье есть на складе, то производство начнется автоматически.
      <div class="tutorialSection-imageDiv tutorialSection-image-factory_6"></div>
      <br/> 
      Продукты, которые находятся на складе сырья также можно загружать в грузовик.
      <br/>
      <br/> 
      Производство на перерабатывающих заводах будет начинаться, даже если весь склад заполнен.
      <br/>
      <br/>   
      Выберите продукт <span class="tutorialSection-important">Бумага</span>(<div class="tutorialSection-iconDiv product-paper"></div> ) в <span class="tutorialSection-important">Рецептах</span>
    `,
  });
};

TUTORIAL.delivery_1 = function(){
  TUTORIAL.step = 'delivery_1';
  TUTORIAL.second({
    body:`
      Откройте карточку  <span class="tutorialSection-important">Лесопилки</span> и нажимайте <span class="tutorialSection-important">Закончить ход</span> до тех пор, пока продукт не будет на складе.
    `,
  });
};

TUTORIAL.delivery_2 = function(){
  TUTORIAL.step = 'delivery_2';
  TUTORIAL.second({
    body:`
    Теперь нужно доставить дерево на <span class="tutorialSection-important">Картонажную фабрику</span>.
    <br/>
    <br/>
    Кликните на <span class="tutorialSection-important">жетон</span> продукта на складе, чтобы загрузить его в грузовик.
    `,
  });
};

TUTORIAL.delivery_3 = function(){
  TUTORIAL.step = 'delivery_3';
  TUTORIAL.second({
    body:`
    Доставьте дерево на Картонажную фабрику.
    <br/>
    <br/>
    Кликнете на <span class="tutorialSection-important">Ярлык</span> Картонажной фабрики и затем на доставку <div class="tutorialSection-iconDiv icon-delivery"></div> 
    `,
  });
};
TUTORIAL.delivery_4 = function(){
  TUTORIAL.step = 'delivery_4';
  TUTORIAL.second({
    body:`
      Отлично, еще один завод заработал!
      <br/>
      <br/>
      Последнее, о чем я хочу рассказать, это  <span class="tutorialSection-important">Автоотправка</span> грузовиков.
    `,
    button:'Продолжить',
    fn(){
      TUTORIAL.autosending_1();
    },
  });
};

TUTORIAL.autosending_1 = function(){
  TUTORIAL.step = 'autosending_1';
  TUTORIAL.second({
    body:`
    <span class="tutorialSection-important">Автоотправка</span> нужна для того, что когда у Вас будет много фабрик, Вы могли выстраивать автоматические очереди отправки продуктов с завода на завод или в город.
    <br/>
    <br/>
    Откройте <span class="tutorialSection-important">Карточку</span> лесопилки, и перейдите в меню <span class="tutorialSection-important">Автоотправка</span> внизу карточки`,
  });
};


TUTORIAL.autosending_2 = function(){
  TUTORIAL.step = 'autosending_2';
  TUTORIAL.second({
    body:`
      В меню <span class="tutorialSection-important">Автоотправка</span>  будет <span class="tutorialSection-important">Список</span> продуктов, которые производит данное производство. На лесопилке всего один — дерево.
      <br/>
      <br/>
      Есть два вида отправки:
      <br/>
      <div class="tutorialSection-iconDiv icon-bestPrice"></div> — отправляет грузовик с продуктом в город, где лучшая цена.
      <br/>
      <div class="tutorialSection-iconDiv icon-findRoute"></div> — отправляет грузовик в конечную точку, которую задаете Вы.
      <br/>
      <br/>
      Когда <span class="tutorialSection-important">Очередь</span> автооправок создана и продукт появится на складе предприятия, он сразу отправится по нужному маршруту из очереди(При наличии свободных грузовиков). 
      <br/>
      <br/>
      Когда очередь дойдет до конца, она возобновится <span class="tutorialSection-important">Сначала</span>.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.autosending_3();
    }
  });
};

TUTORIAL.autosending_3 = function(){
  TUTORIAL.step = 'autosending_3';
  TUTORIAL.second({
    body:`
      Давайте сделаем <span class="tutorialSection-important">Очередь</span> автоотправок.
      <br/>
      <br/>
      Сделаем так: сначала, когда продукт произведется, пусть он едет продаваться в город, а следующий готовый продукт поедет на картонажную фабрику.
      <br/>
      <br/>
      Для этого сначала добавим маршрут <span class="tutorialSection-important">Лучшая цена</span>.
      <br/>
      <br/>
      Кликнете на <div class="tutorialSection-iconDiv icon-bestPrice"></div> чтобы добавить маршрут в очередь.

    `,
  });
};

TUTORIAL.autosending_4 = function(){
  TUTORIAL.step = 'autosending_4';
  TUTORIAL.second({
    body:`
      Теперь добавим в очередь <span class="tutorialSection-important">Конечную точку</span> — Картонажную фабрику.
      <br/>
      <br/>
      Кликнете на <div class="tutorialSection-iconDiv icon-findRoute"></div> указать конечную точку.
    `,
  });
};

TUTORIAL.autosending_5 = function(){
  TUTORIAL.step = 'autosending_5';
  TUTORIAL.second({
    body:`
      <br/>
      Теперь кликнете на <span class="tutorialSection-important">ярлык</span>  Картонажной фабрики, чтобы указать конечную точку.
    `,
  });
};


TUTORIAL.autosending_6 = function(){
  TUTORIAL.step = 'autosending_6';
  TUTORIAL.second({
    body:`
      Отлично, <span class="tutorialSection-important">очередь</span> отправок готова.
      <br/>
      <br/>
      Теперь, когда продукт будет готов, он автоматически отправится по нужным маршрутам.
      <br/>
      <br/>
      Маршрут, по которому отправится грузовик следующим помечен зеленым цветом.
      <br/>
      Вы можете поменять его, кликнув на <span class="tutorialSection-important">другой маршрут</span> из этой очереди.
      <br/>
      <br/>
      Вам остается только следить за тем, чтобы на дороге не создавались заторы и все отлично работало. 
    `,
    button:'Понятно',
    fn(){
      TUTORIAL.products_1();
    },
  });
};

TUTORIAL.products_1 = function(){
  TUTORIAL.step = 'products_1';
  TUTORIAL.second({
    body:`
      И пару слов о природных продуктах.
      <br/>
      <br/>
      Такие продукты как:
      <br/>
      Дерево (<div class="tutorialSection-iconDiv product-wood"></div>), 
      <br/>
      Вода (<div class="tutorialSection-iconDiv product-water"></div>), 
      <br/>
      Песок (<div class="tutorialSection-iconDiv product-sand"></div>),
      <br/>
      находятся "на поверхности", то есть видны сразу.
      <br/>
      <br/>
      Чтобы добывать воду, потройте Водоочистительную станцию <span class="tutorialSection-important">рядом</span> с водой, как строили лесопилку рядом с лесом.
      <br/>
      <br/>
      Песок добывается на той же клетке, где песок.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.products_2();
    },
  });
};

TUTORIAL.products_2 = function(){
  TUTORIAL.step = 'products_2';
  TUTORIAL.second({
    body:`
      Однако, есть еще "скрытые" продукты, такие как:
      <br/>
      Cталь (<div class="tutorialSection-iconDiv product-steel"></div>), 
      <br/>
      Нефть (<div class="tutorialSection-iconDiv product-oil"></div>),
      <br/>
      Золото (<div class="tutorialSection-iconDiv product-gold"></div>).
      <br/>
      <br/>
      Вы их обнаружите, когда начнете строить на клетке, где лежат эти ресурсы. Вы обнаружите, что можно будет построить Нефтяную вышку, Сталелитейный завод или Золотодобывающий рудник.
      <br/>
      <br/>
      Поэтому, исследуйте карту, когда есть на это время.
    `,
    button:'Далее',
    fn(){
      TUTORIAL.end();
    },
  });
};
TUTORIAL.end = function(){
  TUTORIAL.step = 'freePlay';
  TUTORIAL.second({
    body:`
      Вы находитесь в режиме свободной игры.
      <br/>
      <br/>
      Играйте вместе с друзьями онлайн на  <a href="http://kapitalisttest.herokuapp.com" style="text-decoration-color: white"><span class="tutorialSection-important">kapitalisttest.herokuapp.com</span></a>.
    `,
  });
};


export {TUTORIAL};
