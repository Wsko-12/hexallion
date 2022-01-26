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


function showMenu(factory) {
  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');
  factoryMenuClicker.style.display = 'block';
  FACTORY.nowShowedFactoryMenu = factory;
  updateMenu(factory);
};

function closeMenu(event) {
  const factoryMenuClicker = document.querySelector('#factoryMenuClicker');
  if (event === undefined || event.target === factoryMenuClicker) {
    FACTORY.nowShowedFactoryMenu = null;
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

  FACTORY.nowShowedFactoryMenu = factory;
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
  let name = MAIN.game.configs.buildings[factory.type].name;

  let rawStorage = '<div class="factory_body_rawStorage">';
  if(factory.category === 'factory'){
    let line = '';
    for(let product in factory.settings.rawStorage){
      const thisProduct = factory.settings.rawStorage[product];
      //если на склад загружен
      if(thisProduct){
        let quality = '';
        for(let i = 0;i < thisProduct.quality;i++){
          quality+=`<span class="product-quality"></span>`;
        };
        line = `<div class="factory_product-gap" id="factory_rawProduct_${product}">
                   <div class="product-icon product-${product}"></div>
                   <div class="product-qualityContainer">
                     ${quality}
                   </div>
                 </div>`

      }else{
        line = `<div class="factory_product-hole factory_product-hole-rawStorage">
                   <div class="product-icon product-${product}"></div>
                </div>`
      };

    };
    rawStorage += line;
  };
  rawStorage += `</div>`;


  let progressBar = `<div class="factory_body_progressBar">`;

    let scaleContainer = `<div class="factory_body_progressBar_scaleContainer">`;
    const stepScale = 82/(factory.settings.productLine.length - 1);
    const scale = stepScale.toFixed(2);
    for(let i = 0;i<factory.settings.productLine.length;i++){
      const line = `
        <div class="factory_body_progressBar_scale
             ${i === 0?'factory_body_progressBar_scale-first':''}
             ${i === factory.settings.productLine.length - 1?'factory_body_progressBar_scale-last':''}"

            style="${i===0?'':`width:${scale}%`}">
          <span>${factory.settings.productLine.length - i}</span>
        </div>
      `
      scaleContainer+=line;
    };
    scaleContainer+= `</div>`;
    progressBar+=scaleContainer;


    const productIndex = factory.settings.productLine.indexOf(1);
    let productContainer = `
          <div class="factory_body_progressBar_productContainer"
          style="left:${productIndex?productIndex*stepScale+'%':''}">`;


    if(productIndex != -1){
      let quality = '';
      for(let i = 0;i < factory.settings.productInProcess.quality;i++){
        quality+=`<span class="product-quality"></span>`;
      };
      productContainer += `
                          <div class="factory_product-gap">
                             <div class="product-icon product-${factory.settings.productInProcess.name}"></div>
                             <div class="product-qualityContainer">
                               ${quality}
                             </div>
                           </div>`;
    };
    productContainer += `</div>`;
    progressBar+=productContainer;

  progressBar+= `</div>`;




  let ingredientList = '';
    if(factory.category === 'mining'){
      ingredientList += `
      <div class="factory_body_body-production-left">
      <div class="factory_body_productHugeIcon product-${factory.product}"></div>`;
    };

    if(factory.category === 'factory'){
      ingredientList += `<div class="factory_body_ingredientList">`;
        for(let i = 0;i<factory.settings.products.length;i++){
          const thisProduct = factory.settings.products[i];
          let ingredients = '';
          for(let j = 0;j<thisProduct.raw.length;j++){
            const thisIngredient = thisProduct.raw[j];
            ingredients+= `
              <div class=" factory_body_ingredientList-icon product-${thisIngredient}"></div>
            `;
          };

          const arrow = `
            <div class="factory_body_ingredientList-arrow">
              <div class="factory_body_ingredientList-arrow-coast">
                $${thisProduct.price}
              </div>
              <div class="factory_body_ingredientList-arrow-symbol">
                →
              </div>
            </div>
          `;
          const product = `<div class="factory_body_ingredientList-icon product-${thisProduct.name}"></div>`

          const volume = `
              <div class="factory_body_ingredientList-volume">
                <span>x${thisProduct.productionVolume + factory.settings.volumePoints}</span>
              </div>
          `;

          ingredientList+= `
            <div class="factory_body_ingredientList-item ${factory.settings.productSelected === thisProduct.name ? 'factory_body_ingredientList-item-selected':''}" id="factory_body_ingredientList_item_${thisProduct.name}">
              ${ingredients}
              ${arrow}
              ${product}
              ${volume}
            </div>
          `;
        };
    };


  ingredientList+='</div>';



  let settingsPart = `<div class="factory_body_body-production-right">`;
    const settings = {};
    if(factory.category === 'mining'){
      settings.ls = factory.settings.salaryPoints;
      settings.q = factory.settings.qualityPoints;
      settings.s = factory.settings.speedPoints;
    };
    if(factory.category === 'factory'){
      settings.ls = factory.settings.salaryPoints;
      settings.v = factory.settings.volumePoints;
      settings.s = factory.settings.speedPoints;
    };

    for(let param in settings){
      let line = `<div class="factory_body_body-production_settings-list">`;

      line += `<div class="factory_body_body-production_settings-text">
      ${MAIN.interface.lang.factory[param][MAIN.interface.lang.flag]}
      </div>`;
      for(let i = 0;i<3;i++){
        if(i<settings[param]){
          line+=`<div class="factory_body_body-production_settings-gap"></div>`;
        };
        if(i>=settings[param]){
          line +=`<div class="factory_body_body-production_settings-hole"></div>`;
        }
      };
      line += `</div>`;
      settingsPart+= line;
    };
  settingsPart += '</div>';



  let storagePart = ` <div class="factory_body_storage">`;

  for(let i=0;i<factory.settings.storage.length;i++){
    const product = factory.settings.storage[i];
    if(product){
      let quality = ``;
      for(let i = 0;i < product.quality;i++){
        quality+=`<span class="product-quality"></span>`;
      };
      storagePart += `
        <div class="factory_product-gap" id="factory_storage_${i}">
          <div class="product-icon product-${product.name}"></div>
          <div class="product-qualityContainer">
            ${quality}
          </div>
        </div>`;
    }else{
      storagePart += `<div class="factory_product-hole"></div>`;
    };
  };


  for(let i=0;i<5;i++){
    if(i>=factory.settings.storage.length){
      storagePart += `<div class="factory_storage-gap"></div>`;
    };
  };


  storagePart += `</div>`;

  const card = `
          <div class="factory_card">
             <div class="factory_header factory_header_bg-oilWell">
               <div class="factory_header_header">
                 ${name} <span class="factory_header_header-span">| ${factory.number}</span>
               </div>
             </div>

             <div class="factory_body">

               <!-- raw storage -->
               ${rawStorage}
               <!-- /raw storage -->

               <!-- body -->
               <div style="position:relative; top:-28px; height:100%;">

                 <!-- progress bar -->
                 ${progressBar}
                 <!-- /progress bar -->

                 <!-- central part -->
                 <div class="factory_body_body-production">
                   ${ingredientList}
                   ${settingsPart}
                 </div>
                 <!-- /central part -->

                 <!-- storage part -->
                 ${storagePart}
                 <!-- /storage part -->

               </div>
               <!-- /body -->
             </div>


             <div class="factory_footer">
               <div class="factory_footer_header">
                 <span>${MAIN.interface.lang.factory.autosend[MAIN.interface.lang.flag]}</span>
               </div>
             </div>

           </div>

           <div id="factory_card_error">

           </div>
  `;

  menu.innerHTML = '';
  menu.insertAdjacentHTML('beforeEnd',card);

  document.querySelector(`#factory_card_error`).style.display = 'none';


  factory.settings.storage.forEach((product, i) => {
    if(product){
      document.querySelector(`#factory_storage_${i}`).onclick = ()=>{factory.sendProduct(i)};
    };
  });

  for(let product in factory.settings.rawStorage){
    if(factory.settings.rawStorage[product]){
      document.querySelector(`#factory_rawProduct_${product}`).onclick = ()=>{factory.sendRawProduct(product)};
    };
  };


  if(factory.category === 'factory'){
    for(let i = 0;i<factory.settings.products.length;i++){

      const thisProduct = factory.settings.products[i];
      document.querySelector(`#factory_body_ingredientList_item_${thisProduct.name}`).onclick = ()=>{
        factory.setProductSelected(thisProduct.name)}
    };
  };


};
//это только меняет значения
function updateFactoryMenu() {
  if (FACTORY.nowShowedFactoryMenu) {
    showFactoryMenu(FACTORY.nowShowedFactoryMenu);
  };
};

function showFactoryError(messageCode){
  const errors = {
    roadEmpty:{
      ru:'дорога у фабрики занята',
      eng:'the road near the factory is occupied',
    },
    noTruck:{
      ru:'сначала купите грузовик',
      eng:'buy a truck first',
    },
    noFreeTruck:{
      ru:'нет свободных грузовиков',
      eng:'no free trucks',
    },
    turn:{
      ru:'дождитесь своего хода',
      eng:'wait for your turn',
    },

  };

  const errorDiv = document.querySelector(`#factory_card_error`);

  errorDiv.style.display = 'flex';
  errorDiv.style.transitionDuration = '0s';
  errorDiv.style.opacity = 1;
  errorDiv.innerHTML = `<div class='factory_card_error_icon'>!</div><div class='factory_card_error_text'>${errors[messageCode][MAIN.interface.lang.flag]}</div>`;

  const rand = Math.random().toString();
  errorDiv.dataset.rand = rand;
  setTimeout(()=>{
    errorDiv.style.transitionDuration = '4s';
    errorDiv.style.opacity = 0;
  },500);
  setTimeout(()=>{
    if(errorDiv){
      if(errorDiv.dataset.rand === rand){
        errorDiv.style.display = 'none';
      };
    };
  },4000);

};



const FACTORY = {
  init,
  showMenu,
  closeMenu,
  nowShowedFactoryMenu:null,
  updateFactoryMenu,
  showFactoryError,
};
export {
  FACTORY
};
