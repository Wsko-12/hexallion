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
  console.log(factory);
  const menu = document.querySelector('#factoryMenu');
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const settings = {
    points: 4,
    speed: 0,
    salary: 0,
    quality: 0,
    storage: 0,
    cardUsed: null,
  };
  const section = `
    <div class="card" id="factoryMenu_SettingsCard">
      <div class="card-header">
          ${name} <span class="card-header-span"> | ${factory.number}</span>
      </div>
      <div id="factoryMenu_SettingsCard_Top">
        <div class="factoryMenu_SettingsCard_Top-resourceLogo resource-bg-color-${factory.product}">
          <span>${factory.product}</span>
        </div>
        <div id="factoryMenu_SettingsCard_Top-pointsCounter">
          <span style="margin:auto">0<span id="factoryMenu_settings_points">${settings.points}</span></span>
        </div>
      </div>

      <div id="factoryMenu_SettingsCard_Middle">
        <div class="factoryMenu_SettingsCard_SettingsString">
          <div class="factoryMenu_SettingsCard_SettingsString-title">
            скорость
          </div>
          <div class="factoryMenu_SettingsCard_SettingsString-SettingContainer">
            <div id="factoryMenu_settings_speed_minus" class="factoryMenu_SettingsCard_SettingsString-button">-</div>
            <div class="factoryMenu_SettingsCard_SettingsString-progressBar">
              <div id="factoryMenu_settings_speed_progress" class="factoryMenu_SettingsCard_SettingsString-progress">
              </div>
            </div>
            <div id="factoryMenu_settings_speed_plus" class="factoryMenu_SettingsCard_SettingsString-button">+</div>
          </div>
        </div>

        <div class="factoryMenu_SettingsCard_SettingsString">
          <div class="factoryMenu_SettingsCard_SettingsString-title">
            качество
          </div>
          <div class="factoryMenu_SettingsCard_SettingsString-SettingContainer">
            <div id="factoryMenu_settings_quality_minus" class="factoryMenu_SettingsCard_SettingsString-button">-</div>
            <div class="factoryMenu_SettingsCard_SettingsString-progressBar">
              <div id="factoryMenu_settings_quality_progress" class="factoryMenu_SettingsCard_SettingsString-progress">
              </div>
            </div>
            <div id="factoryMenu_settings_quality_plus" class="factoryMenu_SettingsCard_SettingsString-button">+</div>
          </div>
        </div>

        <div class="factoryMenu_SettingsCard_SettingsString">
          <div class="factoryMenu_SettingsCard_SettingsString-title">
            низкие зарплаты
          </div>
          <div class="factoryMenu_SettingsCard_SettingsString-SettingContainer">
            <div id="factoryMenu_settings_salary_minus" class="factoryMenu_SettingsCard_SettingsString-button">-</div>
            <div class="factoryMenu_SettingsCard_SettingsString-progressBar">
              <div id="factoryMenu_settings_salary_progress" class="factoryMenu_SettingsCard_SettingsString-progress">
              </div>
            </div>
            <div id="factoryMenu_settings_salary_plus" class="factoryMenu_SettingsCard_SettingsString-button">+</div>
          </div>
        </div>

        <div class="factoryMenu_SettingsCard_SettingsString">
          <div class="factoryMenu_SettingsCard_SettingsString-title">
            склад
          </div>
          <div class="factoryMenu_SettingsCard_SettingsString-SettingContainer">
            <div id="factoryMenu_settings_storage_minus" class="factoryMenu_SettingsCard_SettingsString-button">-</div>
            <div class="factoryMenu_SettingsCard_SettingsString-progressBar">
              <div id="factoryMenu_settings_storage_progress" class="factoryMenu_SettingsCard_SettingsString-progress">
              </div>
            </div>
            <div id="factoryMenu_settings_storage_plus" class="factoryMenu_SettingsCard_SettingsString-button">+</div>
          </div>
        </div>
      </div>

      <div class="factoryMenu_SettingsCard_Bottom" id="factoryMenu_Button">
        <span style="margin:auto">Запустить</span>
      </div>
    </div>
  `

  menu.insertAdjacentHTML('beforeEnd', section);







  function changeSettings(plus, property) {
    const progress = document.querySelector(`#factoryMenu_settings_${property}_progress`);
    if (plus) {
      if (settings.points > 0 && settings[property] < 3) {
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
      player: MAIN.game.data.playerData.login,
      gameID: MAIN.game.data.commonData.id,
      factory: factory.id,
      settings: settings,
    };
    factory.clearNotification();

    if(!MAIN.game.data.playerData.gameOver){
      MAIN.socket.emit('GAME_factory_applySettings', data);
    };
  };
};

