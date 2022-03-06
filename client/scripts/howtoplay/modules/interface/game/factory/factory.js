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
      <div class="factory_header factory_header_bg-${factory.type}">
        <div class="factory_header_header">
          <span>${name} <span class="factory_header_header-span">| ${factory.number}</span></span>
          ${factory.settingsSetted ? `
            <div class="factory_header_header-buttonsContainer">
                      <div class="factory_header_header-button">

                      </div>
                      <div id="factory_cancelButton" class="factory_header_header-button icon-cancel">

                      </div>
            </div>`:''}

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

  if (document.querySelector('#factory_cancelButton')) {
    document.querySelector('#factory_cancelButton').onclick = () => {
      showFactoryMenu(factory);
    };
    document.querySelector('#factory_cancelButton').ontouchstart = () => {
      showFactoryMenu(factory);
    };
  };

  function applySettings() {
    closeMenu();
    const points = 4;
    const newSettings = {}
    if (factory.category === 'mining') {

      newSettings.quality = settings.quality;
      newSettings.qualityPoints = settings.quality;

      newSettings.settingsSetted = true;

      newSettings.productLine = [];
      //сначала забиваем стандартом
      for (let i = 0; i < MAIN.game.configs.factories[factory.type].speed; i++) {
        newSettings.productLine.push(0);
      };
      //потом отрезаем скорости
      for (let i = 0; i < settings.speed; i++) {
        newSettings.productLine.pop();
      };
      newSettings.speedPoints = settings.speed;


      //полная цена за все производство
      const prise =  MAIN.game.configs.factories[factory.type].price

      //каждый salary point сбивает цену производства на 15%
      //сразу добавляем +15% к стоймости, если у игрока зарплаты на 0 прокачаны;

      // const newPrise = prise + (prise*(0.15));
      const newPrise = prise;

      newSettings.price = Math.round(newPrise - (newPrise * (0.15 * settings.salary)));
      newSettings.stepPrice = Math.round(newSettings.price / newSettings.productLine.length);
      newSettings.salaryPoints = settings.salary;


      newSettings.stockStorage = MAIN.game.configs.factories[factory.type].storage;
      newSettings.storage = [];
      for (let i = 0; i < MAIN.game.configs.factories[factory.type].storage + settings.storage; i++) {
        newSettings.storage.push(null);
      };
      newSettings.storagePoints = settings.storage;


      //надо для переназначения настроек фабрики
      newSettings.productInProcess = null;
      newSettings.productSelected = MAIN.game.configs.factories[factory.type].product;

    };
    //происходит, когда игрок меняет настройки

    if (factory.category === 'factory') {

      newSettings.productLine = [];
      //сначала забиваем стандартом
      for (let i = 0; i < MAIN.game.configs.factories[factory.type].speed; i++) {
        newSettings.productLine.push(0);
      };
      //потом отрезаем скорости
      for (let i = 0; i < settings.speed; i++) {
        newSettings.productLine.pop();
      };

      newSettings.speedPoints = settings.speed;

      //каждый salary point сбивает цену производства на 15%
      newSettings.salaryPoints = settings.salary;


      // this.price = Math.round(newPrise - (newPrise * (0.15 * settings.salary)));
      // this.stepPrice = Math.round(this.price / this.productLine.length);

      newSettings.stockStorage = MAIN.game.configs.factories[factory.type].storage;
      newSettings.storage = [];
      for (let i = 0; i <  MAIN.game.configs.factories[factory.type].storage + settings.storage; i++) {
        //null потому что могут быть разные ресурсы на складе
        newSettings.storage.push(null);
      };
      newSettings.storagePoints = settings.storage;


      newSettings.volumePoints = settings.volume;


      //надо для переназначения настроек фабрики
      newSettings.productInProcess = null;
      newSettings.productSelected = null;
      newSettings.rawStorage = {};
      const products = MAIN.game.configs.factories[factory.type].products;
      products.forEach((product) => {
        product.raw.forEach((raw) => {
          newSettings.rawStorage[raw] = null;
        });
      });
    };


    if (factory.category === 'mining') {
      const data = {
        id: factory.id,
        name: factory.type,
        product: MAIN.game.configs.factories[factory.type].product,
        storage: newSettings.storage,
        //надо, чтобы забить на карточке клетки
        stockStorage: newSettings.stockStorage,
        stockSpeed: MAIN.game.configs.factories[factory.type].speed,
        quality: newSettings.quality,
        salary: newSettings.salaryPoints,
        productLine: newSettings.productLine,
        price: newSettings.price,
        stepPrice: newSettings.stepPrice,

        productInProcess:null,
        speedPoints: newSettings.speedPoints,
        salaryPoints: newSettings.salaryPoints,
        qualityPoints: newSettings.qualityPoints,
        storagePoints: newSettings.storagePoints,
      };
      if(MAIN.tutorial.step === 'factory_1'){
        MAIN.tutorial.steps_1();
      };
      factory.applySettings(data);
    }else if(factory.category === 'factory'){
      const data = {
        id: factory.id,
        name: factory.type,
        products: MAIN.game.configs.factories[factory.type].products,
        storage: newSettings.storage,
        //надо, чтобы забить на карточке клетки
        productLine: newSettings.productLine,
        stockStorage: newSettings.stockStorage,
        stockSpeed: MAIN.game.configs.factories[factory.type].speed,
        salary: newSettings.salaryPoints,
        productSelected: null,
        productInProcess:null,


        speedPoints: newSettings.speedPoints,
        salaryPoints: newSettings.salaryPoints,
        volumePoints: newSettings.volumePoints,
        storagePoints: newSettings.storagePoints,
      };

      data.rawStorage = {};
      data.products.forEach((product) => {
        product.raw.forEach((raw) => {
          data.rawStorage[raw] = null;
        });
      });
      factory.applySettings(data);
    };
  };
};

