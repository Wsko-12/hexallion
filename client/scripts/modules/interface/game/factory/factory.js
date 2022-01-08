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
  let name = factory.type;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  const section = `
    <div id='factoryMenu_Container' class="factoryMenu_cardBackground_${factory.type}" >
      <div id="factoryMenu_title">${name}</div>
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
        <div class="factoryMenu_settings_title">storage</div>
        <div class="factoryMenu_settings_container">
          <div id="factoryMenu_settings_storage_minus" class="factoryMenu_settings_button">-</div>
          <div class="factoryMenu_settings_progress">
            <div id="factoryMenu_settings_storage_progress" class="factoryMenu_settings_progressBar"></div>
          </div>
          <div id="factoryMenu_settings_storage_plus" class="factoryMenu_settings_button">+</div>
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
    storage: 0,
    cardUsed: null,
  };



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
  console.log(factory)
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
        <span style="margin:auto">Send truck</span>
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

  // const section = `
  //       <div id="factoryMenu_Section">
  //           <div id="factoryMenu_Card">
  //               <div id="factoryMenu_Card_Title">${name}</div>
  //               <div id="factoryMenu_Card_ProgressLine">
  //                   <div id="factoryMenu_Card_ProgressLine_Title">
  //                     Progress
  //                   </div>
  //                   <div id="factoryMenu_Card_ProgressLine_Container">
  //                     ${progressLine}
  //                   </div>
  //                   <div id="factoryMenu_Card_ProgressLine_Price">
  //                     $${factory.settings.stepPrice} per step
  //                   </div>
  //               </div>
  //
  //
  //               <div id="factoryMenu_Card_StorageLine">
  //                   <div id="factoryMenu_Card_StorageLine_Title">
  //                     Storage
  //                   </div>
  //                   <div id="factoryMenu_Card_StorageLine_Container">
  //                       ${storageLine}
  //                   </div>
  //               </div>
  //               <div id="factoryMenu_Card_TEST"></div>
  //           </div>
  //           ${actionButtonLine ? actionButtonLine : ''}
  //       </div>
  //
  //
  // `;

  const section = `
    <div id="factoryMenu_Section">
        <div id="factoryMenu_Card" class="card">
          <div class="card-header">
              ${name} <span class="card-header-span"> | ${factory.number}</span>
          </div>
          <div id="factoryMenu_Card_Top">
            <div class="factoryMenu_Card_Titles">
              PRODUCTION
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
                STORAGE
              </div>

              <div class="factoryMenu_Card_StoragePart-storageContainer">
                ${storageLine}
              </div>

              <div class="factoryMenu_Card_StoragePart-price">
                $${factory.settings.stepPrice}/step
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