//полностью фарматирует меню
function showFactoryMenu(factory){
  factory.clearNotification();
  const menu = document.querySelector('#factoryMenu');
  menu.innerHTML = '';
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);


  /* Заполняем прогресс*/
  let progressLine = '';
  factory.settings.productLine.forEach((ceil,i) => {
    let line = '';
    if(ceil === 0){
       line = `<div class="resource-hole"></div>`;
    }else{
      line = `<div class="resource-gag resource-bg-color-${factory.settings.resource}">
                <div class="resource-gag-title">
                  ${factory.settings.resource}
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
  for(let i=0;i<progressGags;i++){
    const line = `<div class="resource-gag"></div>`;
    progressLine += line
  };
  /* ***Заполняем прогресс*** */

  /* Заполняем склад */
  let storageLine = '';
  factory.settings.storage.forEach((ceil,i) => {
    let line = '';
    if(ceil === 0){
       line = `<div class="resource-hole"></div>`;
    }else{
      line = `<div class="resource-gag resource-bg-color-${factory.settings.resource}">
                <div class="resource-gag-title">
                  ${factory.settings.resource}
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
  for(let i=0;i<storageGags;i++){
    const line = `<div class="resource-gag"></div>`;
    storageLine += line;
  };

  let actionButtonLine = null;

  if(factory.settings.storage.includes(1) && !MAIN.game.data.playerData.gameOver){
    actionButtonLine = `
      <div id='factoryMenu_ActionButton'>
        <span style="margin:auto">Отпаравить</span>
      </div>
    `;
    if(MAIN.game.data.commonData.turnBasedGame){
      if(MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login){
        actionButtonLine = null;
      };
    };

  };

  /* Заполняем качество */
  let qualityLine = '';
  for(let i = 0; i<3;i++){
    if(i<factory.settings.quality){
      qualityLine += `<div class="quality-gag"></div>`
    }else{
      qualityLine += `<div class="quality-hole"></div>`
    };
  };

  const section = `
    <div id="factoryMenu_Section">
        <div id="factoryMenu_Card" class="card">
          <div class="card-header">
              ${name} <span class="card-header-span"> | ${factory.number}</span>
          </div>
          <div id="factoryMenu_Card_Top">
            <div class="factoryMenu_Card_Titles">
              производство
            </div>
            <div id="factoryMenu_Card_ProductionPart_Container">
              ${progressLine}

            </div>
          </div>
          <div id="factoryMenu_Card_Bottom">
            <div id="factoryMenu_Card_ResourseLogo" class="resource-bg-color-${factory.settings.resource}">
              <div class="factoryMenu_Card_ResourseLogo-title">
                ${factory.settings.resource}
              </div>
              <div class="factoryMenu_Card_ResourseLogo-qualityContainer">
                <span class="factoryMenu_Card_ResourseLogo-qualityContainer-q">Q</span>
                ${qualityLine}
              </div>

            </div>
            <div id="factoryMenu_Card_StoragePart">
              <div class="factoryMenu_Card_Titles factoryMenu_Card_StoragePart-title">
                склад
              </div>

              <div class="factoryMenu_Card_StoragePart-storageContainer">
                ${storageLine}
              </div>

              <div class="factoryMenu_Card_StoragePart-price">
                $${factory.settings.stepPrice}/ход
              </div>

            </div>
          </div>
        </div>
        ${actionButtonLine ? actionButtonLine : ''}
    </div>


  `;
  menu.insertAdjacentHTML('beforeEnd', section);


  if(actionButtonLine){
    const button = document.querySelector('#factoryMenu_ActionButton');
    button.onclick = openTruckMenu;
    button.ontouchstart = openTruckMenu;

    function openTruckMenu(){
      if(!MAIN.game.data.playerData.gameOver){
        closeMenu();
        MAIN.interface.game.trucks.openMenu(factory);
      };
    };
  };


};
//это только меняет значения
function updateFactoryMenu(factory){
  if(nowShowedFactoryMenu){
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
