
import {
  MAIN
} from '../../../../main.js';


function init(){
  const section = `
  <section id="trucksMenuSection">
    <div id="trucksMenuContainer">
      <div id="trucksMenuList"></div>
    </div>

    <div id="truckNotifications"></div>
    <div id="truckCard" class="card trucksMenu-card"></div>
    <div id="truckCancelButton" > <span style="margin:auto">${MAIN.interface.lang.truck.cancel[MAIN.interface.lang.flag]}</span> </div>
    <div id="truckDice">
      <div id="truckDiceInner">
      </div>
    </div>
  </section>
  `

  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd', section);
  const clicker = document.querySelector('#trucksMenuSection');
  MAIN.interface.deleteTouches(clicker);
  MAIN.interface.returnTouches(document.querySelector('#trucksMenuList'));
  clicker.style.pointerEvents = 'none';
  clicker.onclick = closeMenu;
  clicker.ontouchstart = closeMenu;

  const cancelButton = document.querySelector('#truckCancelButton');
  MAIN.interface.deleteTouches(cancelButton);
  cancelButton.onclick = MAIN.interface.game.path.closeAll;
  cancelButton.ontouchstart = MAIN.interface.game.path.closeAll;


  const leftMenuButton = document.querySelector('#leftMenu_openTruck');
  MAIN.interface.deleteTouches(leftMenuButton);
  leftMenuButton.onclick = () => {openMenu(null)};
  leftMenuButton.ontouchstart = () => {openMenu(null)};

};

let nowShowedFactory = null;
function openMenu(factory){

    //это сделано для реопена меню(апдейта)
    if(factory){
      nowShowedFactory = factory;
    }else{
      factory = nowShowedFactory;
    };

    document.querySelector('#trucksMenuContainer').style.display = 'block';
    const clicker = document.querySelector('#trucksMenuSection');
    clicker.style.pointerEvents = 'auto';


    const trucksMenuList = document.querySelector('#trucksMenuList');
    //clear
    while (trucksMenuList.firstChild) {
      trucksMenuList.firstChild.remove();
    };

    let list = ``;

    if(MAIN.game.data.commonData.trucks.count > 0){
      const buyTruckCard = `

      <div class="card trucksMenu-card" id="truckMenu_card_buy">
        <div class="card-header">
          TRUCK <span class="card-header-span" id="truckMenu_card_count"> | 0${MAIN.game.data.commonData.trucks.count}</span>
        </div>

        <div class="trucksMenu-card-price">
          $${MAIN.game.data.commonData.trucks.coast}
        </div>

        <div class="trucksMenu-card-button" id="truckMenu_card_buyButton">
          <span class="trucksMenu-card-button-span">${MAIN.interface.lang.truck.buy[MAIN.interface.lang.flag]}<span>
        </div>
      </div>

      `

      list += buyTruckCard;
    };



    for(let truck in MAIN.game.data.playerData.trucks){
      const thisTruck = MAIN.game.data.playerData.trucks[truck];
      let product = '';

      if(!thisTruck.product){
        product = `
          <div class="trucksMenu-card-resource resource-hole"></div>
        `;
      };


      if(thisTruck.product){
        product = `
          <div class="trucksMenu-card-resource resource-gag resource-bg-color-${thisTruck.product.name}">
            <div class="resource-gag-title">
              ${thisTruck.product.name}
            </div>
            <div class="resource-gag-quality">
              Q${thisTruck.product.quality}
            </div>
          </div>
          <div class="trucksMenu-card-destroyButton" id="truckMenu_card_destroyButton_${thisTruck.id}">×</div>
        `
      };

      let truckButton = null;
      //если открыли меню с кнопки интерфейса, то фабрика === null
      if(factory){
        truckButton = thisTruck.product?MAIN.interface.lang.truck.show[MAIN.interface.lang.flag]:MAIN.interface.lang.truck.load[MAIN.interface.lang.flag]
      }else{
        truckButton = thisTruck.product?MAIN.interface.lang.truck.show[MAIN.interface.lang.flag]:'';
      }

      const truckCard = `
        <div class="card trucksMenu-card" id="truckMenu_card_${thisTruck.id}">
          <div class="card-header">
            TRUCK <span class="card-header-span"> | 0${thisTruck.truckNumber}</span>
          </div>
          <div style="display:flex">
            ${product}
          </div>

          <div class="trucksMenu-card-button" id="truckMenu_card_button_${thisTruck.id}">
            <span class="trucksMenu-card-button-span">${truckButton}<span>
          </div>
        </div>
      `

      list += truckCard;
    };


    trucksMenuList.insertAdjacentHTML('beforeEnd',list);


    //вешаем функции

    //чтобы при двойном тапе не зумилось
    MAIN.interface.deleteTouches(document.querySelector('#truckMenu_card_buy'));

    const buyButton = document.querySelector('#truckMenu_card_buyButton');
    if(buyButton){
      MAIN.interface.deleteTouches(buyButton);
      buyButton.onclick = buyTruck;
      buyButton.ontouchstart = buyTruck;
    };

    for(let truck in MAIN.game.data.playerData.trucks){
      const thisTruck = MAIN.game.data.playerData.trucks[truck];
      const thisButton = document.querySelector(`#truckMenu_card_button_${thisTruck.id}`);


      const destroyButton = document.querySelector(`#truckMenu_card_destroyButton_${thisTruck.id}`);
      if(destroyButton){
        destroyButton.onclick = destroy;
        destroyButton.ontouchstart = destroy;

        function destroy(){
          closeMenu();
          thisTruck.destroyRequest();
        };
      };

      if(thisTruck.product === null){
        if(factory){
          MAIN.interface.deleteTouches(thisButton);
          thisButton.onclick = load;
          thisButton.ontouchstart = load;

        }else{
          thisButton.parentNode.removeChild(thisButton);
        };
      }else{
        MAIN.interface.deleteTouches(thisButton);
        thisButton.onclick = show;
        thisButton.ontouchstart = show;
      };

      function show(){
        closeMenu();
        MAIN.interface.game.camera.moveCameraTo(thisTruck.object3D.position);
        openCard(thisTruck);
      };

      function load(){
        closeMenu();
        loadTruck(thisTruck);
      };

    };





    function buyTruck(){
      if(!MAIN.game.data.playerData.gameOver){
        if(MAIN.game.data.playerData.balance >= MAIN.game.data.commonData.trucks.coast){
          const data = {
            player:MAIN.game.data.playerData.login,
            gameID:MAIN.game.data.commonData.id,
          };
          if(!MAIN.game.data.playerData.gameOver){
            MAIN.socket.emit('GAME_truck_buy',data);
          };
        };
      };
    };

    function loadTruck(truck){
      if(!MAIN.game.data.playerData.gameOver){
        if(MAIN.game.data.commonData.turnBasedGame){
          if(MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login){
            return;
          };
        };
        if(factory){
          const data = {
            player:MAIN.game.data.playerData.login,
            gameID:MAIN.game.data.commonData.id,
            factoryID:factory.id,
            truckID:truck.id,
          };
          MAIN.socket.emit('GAME_truck_load',data);
        };
      };
    };






};
function closeMenu(event){
  const clicker =  document.querySelector('#trucksMenuSection');
  if(event === undefined ||event.target ===  clicker){
    for(let truck in MAIN.game.data.playerData.trucks){
      MAIN.game.data.playerData.trucks[truck].cardOpened = false;
    }
    nowShowedFactory = null;
    document.querySelector('#trucksMenuContainer').style.display = 'none';
    document.querySelector('#truckCard').style.display = 'none';
    clicker.style.pointerEvents = 'none';
  };
};

