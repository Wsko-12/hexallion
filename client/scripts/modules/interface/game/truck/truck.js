
import {
  MAIN
} from '../../../../main.js';


function init(){
  const section = `
  <section id="trucksMenuSection">
    <div id="trucksMenuContainer">
      <div id="trucksMenuContainer_title">TRUCKS</div>
      <div id="trucksMenuList">
      </div>
    </div>
  </section>
  `

  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd', section);
  const clicker = document.querySelector('#trucksMenuSection');
  MAIN.interface.deleteTouches(clicker);
  MAIN.interface.returnTouches(document.querySelector('#trucksMenuList'));
  clicker.style.pointerEvents = 'none'
  clicker.onclick = closeMenu;
  clicker.ontouchstart = closeMenu;
};

let nowShowedFactory = null;
function openMenu(factory){

    //это сделано для реопена меню(апдейта)

    if(factory){
      nowShowedFactory = factory;
    }else{
      if(nowShowedFactory){
        factory = nowShowedFactory;
      }else{
        return;
      };
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
            <div class="truckMenu_card">
              <div class="truckMenu_card_inner">
                <div id="truckMenu_card_count">
                  <span style="margin:auto">trucks left:${MAIN.game.data.commonData.trucks.count}</span>
                </div>
                <div id="truckMenu_card_buyButton">
                  <span style="margin:auto">Buy</span>
                </div>
                <div id="truckMenu_card_price">
                  $${MAIN.game.data.commonData.trucks.coast}
                </div>
              </div>
            </div>
      `
      list += buyTruckCard;
    };


    for(let truck in MAIN.game.data.playerData.trucks){
      const thisTruck = MAIN.game.data.playerData.trucks[truck];
      let resource = '';

      if(thisTruck.resource){
        resource = thisTruck.resource;
      };
      const truckCard = `
      <div class="truckMenu_card">
        <div class="truckMenu_card_inner">
          <div class="truckMenu_card_image">

          </div>

          <div class="truckMenu_card_resource truckMenu_card_resource_hole">
            <div id="truckMenu_card_status">${resource}</div>
          </div>

          <div class="truckMenu_card_button">
            <span style="margin:auto" id="truckMenu_card_button_${thisTruck.id}">${resource?'show':'load'}</span>
          </div>
        </div>
      </div>
      `

      list += truckCard;
    };


    trucksMenuList.insertAdjacentHTML('beforeEnd',list);


    //вешаем функции
    const buyButton = document.querySelector('#truckMenu_card_buyButton');
    if(buyButton){
      buyButton.onclick = buyTruck;
      buyButton.onntouchstart = buyTruck;
    };

    for(let truck in MAIN.game.data.playerData.trucks){
      const thisTruck = MAIN.game.data.playerData.trucks[truck];
      const thisButton = document.querySelector(`#truckMenu_card_button_${thisTruck.id}`);


      if(thisTruck.resource === null){
        thisButton.onclick = load;
        thisButton.ontouchstart = load;
      }else{
        thisButton.onclick = show;
        thisButton.ontouchstart = show;
      }

      function show(){
        closeMenu();
      };

      function load(){
        closeMenu();
        loadTruck(thisTruck);
      };
    };





    function buyTruck(){
      if(MAIN.game.data.playerData.balance >= MAIN.game.data.commonData.trucks.coast){
        const data = {
          player:MAIN.game.data.playerData.login,
          gameID:MAIN.game.data.commonData.id,
        };
        MAIN.socket.emit('GAME_truck_buy',data);
      };
    };

    function loadTruck(truck){
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
function closeMenu(event){
  const clicker =  document.querySelector('#trucksMenuSection');
  if(event === undefined ||event.target ===  clicker){
    nowShowedFactory = null;
    document.querySelector('#trucksMenuContainer').style.display = 'none';
    clicker.style.pointerEvents = 'none';
  };
};

function changeTrucksCount(){
  if(  document.querySelector('#truckMenu_card_count')){
      document.querySelector('#truckMenu_card_count').innerHTML = `<span style="margin:auto">trucks left:${MAIN.game.data.commonData.trucks.count}</span>`
  };

};


function updateTruckMenu(){

};
const TRUCK = {
  init,
  openMenu,
  closeMenu,
  changeTrucksCount,
  updateTruckMenu,



};

export {TRUCK}
