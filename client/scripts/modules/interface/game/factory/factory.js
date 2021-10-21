import {
  MAIN
} from '../../../../main.js';

//тут будет все связанное с фабриками


function init() {
  const section = `
    <section id="factorySection">
      <div id="factoryNotifications"></div>
      <div id="factoryMenuClicker">
        <div id="factoryMenu"></div>
      </div>

    </section>
  `
  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd', section);
  MAIN.interface.deleteTouches(document.querySelector('#factorySection'));

  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');


  MAIN.interface.deleteTouches(factoryMenuClicker);

  //оно должно закрыться
  factoryMenuClicker.onclick = closeMenu;
  factoryMenuClicker.ontouchstart = closeMenu;
};

//надо для того, чтобы был апдейт если игрок смотрит меню фабрики
let nowShowedFactoryMenu = null;

function showMenu(factory) {
  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');
  factoryMenuClicker.style.display = 'block';
  nowShowedFactoryMenu = factory
  updateMenu(factory);
};
function closeMenu(event) {
  nowShowedFactoryMenu = null;
  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');
  if (event === undefined || event.target === factoryMenuClicker) {
    factoryMenuClicker.style.display = 'none';
  };
};

function updateMenu(factory) {
  const menu = document.querySelector('#factoryMenu');
  menu.innerHTML = '';
  if (!factory.settingsSetted) {
    showSettingsSetMenu(factory);
  } else {
    showFactoryMenu(factory);
  };
};

function showSettingsSetMenu(factory) {
  const menu = document.querySelector('#factoryMenu');
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const section = `
    <div id='factoryMenu_Container' class="factoryMenu_cardBackground_${factory.type}" >
      <div id="factoryMenu_title" >${name}</div>
      <div id='factoryMenu_settings_points'>3</div>
      <div class="factoryMenu_settingsLine">
        <div class="factoryMenu_settings_title">speed</div>
        <div class="factoryMenu_settings_container">
          <div id="factoryMenu_settings_speed_minus" class="factoryMenu_settings_button">-</div>
          <div class="factoryMenu_settings_progress">
            <div id="factoryMenu_settings_speed_progress" class="factoryMenu_settings_progressBar"></div>
          </div>
          <div id="factoryMenu_settings_speed_plus" class="factoryMenu_settings_button">+</div>

        </div>
      </div>
      <div class="factoryMenu_settingsLine">
        <div class="factoryMenu_settings_title">quality</div>
        <div class="factoryMenu_settings_container">
          <div id="factoryMenu_settings_quality_minus" class="factoryMenu_settings_button">-</div>
          <div class="factoryMenu_settings_progress">
            <div id="factoryMenu_settings_quality_progress" class="factoryMenu_settings_progressBar"></div>
          </div>
          <div id="factoryMenu_settings_quality_plus" class="factoryMenu_settings_button">+</div>
        </div>
      </div>
      <div class="factoryMenu_settingsLine">
        <div class="factoryMenu_settings_title">low salary</div>
        <div class="factoryMenu_settings_container">
          <div id="factoryMenu_settings_salary_minus" class="factoryMenu_settings_button">-</div>
          <div class="factoryMenu_settings_progress">
            <div id="factoryMenu_settings_salary_progress" class="factoryMenu_settings_progressBar"></div>
          </div>
          <div id="factoryMenu_settings_salary_plus" class="factoryMenu_settings_button">+</div>
        </div>
      </div>
      <div class="factoryMenu_settingsLine">
        <div class="factoryMenu_settings_title">warehouse</div>
        <div class="factoryMenu_settings_container">
          <div id="factoryMenu_settings_warehouse_minus" class="factoryMenu_settings_button">-</div>
          <div class="factoryMenu_settings_progress">
            <div id="factoryMenu_settings_warehouse_progress" class="factoryMenu_settings_progressBar"></div>
          </div>
          <div id="factoryMenu_settings_warehouse_plus" class="factoryMenu_settings_button">+</div>
        </div>
      </div>
      </div>
    </div>
    <div id="factoryMenu_Button">

      <span style="margin:auto">OK</span>

    </div>
  `

  menu.insertAdjacentHTML('beforeEnd', section);



  const settings = {
    points: 4,
    speed: 0,
    salary: 0,
    quality: 0,
    warehouse: 0,
    cardUsed: null,
  };



  function changeSettings(plus, property) {
    const progress = document.querySelector(`#factoryMenu_settings_${property}_progress`);
    if (plus) {
      if (settings.points > 0) {
        settings.points--;
        settings[property]++
      };
    } else {
      if (settings[property] > 0) {
        settings.points++;
        settings[property]--;
      };
    };
    progress.style.width = (settings[property] / 3) * 100 + '%';
    document.querySelector(`#factoryMenu_settings_points`).innerHTML = settings.points;
  };

  for (let property in settings) {
    if (property != 'points' && property != 'cardUsed') {
      document.querySelector(`#factoryMenu_settings_${property}_plus`).onclick = function() {
        changeSettings(true, property)
      };
      document.querySelector(`#factoryMenu_settings_${property}_minus`).onclick = function() {
        changeSettings(false, property)
      };

      document.querySelector(`#factoryMenu_settings_${property}_plus`).ontouchstart = function() {
        changeSettings(true, property)
      };
      document.querySelector(`#factoryMenu_settings_${property}_minus`).ontouchstart = function() {
        changeSettings(false, property)
      };
    };
  };



  document.querySelector('#factoryMenu_Button').onclick = applySettings;
  document.querySelector('#factoryMenu_Button').ontouchstart = applySettings;

  function applySettings() {
    closeMenu();
    const data = {
      player: MAIN.game.playerData.login,
      gameID: MAIN.game.commonData.id,
      factory: factory.id,
      settings: settings,
    };
    factory.clearNotification();
    MAIN.socket.emit('GAME_factory_applySettings', data);
  };

};

//полностью фарматирует меню
function showFactoryMenu(factory){
  const menu = document.querySelector('#factoryMenu');
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const section = `<div id='factoryMenu_Container' class="factoryMenu_cardBackground_${factory.type}"></div>`;
  menu.insertAdjacentHTML('beforeEnd', section);
};
//это только меняет значения
function updateFactoryMenu(factory){

}
const FACTORY = {
  init,
  showMenu,
  nowShowedFactoryMenu,
};
export {
  FACTORY
};