function updateFactoryAutosendBody(factory) {
  const body = document.querySelector(`#factory_autosend_body_${factory.id}`);
  if (!body) {
    return;
  }
  body.innerHTML = '';
  let autosend = '';


  MAIN.interface.returnTouches(body);


  //собираем все, что производит фабрика
  const products = [];
  if (factory.category === 'mining'){
    products.push(factory.product);
  }else if(factory.category === 'factory'){
    factory.settings.products.forEach((product, i) => {
      products.push(product.name);
    });
  };


  products.forEach((product, i) => {
    autosend += `
     <div class="factory_footer_body_item">
        <div class="factory_footer_body_item-header">
          <div class="factory_footer_body_item-header_icon product-${product}"></div>

          <div class="factory_footer_body_item-header_buttonsContainer">
            <div class="factory_footer_body_item-header_buttonsContainer-icon icon-plus">
            </div>
            <div class="factory_footer_body_item-header_buttonsContainer-button" id="factoryCard_addDirection_bestPrise_${product}">
             <div class="factory_footer_body_item-header_buttonsContainer-button-icon icon-bestPrice">

             </div>
            </div>
            <div class="factory_footer_body_item-header_buttonsContainer-button" id="factoryCard_addDirection_findRoute_${product}">
              <div class="factory_footer_body_item-header_buttonsContainer-button-icon icon-findRoute">

              </div>
            </div>
          </div>

          <div class="factory_footer_body_item-header_icon icon-list" id="factoryCard_OpenDirectionsListButton_${product}"></div>
        </div>

        <!-- direction list -->
        <div class="factory_footer_body_item_directionsList" id="factoryCard_directionsList_${product}">




        </div>
        <!-- /direction list -->

      </div>
     `;
  });

  body.insertAdjacentHTML('beforeEnd',autosend);



  function updateDirectionLists(){
    products.forEach((product, i) => {
        const list = document.querySelector(`#factoryCard_directionsList_${product}`);
        list.innerHTML = '';
        for (let i = 0; i < factory.autosend.list[product].directions.length; i++) {
          const thisDirection = factory.autosend.list[product].directions[i];
          if(thisDirection.mode === 'price'){
            const thisStr = `
              <div id="factoryCard_direction_${product}_${i}"class="factory_footer_body_item_directionsList_item ${factory.autosend.list[product].current === i ?'factory_footer_body_item_directionsList_item-current':''}">
                <div class="factory_footer_body_item_directionsList_item-icon icon-bestPrice">

                </div>

                <div class="factory_footer_body_item_directionsList_item-icon icon-cancel" id='factoryCard_deleteDirection_${product}_${i}'>

                </div>
              </div>
            `;
            list.insertAdjacentHTML('beforeEnd',thisStr);

            function deleteDirection(){
                factory.autosend.remove({
                  product:product,
                  index:i,
                });
                updateDirectionLists();
            };
            document.querySelector(`#factoryCard_deleteDirection_${product}_${i}`).onclick = deleteDirection;
            document.querySelector(`#factoryCard_deleteDirection_${product}_${i}`).ontouchstart = deleteDirection;


            function changeCurrent(e){
              if(e.path[0] === document.querySelector(`#factoryCard_direction_${product}_${i}`)){
                factory.autosend.changeCurrent({
                  product:product,
                  index:i,
                });
                updateDirectionLists();
              };
            };

            document.querySelector(`#factoryCard_direction_${product}_${i}`).onclick = changeCurrent;
            document.querySelector(`#factoryCard_direction_${product}_${i}`).ontouchstart = changeCurrent;
          };
          if(thisDirection.mode === 'route'){
                let finalObject = ''
                  if(thisDirection.finalObject.category === 'city'){
                    finalObject =  thisDirection.finalObject.name;
                  }else{
                    let name = MAIN.game.configs.buildings[thisDirection.finalObject.type].title[MAIN.interface.lang.flag];
                    name = name[0].toUpperCase() + name.slice(1);
                    finalObject =  `${name} | ${thisDirection.finalObject.number}`
                  };
            const thisStr = `
              <div id="factoryCard_direction_${product}_${i}"class="factory_footer_body_item_directionsList_item ${factory.autosend.list[product].current === i ?'factory_footer_body_item_directionsList_item-current':''}">
                <div class="factory_footer_body_item_directionsList_item-icon icon-findRoute">

                </div>

                <div class="factory_footer_body_item_directionsList_item-text">
                  ${finalObject}
                </div>

                <div id="factoryCard_deleteDirection_${product}_${i}" class="factory_footer_body_item_directionsList_item-icon icon-cancel" id='factoryCard_deleteDirection_${product}_${i}'>

                </div>
              </div>
            `;
            list.insertAdjacentHTML('beforeEnd',thisStr);
          };

          function deleteDirection(){
              factory.autosend.remove({
                product:product,
                index:i,
              });
              updateDirectionLists();
          };
          document.querySelector(`#factoryCard_deleteDirection_${product}_${i}`).onclick = deleteDirection;
          document.querySelector(`#factoryCard_deleteDirection_${product}_${i}`).ontouchstart = deleteDirection;


          function changeCurrent(e){
            if(e.target === document.querySelector(`#factoryCard_direction_${product}_${i}`)){
              factory.autosend.changeCurrent({
                product:product,
                index:i,
              });
              updateDirectionLists();
            };
          };

          document.querySelector(`#factoryCard_direction_${product}_${i}`).onclick = changeCurrent;
          document.querySelector(`#factoryCard_direction_${product}_${i}`).ontouchstart = changeCurrent;

        };
    });
  };
  updateDirectionLists();



  //applyFunctions
  products.forEach((product, i) => {
    const directions = {};
    directions[product] = true;

    function openDirectionList(){
      const list = document.querySelector(`#factoryCard_directionsList_${product}`);
      if(directions[product]){
        list.style.display = 'none';
        directions[product] = false;

      }else{
        list.style.display = 'block';
        directions[product] = true;
      };
    };
    document.querySelector(`#factoryCard_OpenDirectionsListButton_${product}`).onclick = openDirectionList;
    document.querySelector(`#factoryCard_OpenDirectionsListButton_${product}`).ontouchstart = openDirectionList;


    function addBestPriceDirection(){
      factory.autosend.add({
          product:product,
          mode:'price',
      });
      updateDirectionLists();
      if(!directions[product]){
        openDirectionList()
      };
    };


    document.querySelector(`#factoryCard_addDirection_bestPrise_${product}`).onclick = addBestPriceDirection;
    document.querySelector(`#factoryCard_addDirection_bestPrise_${product}`).ontouchstart = addBestPriceDirection;



    function addRouteDirection(){
      const params = {
        product:product,
        callback:function(data){
          factory.autosend.add({
              product:product,
              mode:'route',
              finalObject:data.finalObject,
              final:data.final,
          });
          updateDirectionLists();
          if(!directions[product]){
            openDirectionList()
          };
        },

      };
      MAIN.interface.game.path.showWhereCanSendProduct(params);
    };

    document.querySelector(`#factoryCard_addDirection_findRoute_${product}`).onclick = addRouteDirection;
    document.querySelector(`#factoryCard_addDirection_findRoute_${product}`).ontouchstart = addRouteDirection;
  });

};

