import {
  MAIN
} from '../../../main.js';
import {
  CEIL_MENU
} from './ceilMenu/ceilMenu.js';
import {
  CAMERA
} from './camera/camera.js';
import {
  CREDIT
} from './credit/credit.js';
import {
  BALANCE
} from './balance/balance.js';
import {
  TURN
} from './turn/turn.js';
import {
  FACTORY
} from './factory/factory.js';
import {
  TRUCK
} from './truck/truck.js';
import {
  PATH
} from './path/path.js';
import {
  CITY
} from './city/city.js';



function init(){
  const section = `

  <section id='sceneNotifications'></section>
  <section id="gameInterface">
    <div id="leftMenu">
      <div class="leftMenu-buttons" id="leftMenu_openTruck">
        <div class="icon icon-truck"></div>
      </div>

      <div class="leftMenu-buttons" id="leftMenu_openLeaderTable">
        <div class="icon icon-table"></div>
      </div>
    </div>
    <section id="onCeilDoubleClick">
      <div id="sectorMenu">
          <div class="sectorMenu_Left">
            <div id="changeSectorButton" class="sectorMenu_Top_CentralButton">
               <img class='sectorMenuButton_image' style="width:100%;height:100%;" src="./scripts/modules/interface/game/ceilMenu/icons/changeSectorButton.png">
            </div>
          </div>
          <div class="sectorMenu_Right" id="sectorMenu_List">
          </div>
      </div>
      <div id="buildingMenu">

      </div>
    </section>
    <section id='balanceSection'>
      <div id='balanceDiv'>
        $<span id='balanceDiv_span'><span>
      </div>
    </section>
    <section id='pathSection'>
      <div id="pathSection_ButtonsContainer">
        <div class="card pathSection_buttons" id="pathSection_moveButton">
          <svg width="40" height="40" viewBox="0 0 40 40" style="margin: auto;margin-top: 3px;" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 15.6L20 28L40 15.6V27.6L20 40L0 27.6V15.6Z" fill="#303030"/>
            <path d="M0 0L20 12.4L40 0V12L20 24.4L0 12V0Z" fill="#303030"/>
          </svg>
        </div>
        <div class="card pathSection_buttons" id="pathSection_sellButton">$</div>
      </div>
      <div id="pathSection_neadersContainer">

      </div>
      <div id="pathSection_notification">you can't drive here</div>
    </section>
  </section>
  <div id="fullScreenButton" class="card">
    fullScreen
  </div>

  `






  document.body.insertAdjacentHTML('beforeEnd',section);
  MAIN.interface.deleteTouches(document.querySelector('#sectorMenu'));
  MAIN.interface.deleteTouches(document.querySelector('#buildingMenu'));



  document.querySelector('#fullScreenButton').onclick = function() {
    if (!document.fullscreenElement) {
      document.body.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      };
    };
  },

  FACTORY.init();
  TRUCK.init();
  CITY.init();
};

const GAME_INTERFACE = {
  init,
  camera:CAMERA,
  ceilMenu:CEIL_MENU,
  credit:CREDIT,
  balance:BALANCE,
  turn:TURN,
  factory:FACTORY,
  trucks:TRUCK,
  path:PATH,
  city:CITY,
};

export {
  GAME_INTERFACE
};
