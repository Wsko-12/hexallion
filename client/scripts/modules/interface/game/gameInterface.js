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
    <section id='balanceSection'>
      <div id='balanceDiv'>
      </div>
    </section>
    <section id='pathSection'>
      <div id="pathSection_ButtonsContainer">
        <div class="card pathSection_buttons" id="pathSection_moveButton">↓</div>
        <div class="card pathSection_buttons" id="pathSection_sellButton">$</div>
      </div>
      <div id="pathSection_notification">you can't drive here</div>
    </section>
  </section>
  `
  document.body.insertAdjacentHTML('beforeEnd',section);
  MAIN.interface.deleteTouches(document.querySelector('#sectorMenu'));
  MAIN.interface.deleteTouches(document.querySelector('#buildingMenu'));


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
