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
import {
  SETTINGS
} from './settings/settings.js';



function init(){
  const section = `
  <section id="gameInterface">
    <section id='sceneNotifications'></section>
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

    <section id="settingsSection">
      <div id="settingsButton"></div>
      <div class="settingsContainer" id="settingsContainer">
        <div class="settingsContainer-header">
          <div class="">
            settings
          </div>
          <div class="settingsContainer-header-button icon-cancel" id="settingsButton_close">
          </div>
        </div>

        <div class="settingsContainer-body">



          <div class="settingsContainer-body-title">
            video
          </div>
          <div class="">
            <div class="settingsContainer-body-button" id="settingsSection_fullScreen">
              full screen
            </div>

            <div class="settingsContainer-body-line">
              <div class="">
                noise:
              </div>
              <div class="settingsContainer-body-checkBox-checked" id="settingsSection_noiseCheck">
                <div class="settingsContainer-body-checkBox-inner">

                </div>
              </div>
            </div>

            <div class="settingsContainer-body-line">
              <div class="">
                blur:
              </div>
              <div class="settingsContainer-body-checkBox-checked" id="settingsSection_blurCheck">
                <div class="settingsContainer-body-checkBox-inner">

                </div>
              </div>
            </div>

            <div class="settingsContainer-body-line">
              <div class="">
                brightening shadows:
              </div>
              <div class="settingsContainer-body-checkBox-checked" id="settingsSection_brShadowsCheck">
                <div class="settingsContainer-body-checkBox-inner">

                </div>
              </div>
            </div>


            <div class="settingsContainer-body-line">
              <div class="">
                shadow quality:
              </div>
              <div class="settingsContainer-body-line-button" id="settingsSection_shadQ_0">
                low
              </div>
              <div class="settingsContainer-body-line-button" id="settingsSection_shadQ_1">
                mid
              </div>
              <div class="settingsContainer-body-line-button-checked" id="settingsSection_shadQ_2">
                high
              </div>
              <div class="settingsContainer-body-line-button" id="settingsSection_shadQ_3">
                ultr
              </div>
            </div>


          </div>
          <div class="settingsContainer-body-title">
            game
          </div>
          <div class="">
            <div class="settingsContainer-body-line">
              <div class="">
                time:
              </div>
              <div class="settingsContainer-body-line-button-wide-checked" id="settingsSection_time_0">
                morning
              </div>
              <div class="settingsContainer-body-line-button-wide" id="settingsSection_time_1">
                day
              </div>
              <div class="settingsContainer-body-line-button-wide" id="settingsSection_time_2">
                evening
              </div>
            </div>

            <div class="settingsContainer-body-button" id="settingsSection_exitGame">
              exit game
            </div>
          </div>

        </div>
      </div>
    </section>



  </section>
  `






  document.body.insertAdjacentHTML('beforeEnd',section);
  // MAIN.interface.deleteTouches(document.querySelector('#sectorMenu'));
  MAIN.interface.deleteTouches(document.querySelector('#buildingMenu'));



  // document.querySelector('#fullScreenButton').onclick = function() {
  //   if (!document.fullscreenElement) {
  //     document.body.requestFullscreen();
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     };
  //   };
  // },

  FACTORY.init();
  TRUCK.init();
  CITY.init();
  SETTINGS.init();
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
