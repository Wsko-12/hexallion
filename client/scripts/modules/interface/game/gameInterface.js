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
        <div class="sectorMenu_centralButton" id="changeSectorButton">
          <div class="sectorMenu_centralButton-icon icon-changeSector">
          </div>
        </div>
        <div class="sectorMenu_menu">
          <div class="sectorMenu_menu-header" id="sectorMenu_buttonsList">

          </div>
          <div class="sectorMenu_menu-body" id="sectorMenu_cardsList">

          </div>
        </div>
      </div>
      <div id="buildingMenu" class="sectorMenu_build">

      </div>
    </section>
    <section id='balanceSection'>
      <div id='balanceDiv'>
        $<span id='balanceDiv_span'><span>
      </div>
    </section>
    <section id='pathSection'>
      <div id="pathSection_ButtonsContainer">

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
  // MAIN.interface.deleteTouches(document.querySelector('#sectorMenu'));
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