//полностью фарматирует меню
function showFactoryMenu(factory) {

  factory.clearNotification();
  const menu = document.querySelector('#factoryMenu');
  menu.innerHTML = '';
  let name = MAIN.game.configs.buildings[factory.type].name;

  let rawStorage = '<div class="factory_body_rawStorage">';
  if (factory.category === 'factory') {
    let line = '';
    for (let product in factory.settings.rawStorage) {
      const thisProduct = factory.settings.rawStorage[product];
      //если на склад загружен
      if (thisProduct) {
        let quality = '';
        for (let i = 0; i < thisProduct.quality; i++) {
          quality += `<span class="product-quality"></span>`;
        };
        line = `<div class="factory_product-gap" id="factory_rawProduct_${product}">
                   <div class="product-icon product-${product}"></div>
                   <div class="product-qualityContainer">
                     ${quality}
                   </div>
                 </div>`

      } else {

        line = `<div class="factory_product-hole factory_product-hole-rawStorage">
                   <div class="product-icon product-${product}"></div>
                </div>`
      };
      rawStorage += line;

    };
  };
  rawStorage += `</div>`;


  let progressBar = `<div class="factory_body_progressBar">`;

  let scaleContainer = `<div class="factory_body_progressBar_scaleContainer">`;
  const stepScale = 82 / (factory.settings.productLine.length - 1);
  const scale = stepScale.toFixed(2);
  for (let i = 0; i < factory.settings.productLine.length; i++) {
    const line = `
        <div class="factory_body_progressBar_scale
             ${i === 0?'factory_body_progressBar_scale-first':''}
             ${i === factory.settings.productLine.length - 1?'factory_body_progressBar_scale-last':''}"

            style="${i===0?'':`width:${scale}%`}">
          <span>${factory.settings.productLine.length - i}</span>
        </div>
      `
    scaleContainer += line;
  };
  scaleContainer += `</div>`;
  progressBar += scaleContainer;


  const productIndex = factory.settings.productLine.indexOf(1);
  let productContainer = `
          <div class="factory_body_progressBar_productContainer"
          style="left:${productIndex?productIndex*stepScale+'%':''}">`;


  if (productIndex != -1) {
    let quality = '';
    for (let i = 0; i < factory.settings.productInProcess.quality; i++) {
      quality += `<span class="product-quality"></span>`;
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
  progressBar += productContainer;

  progressBar += `</div>`;




  let ingredientList = '';
  if (factory.category === 'mining') {
    ingredientList += `
      <div class="factory_body_body-production-left">
      <div class="factory_body_productHugeIcon product-${factory.product}"></div>`;
  };

  if (factory.category === 'factory') {
    ingredientList += `<div class="factory_body_ingredientList">`;
    for (let i = 0; i < factory.settings.products.length; i++) {
      const thisProduct = factory.settings.products[i];
      let ingredients = '';
      for (let j = 0; j < thisProduct.raw.length; j++) {
        const thisIngredient = thisProduct.raw[j];
        ingredients += `
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

      ingredientList += `
            <div class="factory_body_ingredientList-item ${factory.settings.productSelected === thisProduct.name ? 'factory_body_ingredientList-item-selected':''}" id="factory_body_ingredientList_item_${thisProduct.name}">
              ${ingredients}
              ${arrow}
              ${product}
              ${volume}
            </div>
          `;
    };
  };


  ingredientList += '</div>';



  let settingsPart = `<div class="factory_body_body-production-right">`;
  const settings = {};
  if (factory.category === 'mining') {
    settings.ls = factory.settings.salaryPoints;
    settings.q = factory.settings.qualityPoints;
    settings.s = factory.settings.speedPoints;
  };
  if (factory.category === 'factory') {
    settings.ls = factory.settings.salaryPoints;
    settings.v = factory.settings.volumePoints;
    settings.s = factory.settings.speedPoints;
  };

  for (let param in settings) {
    let line = `<div class="factory_body_body-production_settings-list">`;

    line += `<div class="factory_body_body-production_settings-text">
      ${MAIN.interface.lang.factory[param][MAIN.interface.lang.flag]}
      </div>`;
    for (let i = 0; i < 3; i++) {
      if (i < settings[param]) {
        line += `<div class="factory_body_body-production_settings-gap"></div>`;
      };
      if (i >= settings[param]) {
        line += `<div class="factory_body_body-production_settings-hole"></div>`;
      }
    };
    line += `</div>`;
    settingsPart += line;
  };
  settingsPart += '</div>';



  let storagePart = ` <div class="factory_body_storage">`;

  for (let i = 0; i < factory.settings.storage.length; i++) {
    const product = factory.settings.storage[i];
    if (product) {
      let quality = ``;
      for (let i = 0; i < product.quality; i++) {
        quality += `<span class="product-quality"></span>`;
      };
      storagePart += `
        <div class="factory_product-gap" id="factory_storage_${i}">
          <div class="product-icon product-${product.name}"></div>
          <div class="product-qualityContainer">
            ${quality}
          </div>
        </div>`;
    } else {
      storagePart += `<div class="factory_product-hole"></div>`;
    };
  };


  for (let i = 0; i < 5; i++) {
    if (i >= factory.settings.storage.length) {
      storagePart += `<div class="factory_storage-gap"></div>`;
    };
  };


  storagePart += `</div>`;
  const card = `
          <div class="factory_card" id='factoryCard'>
             <div class="factory_header factory_header_bg-${factory.type}">
               <div class="factory_header_header">
                 <span>${name} <span class="factory_header_header-span">| ${factory.number}</span></span>
                 <div class="factory_header_header-buttonsContainer">
                   <div id="factory_settingsButton" class="factory_header_header-button icon-settings">

                   </div>
                   <div id="factory_playButton" class="factory_header_header-button ${factory.settings.paused ? 'icon-play':'icon-pause'}">

                   </div>
                 </div>
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


             <div class="factory_footer" id="factory_footer">
               <div class="factory_footer_header" id="autosend_header">
                 <span>${MAIN.interface.lang.factory.autosend[MAIN.interface.lang.flag]}</span>
               </div>
               <div class="factory_footer_body" id="factory_autosend_body_${factory.id}">
               </div>
             </div>

           </div>

           <div id="factory_card_error">

           </div>
  `;

  menu.innerHTML = '';
  menu.insertAdjacentHTML('beforeEnd', card);

  document.querySelector(`#factory_card_error`).style.display = 'none';

  const autosendFlag = {
    flag: false,
  }

  function showAutosend() {
    if (!autosendFlag.flag) {
      document.querySelector('#factory_footer').style.top = '-79%';
      autosendFlag.flag = true;
    } else {
      document.querySelector('#factory_footer').style.top = '-12.5%';
      autosendFlag.flag = false;
    };
  };
  document.querySelector('#autosend_header').onclick = showAutosend;
  document.querySelector('#autosend_header').ontouchstart = showAutosend;

  updateFactoryAutosendBody(factory);

  factory.settings.storage.forEach((product, i) => {
    if (product) {
      document.querySelector(`#factory_storage_${i}`).onclick = () => {
        factory.sendProduct(i)
      };
      document.querySelector(`#factory_storage_${i}`).ontouchstart = () => {
        factory.sendProduct(i)
      };
    };
  });

  for (let product in factory.settings.rawStorage) {
    if (factory.settings.rawStorage[product]) {
      document.querySelector(`#factory_rawProduct_${product}`).onclick = () => {
        factory.sendRawProduct(product)
      };
      document.querySelector(`#factory_rawProduct_${product}`).ontouchstart = () => {
        factory.sendRawProduct(product)
      };

    };
  };


  if (factory.category === 'factory') {
    for (let i = 0; i < factory.settings.products.length; i++) {

      const thisProduct = factory.settings.products[i];
      document.querySelector(`#factory_body_ingredientList_item_${thisProduct.name}`).onclick = () => {
        factory.setProductSelected(thisProduct.name)
      };
      document.querySelector(`#factory_body_ingredientList_item_${thisProduct.name}`).ontouchstart = () => {
        factory.setProductSelected(thisProduct.name)
      }
    };
  };

  document.querySelector('#factory_playButton').onclick = () => {
    const data = {
      player: MAIN.game.data.playerData.login,
      gameID: MAIN.game.data.commonData.id,
      factory: factory.id,
    };

    if (!MAIN.game.data.playerData.gameOver) {
      MAIN.socket.emit('GAME_factory_stop', data);
    };
  };
  document.querySelector('#factory_playButton').ontouchstart = () => {
    const data = {
      player: MAIN.game.data.playerData.login,
      gameID: MAIN.game.data.commonData.id,
      factory: factory.id,
    };

    if (!MAIN.game.data.playerData.gameOver) {
      MAIN.socket.emit('GAME_factory_stop', data);
    };
  };

  document.querySelector('#factory_settingsButton').onclick = () => {
    showSettingsSetMenu(factory)
  };
  document.querySelector('#factory_settingsButton').ontouchstart = () => {
    showSettingsSetMenu(factory)
  };



};
//это только меняет значения
function updateFactoryMenu() {

  if (FACTORY.nowShowedFactoryMenu) {
    if (FACTORY.nowShowedFactoryMenu.settingsSetted) {
      showFactoryMenu(FACTORY.nowShowedFactoryMenu);
    };
  };
};

function showFactoryError(messageCode) {
  const errors = {
    roadEmpty: {
      ru: 'дорога у фабрики занята',
      eng: 'the road near the factory is occupied',
    },
    noTruck: {
      ru: 'сначала купите грузовик',
      eng: 'buy a truck first',
    },
    noFreeTruck: {
      ru: 'нет свободных грузовиков',
      eng: 'no free trucks',
    },
    turn: {
      ru: 'дождитесь своего хода',
      eng: 'wait for your turn',
    },

  };

  const errorDiv = document.querySelector(`#factory_card_error`);

  errorDiv.style.display = 'flex';
  errorDiv.style.transitionDuration = '0s';
  errorDiv.style.opacity = 1;
  errorDiv.innerHTML = `<div class='factory_card_error_icon'>!</div><div class='factory_card_error_text'>${errors[messageCode][MAIN.interface.lang.flag]}</div>`;

  const rand = Math.random().toString();
  errorDiv.dataset.rand = rand;
  setTimeout(() => {
    errorDiv.style.transitionDuration = '4s';
    errorDiv.style.opacity = 0;
  }, 500);
  setTimeout(() => {
    if (errorDiv) {
      if (errorDiv.dataset.rand === rand) {
        errorDiv.style.display = 'none';
      };
    };
  }, 4000);

};



const FACTORY = {
  init,
  showMenu,
  closeMenu,
  nowShowedFactoryMenu: null,
  updateFactoryMenu,
  showFactoryError,
  updateFactoryAutosendBody,
};
export {
  FACTORY
};
