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

function init(){
  const section = `
  <section id="gameInterface">
    <section id="onCeilDoubleClick">
      <div id="sectorMenu">
      </div>
      <div id="buildingMenu">
        <h1 id="buildName">Build name</h1>
        <p id="buildCoast">Building coast</p>
        <p id="buildDescription">Building description</p>
        <div style="display:flex;justify-content: space-around">
          <div class="buildingMenu_button" id='cancelBuild'>
            <img class="sectorMenuButton_image" src="./scripts/modules/interface/game/ceilMenu/icons/cancel.png">
          </div>
          <div class="buildingMenu_button" id='aceptBuild'>
            <img class="sectorMenuButton_image" src="./scripts/modules/interface/game/ceilMenu/icons/build.png">
          </div>
        </div>
      </div>
    </section>
  </section>
  `
  document.body.insertAdjacentHTML('beforeEnd',section);
  MAIN.interface.deleteTouches(document.querySelector('#sectorMenu'));
  MAIN.interface.deleteTouches(document.querySelector('#buildingMenu'));
};

const GAME_INTERFACE = {
  init,
  camera:CAMERA,
  ceilMenu:CEIL_MENU,
  credit:CREDIT,
  balance:BALANCE,
};

export {
  GAME_INTERFACE
};
