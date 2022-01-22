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
  nowShowedFactoryMenu = factory;
  updateMenu(factory);
};

function closeMenu(event) {
  nowShowedFactoryMenu = null;
  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');
  const factoryMenuSection = document.querySelector('#factoryMenu_Section');
  if (event === undefined || event.target === factoryMenuClicker || event.target === factoryMenuSection) {
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

  nowShowedFactoryMenu = null;
  const menu = document.querySelector('#factoryMenu');
  const name = MAIN.game.configs.buildings[factory.type].name;
  const settings = {
    points: 4,
  };

  if (factory.category === 'mining') {
    settings.speed = 0;
    settings.salary = 0;
    settings.quality = 0;
    settings.storage = 0;
  };
  if (factory.category === 'factory') {
    settings.speed = 0;
    settings.salary = 0;
    settings.volume = 0;
    settings.storage = 0;
  };



  let settingsList = '';
  for (let property in settings) {
    if (property != 'points') {
      const line = `
        <div class="factory_body_settingsLine">
          <div class="factory_body_settingsLine-left">
            ${MAIN.interface.lang.factory[property][MAIN.interface.lang.flag]}
          </div>
          <div class="factory_body_settingsLine-right">
            <div id="factoryMenu_settings_${property}_minus" class="factory_body_settingsLine-button">
              -
            </div>
            <div class="factory_body_settingsLine-text">
              <span id="factoryMenu_settings_${property}_value">0</span>
            </div>
            <div id="factoryMenu_settings_${property}_plus" class="factory_body_settingsLine-button">
              +
            </div>
          </div>
        </div>
      `
      settingsList += line;
    };

  };

  settingsList += `
            <div class="factory_body_settingsLine-accept">
              <div id="factoryMenu_Button" class="factory_body_settings_acceptButton">
                <span class="factory_body_settings_acceptButton-span">${MAIN.interface.lang.factory.run[MAIN.interface.lang.flag]}</span>
              </div>
            </div>`;


  const section = `
    <div class="factory_card">
      <div class="factory_header factory_header_bg-oilWell">
        <div class="factory_header_header">
          ${name} <span class="factory_header_header-span">| ${factory.number}</span>
        </div>
        <div class="factory_header_body">
          <div class="factory_header_body-left">
            <span>${MAIN.interface.lang.factory.settings[MAIN.interface.lang.flag]}</span>
          </div>
          <div class="factory_header_body-right">
            <span id="factoryMenu_settings_points">0${settings.points}</span>
          </div>
        </div>
      </div>
      <div class="factory_body">
        <div class="factory_body_body-settings">
          ${settingsList}
        </div>
      </div>
    </div>
  `;

  menu.insertAdjacentHTML('beforeEnd', section);

  function changeSettings(plus, property) {
    if (plus) {
      if (settings.points > 0 && settings[property] < 3) {
        settings.points--;
        settings[property]++;
      };
    } else {
      if (settings[property] > 0) {
        settings.points++;
        settings[property]--;
      };
    };
    document.querySelector(`#factoryMenu_settings_points`).innerHTML = '0' + settings.points;

    document.querySelector(`#factoryMenu_settings_${property}_value`).innerHTML = settings[property];
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
      player: MAIN.game.data.playerData.login,
      gameID: MAIN.game.data.commonData.id,
      factory: factory.id,
      settings: settings,
    };
    factory.clearNotification();

    if (!MAIN.game.data.playerData.gameOver) {
      MAIN.socket.emit('GAME_factory_applySettings', data);
    };
  };
};