function changeTrucksCount(){
  if(  document.querySelector('#truckMenu_card_count')){
      document.querySelector('#truckMenu_card_count').innerHTML = `| 0${MAIN.game.data.commonData.trucks.count}`;
  };

};

function openCard(truck){
  truck.cardOpened = true;
  //либо коментить эту строку, либо уменьшить хитбокс города
  // truck.clearNotification();
  const clicker =  document.querySelector('#trucksMenuSection');
  clicker.style.pointerEvents = 'auto';

  const product = `
    <div class="trucksMenu-card-resource resource-gag resource-bg-color-${truck.product.name}">
      <div class="resource-gag-title">
        ${truck.product.name}
      </div>
      <div class="resource-gag-quality">
        Q${truck.product.quality}
      </div>
    </div>
    <div class="trucksMenu-card-destroyButton" id="truckMenu_card_destroyButton_${truck.id}">×</div>
  `

  const cardContent = `
      <div class="card-header">
        TRUCK <span class="card-header-span"> | 0${truck.truckNumber}</span>
      </div>
      <div style="display:flex">
        ${product}
      </div>
  `




  const truckCard = document.querySelector('#truckCard');
  truckCard.innerHTML = '';
  truckCard.insertAdjacentHTML('beforeEnd',cardContent);
  truckCard.style.display = 'block';

  const destroyButton = document.querySelector(`#truckMenu_card_destroyButton_${truck.id}`);
  if(destroyButton){
    destroyButton.onclick = destroy;
    destroyButton.ontouchstart = destroy;

    function destroy(){
      TRUCK.turningInterfase = false;
      closeMenu();
      truck.destroyRequest();
    };
  };


  if(!truck.sended && truck.ready){
    const button = `
      <div class="trucksMenu-card-button" id="truckCard_button">
        <span class="trucksMenu-card-button-span">${MAIN.interface.lang.truck.send[MAIN.interface.lang.flag]}<span>
      </div>
    `
    truckCard.insertAdjacentHTML('beforeEnd',button);


    document.querySelector('#truckCard_button').onclick = turn;
    document.querySelector('#truckCard_button').ontouchstart = turn;

    function turn(){
      if(!MAIN.game.data.playerData.gameOver){
        truck.turn();
      };
    };
  };
};





const TRUCK = {
  init,
  openMenu,
  closeMenu,
  changeTrucksCount,
  openCard,
  turningInterfase: false,
};

export {TRUCK}
