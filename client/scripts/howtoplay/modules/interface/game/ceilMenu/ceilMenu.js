import {
  MAIN
} from '../../../../main.js';


function generateId(type, x) {
  if (type === undefined) {
    type = 'u'
  }
  if (x === undefined) {
    x = 5;
  }
  let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

  let numbers = '0123456789';
  let lettersMix, numbersMix;
  for (let i = 0; i < 10; i++) {
    lettersMix += letters;
    numbersMix += numbers;
  }

  let mainArr = lettersMix.split('').concat(numbersMix.split(''));
  let shuffledArr = mainArr.sort(function() {
    return Math.random() - 0.5;
  });
  let id = type + '_';
  for (let i = 0; i <= x; i++) {
    id += shuffledArr[i];
  };
  return id;
};



const CEIL_MENU = {
  showSectorMenu(ceil, sector, buttons) {
    
    if(MAIN.tutorial.step === 'building_1'){
      if(ceil === MAIN.gameData.map[2][4] && sector === 3){
        MAIN.tutorial.building_2();
      };
    };
    const section = document.querySelector('#onCeilDoubleClick');
    section.style.display = 'flex';
    const menu = document.querySelector('#sectorMenu');
    document.querySelector('#buildingMenu').style.display = 'none';

    menu.style.display = 'block';

    const radius = menu.clientWidth / 2;

    const changeSectorButton = document.querySelector(`#changeSectorButton`);
    const lang = MAIN.interface.lang.flag;

    function changeSector() {
      let newSector = sector;
      let startedSector = sector;
      for (let i = 0; i < 6; i++) {
        newSector++;
        if (newSector > 5) {
          newSector = 0
        };
        if (ceil.sectors[newSector] === null || newSector === startedSector) {
          break;
        };
      };
      CEIL_MENU.hideSectorMenu();
      if (MAIN.game.scene.temporarySectorMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
        MAIN.game.scene.temporarySectorMesh.geometry.dispose();
        MAIN.game.scene.temporarySectorMesh.material.dispose();
      };
      //для безпошагового режима, если вдруг кто-то что-то построит пока этот игрок будет выбирать
      if (ceil.sectors[newSector] === null) {
        ceil.addChosenSectorTemporaryMesh(newSector);
        ceil.showSectorMenu(newSector);
      };
    };


    MAIN.interface.deleteTouches(changeSectorButton);
    changeSectorButton.onclick = changeSector;
    changeSectorButton.ontouchstart = changeSector;

    const buttonsList = document.querySelector('#sectorMenu_buttonsList');
    const cardsList = document.querySelector('#sectorMenu_cardsList');


    buttonsList.innerHTML = '';
    cardsList.innerHTML = '';


    if (buttons[0] === 'road' || buttons[0] === 'bridge') {
      const roadButton = `
        <div class="sectorMenu_menu-header-button" id="sectorMenu_card_buildButton_${buttons[0]}">
          <div class="sectorMenu_menu-header-button-icon icon-${buttons[0]}">

          </div>
        </div>
      `;
      buttonsList.insertAdjacentHTML('beforeEnd', roadButton);


      const roadButtonElement = document.querySelector(`#sectorMenu_menu_buildButton_${buttons[0]}`);
    };


    let buildingsCards = '';

    buttons.forEach((building, i) => {
      if(building != 'road' && building != 'bridge'){
        const configs = MAIN.game.configs.buildings[building];
        const factoryCount = MAIN.gameData.commonData.factoriesCount[building];

        let products = [];
        if (configs.category === 'mining') {
          products.push(configs.product)
        } else if (configs.category === 'factory') {
          const productArr = configs.product;
          products = [...productArr];
        };

        let productsString = '';
        products.forEach((prod, i) => {
          productsString += `
              <div class="sectorMenu_menu-card-description-product product-${prod}">
              </div>
          `;
        });

        let buildingButtonFn = false;
        let buildingButton = `<div id="sectorMenu_card_buildButton_${building}" class="sectorMenu_menu-card-description-button-nonActive">`;
        if(MAIN.tutorial.step === 'freePlay' ){
          buildingButtonFn = true;
          buildingButton = `<div id="sectorMenu_card_buildButton_${building}" class="sectorMenu_menu-card-description-button${configs.coast > MAIN.gameData.playerData.balance ? '-nonActive': ''}">`;
        };
        if(MAIN.tutorial.step === 'building_2' && building === 'sawmill'){
          buildingButtonFn = true;
          buildingButton = `<div id="sectorMenu_card_buildButton_${building}" class="sectorMenu_menu-card-description-button${configs.coast > MAIN.gameData.playerData.balance ? '-nonActive': ''}">`;
        };
        
        if(MAIN.tutorial.step === 'factory_5' && building === 'paperFactory'){
          buildingButtonFn = true;
          buildingButton = `<div id="sectorMenu_card_buildButton_${building}" class="sectorMenu_menu-card-description-button${configs.coast > MAIN.gameData.playerData.balance ? '-nonActive': ''}">`;
        };



        const card = `
          <div class="sectorMenu_menu-card" style="${!buildingButtonFn ? 'opacity:0.5' :'' }">
            <div class="sectorMenu_menu-card-header">
              <span>${configs.title.eng} <span  class="sectorMenu_menu-card-header-span-bold">| ${factoryCount}</span></span>
            </div>
            <div class="sectorMenu_menu-card-image image-${building}_a">

            </div>
            <div class="sectorMenu_menu-card-description">
              <div class="sectorMenu_menu-card-description-gradient">

              </div>
              <div class="sectorMenu_menu-card-description-productsList">
                ${productsString}

              </div>

              <div class="sectorMenu_menu-card-description-title">
                ${configs.title[MAIN.interface.lang.flag]}
              </div>

              ${buildingButton}
                <span>$ ${configs.coast}</span>
              </div>
            </div>
          </div>
        `;



        buildingsCards += card;
      };
    });


    cardsList.insertAdjacentHTML('beforeEnd', buildingsCards);

    buttons.forEach((building, i) => {

      const coast = MAIN.game.configs.buildings[building].coast;
      if(coast <= MAIN.gameData.playerData.balance){
        const buttonElement = document.querySelector(`#sectorMenu_card_buildButton_${building}`);

        if(MAIN.tutorial.step === 'freePlay' ){
          buttonElement.onclick = () => {
            action(building);
          };
          buttonElement.ontouchstart = () => {
            action(building);
          };
        };
        if(MAIN.tutorial.step === 'building_2' && building === 'sawmill'){
          buttonElement.onclick = () => {
            action(building);
          };
          buttonElement.ontouchstart = () => {
            action(building);
          };
        };

        if(MAIN.tutorial.step === 'factory_5' && building === 'paperFactory'){
          buttonElement.onclick = () => {
            action(building);
          };
          buttonElement.ontouchstart = () => {
            action(building);
          };
        };
        
        if(building === 'road' || building === 'bridge'){
          buttonElement.onclick = () => {
            action(building);
          };
          buttonElement.ontouchstart = () => {
            action(building);
          };
        };

      };
    });





    function action(buttonName) {
      if (buttonName === 'cancel') {
        MAIN.interface.game.ceilMenu.hideSectorMenu();
        if (MAIN.game.scene.temporaryHexMesh) {
          MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
          MAIN.game.scene.temporaryHexMesh.geometry.dispose();
          MAIN.game.scene.temporaryHexMesh.material.dispose();
        };
        if (MAIN.game.scene.temporarySectorMesh) {
          MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
          MAIN.game.scene.temporarySectorMesh.geometry.dispose();
          MAIN.game.scene.temporarySectorMesh.material.dispose();
        };
      } else {
        if (MAIN.gameData.commonData.turnBasedGame) {
          if (MAIN.gameData.commonData.queue != MAIN.gameData.playerData.login || MAIN.gameData.commonData.turnsPaused) {

            // исследование карты
            CEIL_MENU.hideSectorMenu();
            if (MAIN.game.scene.temporaryHexMesh) {
              MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
              MAIN.game.scene.temporaryHexMesh.geometry.dispose();
              MAIN.game.scene.temporaryHexMesh.material.dispose();
            };
            if (MAIN.game.scene.temporarySectorMesh) {
              MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
              MAIN.game.scene.temporarySectorMesh.geometry.dispose();
              MAIN.game.scene.temporarySectorMesh.material.dispose();
            };
          } else {
            CEIL_MENU.showBuildingMenu(ceil, sector, buttonName);
          };
        } else {
          CEIL_MENU.showBuildingMenu(ceil, sector, buttonName);
        };
      };
    };

  },
  hideSectorMenu() {
    const section = document.querySelector('#onCeilDoubleClick');
    section.style.display = 'none';
    const menu = document.querySelector('#sectorMenu');
    // menu.innerHTML = '';
    const buildingMenu = document.querySelector('#buildingMenu');
    // buildingMenu.innerHTML = '';
    buildingMenu.style.display = 'none';
  },

  hideBuildMenu() {
    const sectorMenu = document.querySelector('#sectorMenu');
    sectorMenu.style.display = 'flex';
    const buildingMenu = document.querySelector('#buildingMenu');
    buildingMenu.style.display = 'none';
  },
  showBuildingMenu(ceil, sector, building) {
    
    const sectorMenu = document.querySelector('#sectorMenu');
    sectorMenu.style.display = 'none';
    const menu = document.querySelector('#buildingMenu');
    menu.innerHTML = '';
    menu.style.display = 'flex';

    const configs = MAIN.game.configs.buildings[building];

    let productDiv = '';
    if(configs.category === 'mining'){
      productDiv = `
        <div class="sectorMenu_build_card-productsList-item" style="transform:scale(1.5)">
            <div class="factory_body_ingredientList-icon product-${configs.product}"></div>
        </div>
      `
    }else if (configs.category === 'factory') {
      configs.product.forEach((product, i) => {
        const productConfigs = MAIN.game.configs.products[product];
        let raws = '';
        productConfigs.raws.forEach((raw, i) => {
          raws+=`<div class="factory_body_ingredientList-icon product-${raw}"></div>`;
        });

        productDiv+=`
            <div class="sectorMenu_build_card-productsList-item">
                ${raws}
                <div class="factory_body_ingredientList-arrow" style="flex-direction: row;">
                  <div class="factory_body_ingredientList-arrow-symbol">
                    →
                  </div>
                </div>
                <div class="factory_body_ingredientList-icon product-${product}"></div>
            </div>
        `;
      });
    };

    let div = `
        <div class="sectorMenu_build_card">
          <div class="sectorMenu_build_card-title">
            ${configs.title[MAIN.interface.lang.flag]}
          </div>
          <div class="sectorMenu_build_card-price">
            $${configs.coast}
          </div>

          <div class="sectorMenu_build_card-image image-${building}_a ">

          </div>

          <div class="sectorMenu_build_card-productsList">
            ${productDiv}
          </div>



        </div>

        <div class="sectorMenu_build_button" id="aceptBuild">
          ${MAIN.interface.lang.buildingMenu.build[MAIN.interface.lang.flag]}

        </div>

        <div class="sectorMenu_build_button" id="cancelBuild">
          ${MAIN.interface.lang.buildingMenu.cancel[MAIN.interface.lang.flag]}


        </div>
    `;

    menu.insertAdjacentHTML('beforeEnd', div);

    const cancelButton = document.querySelector('#cancelBuild');
    cancelButton.onclick = () => {
      CEIL_MENU.hideBuildMenu();
    };
    cancelButton.ontouchstart = () => {
      CEIL_MENU.hideBuildMenu();
    };

    const buildButton = document.querySelector('#aceptBuild');
    buildButton.onclick = () => {
      CEIL_MENU.hideSectorMenu();
      if (MAIN.game.scene.temporaryHexMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
        MAIN.game.scene.temporaryHexMesh.geometry.dispose();
        MAIN.game.scene.temporaryHexMesh.material.dispose();
      };
      if (MAIN.game.scene.temporarySectorMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
        MAIN.game.scene.temporarySectorMesh.geometry.dispose();
        MAIN.game.scene.temporarySectorMesh.material.dispose();
      };
      if (MAIN.gameData.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
        CEIL_MENU.sendBuildRequest(ceil, sector, building);
      } else {
        MAIN.interface.game.balance.notEnoughMoney();
      };
    };
    buildButton.ontouchstart = () => {
      CEIL_MENU.hideSectorMenu();
      if (MAIN.game.scene.temporaryHexMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
        MAIN.game.scene.temporaryHexMesh.geometry.dispose();
        MAIN.game.scene.temporaryHexMesh.material.dispose();
      };
      if (MAIN.game.scene.temporarySectorMesh) {
        MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
        MAIN.game.scene.temporarySectorMesh.geometry.dispose();
        MAIN.game.scene.temporarySectorMesh.material.dispose();
      };

      if (MAIN.gameData.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
        CEIL_MENU.sendBuildRequest(ceil, sector, building);
      } else {
        MAIN.interface.game.balance.notEnoughMoney();
      };
    };

  },
  sendBuildRequest(ceil, sector, building) {
    const data = {
      build:{
        building:building,
        indexes:ceil.indexes,
        sector:sector,
        ceilIndex:ceil.indexes,
      },
    };

    const chosenCeil = MAIN.gameData.map[data.build.ceilIndex.z][data.build.ceilIndex.x];
    if (chosenCeil.sectors[data.build.sector] === null) {
      if(MAIN.gameData.playerData.balance >= MAIN.game.configs.buildings[building].coast){
        ;
        MAIN.interface.game.balance.change(MAIN.gameData.playerData.balance - MAIN.game.configs.buildings[building].coast);
        MAIN.interface.game.balance.addBalanceMessage(`Сonstruction of the ${building}`, -MAIN.game.configs.buildings[building].coast);
        MAIN.game.functions.payToCities(MAIN.game.configs.buildings[building].coast);
        MAIN.game.functions.applyBuilding(data);
        if(MAIN.gameData.commonData.factoriesCount[data.build.building]){
          MAIN.gameData.commonData.factoriesCount[data.build.building] -= 1;
        };
        
        if(data.build.building != 'road' && data.build.building !="bridge"){
          MAIN.game.functions.buildFactory(data);
        };
  
        if(MAIN.tutorial.step === 'building_2'){
          if(data.build.building === 'sawmill'){
            MAIN.tutorial.building_3();
          };
        };
        if(MAIN.tutorial.step === 'road_1'){
          if(data.build.building === 'road'){
            MAIN.tutorial.road_2();
          };
        };
        if(MAIN.tutorial.step === 'factory_5'){
          if(data.build.building === 'paperFactory'){
            MAIN.tutorial.factory_6();
          };
        };
      };

    };
  },
};

export {
  CEIL_MENU
};