//полностью фарматирует меню
function showFactoryMenu(factory) {
  factory.clearNotification();
  const menu = document.querySelector('#factoryMenu');
  menu.innerHTML = '';
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);


  /* Заполняем прогресс*/
  let progressLine = '';
  factory.settings.productLine.forEach((ceil, i) => {
    let line = '';
    if (ceil === 0) {
      line = `<div class="resource-hole"></div>`;
    } else {
      line = `<div class="resource-gag resource-bg-color-${factory.settings.product}">
                <div class="resource-gag-title">
                  ${factory.settings.product}
                </div>
                <div class="resource-gag-quality">
                  Q${factory.settings.quality}
                </div>
              </div>`;
    };
    progressLine += line;
  });

  //забить дополнительно промежутки
  const progressGags = factory.settings.stockSpeed - factory.settings.productLine.length;
  for (let i = 0; i < progressGags; i++) {
    const line = `<div class="resource-gag"></div>`;
    progressLine += line
  };
  /* ***Заполняем прогресс*** */

  /* Заполняем склад */
  let storageLine = '';
  factory.settings.storage.forEach((ceil, i) => {
    let line = '';
    if (ceil === 0) {
      line = `<div class="resource-hole"></div>`;
    } else {
      line = `<div class="resource-gag resource-bg-color-${factory.settings.product}">
                <div class="resource-gag-title">
                  ${factory.settings.product}
                </div>
                <div class="resource-gag-quality">
                  Q${factory.settings.quality}
                </div>
              </div>`;
    };
    storageLine += line;
  });
  //забить дополнительно промежутки
  const storageGags = 3 - (factory.settings.storage.length - factory.settings.stockStorage);
  for (let i = 0; i < storageGags; i++) {
    const line = `<div class="resource-gag"></div>`;
    storageLine += line;
  };

  let actionButtonLine = null;

  if (factory.settings.storage.includes(1) && !MAIN.game.data.playerData.gameOver) {
    actionButtonLine = `
      <div id='factoryMenu_ActionButton' class="card">
        <span style="margin:auto"> ${MAIN.interface.lang.factory.actionButton[MAIN.interface.lang.flag]}</span>
      </div>
    `;
    if (MAIN.game.data.commonData.turnBasedGame) {
      if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login) {
        actionButtonLine = null;
      };
    };

  };

  /* Заполняем качество */
  let qualityLine = '';
  for (let i = 0; i < 3; i++) {
    if (i < factory.settings.quality) {
      qualityLine += `<div class="quality-gag"></div>`
    } else {
      qualityLine += `<div class="quality-hole"></div>`
    };
  };

  let lowSalaryLine = '';
  for (let i = 0; i < 3; i++) {
    if (i < factory.settings.salary) {
      lowSalaryLine += `<div class="quality-gag"></div>`
    } else {
      lowSalaryLine += `<div class="quality-hole"></div>`
    };
  };

  const section = `
    <div id="factoryMenu_Section">
        <div id="factoryMenu_Card" class="card">
          <div class="card-header">
              ${name} <span class="card-header-span"> | ${factory.number}</span>
          </div>
          <div id="factoryMenu_Card_Top">
            <div id="factoryMenu_Card_ResourseLogo" class="resource-bg-color-${factory.settings.product}">
              <div class='factoryMenu_Card_ResourseLogo_Top'>
                <div class="factoryMenu_Card_ResourseLogo-title">
                  ${factory.settings.product}
                </div>
                <div class="factoryMenu_Card_ResourseLogo-qualityContainer">
                  <span class="factoryMenu_Card_ResourseLogo-qualityContainer-q">${MAIN.interface.lang.factory.q[MAIN.interface.lang.flag]}</span>
                  ${qualityLine}
                </div>
              </div>

            </div>


          </div>
          <div id="factoryMenu_Card_Bottom">
            <div id="factoryMenu_Card_ProductionPart">
              <div class="factoryMenu_Card_ProductionPart_Header">

                <div class="factoryMenu_Card_Titles">
                  ${MAIN.interface.lang.factory.production[MAIN.interface.lang.flag]}
                </div>

                <div class="factoryMenu_LowSalary">
                  ${MAIN.interface.lang.factory.ls[MAIN.interface.lang.flag]}
                  <div class="factoryMenu_LowSalary_Container">
                  ${lowSalaryLine}
                  </div>
                </div>

                <svg style="position:absolute;z-index:-1;left:8px" width="230" height="28" viewBox="0 0 230 28" fill="none">
                  <path d="M0 0H218L230 14L218 28H0V0Z" fill="#b0b0b0"/>
                </svg>

              </div>
              <div id="factoryMenu_Card_ProductionPart_Container">
                ${progressLine}

              </div>
            </div>

            <div id="factoryMenu_Card_StoragePart">
              <div class="factoryMenu_Card_Titles factoryMenu_Card_StoragePart-title">
                ${MAIN.interface.lang.factory.storage[MAIN.interface.lang.flag]}
              </div>

              <div class="factoryMenu_Card_StoragePart-storageContainer">
                ${storageLine}
              </div>
            </div>

          </div>



        </div>
        ${actionButtonLine ? actionButtonLine : ''}
    </div>


  `;
  menu.insertAdjacentHTML('beforeEnd', section);


  if (actionButtonLine) {
    const button = document.querySelector('#factoryMenu_ActionButton');
    button.onclick = openTruckMenu;
    button.ontouchstart = openTruckMenu;

    function openTruckMenu() {
      if (!MAIN.game.data.playerData.gameOver) {
        closeMenu();
        MAIN.interface.game.trucks.openMenu(factory);
      };
    };
  };


};
//это только меняет значения
function updateFactoryMenu(factory) {
  if (nowShowedFactoryMenu) {
    showFactoryMenu(nowShowedFactoryMenu);
  };
};
const FACTORY = {
  init,
  showMenu,
  nowShowedFactoryMenu,
  updateFactoryMenu,
};
export {
  FACTORY
};
