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
    const section = document.querySelector('#onCeilDoubleClick');
    section.style.display = 'flex';
    const menu = document.querySelector('#sectorMenu');
    document.querySelector('#buildingMenu').style.display = 'none';

    menu.style.display = 'block';

    // buttons.push('cancel');
    const radius = menu.clientWidth / 2;

    // let changeSectorButton = `<div id='changeSectorButton' class='changeSectorMenuButton' style="top:${radius/1.3}px;left:${radius/1.3}px;">
    //     <img class='sectorMenuButton_image' src="./scripts/modules/interface/game/ceilMenu/icons/changeSectorButton.png">
    //   </div>`;
    // menu.insertAdjacentHTML('beforeEnd', changeSectorButton);
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
        const factoryCount = MAIN.game.data.commonData.factoriesCount[building];

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


        const card = `
          <div class="sectorMenu_menu-card">
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

              <div id="sectorMenu_card_buildButton_${building}" class="sectorMenu_menu-card-description-button${configs.coast > MAIN.game.data.playerData.balance ? '-nonActive': ''}">
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
      if(coast <= MAIN.game.data.playerData.balance){
        const buttonElement = document.querySelector(`#sectorMenu_card_buildButton_${building}`);
        buttonElement.onclick = () => {
          action(building);
        };
        buttonElement.ontouchstart = () => {
          action(building);
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
        if (MAIN.game.data.commonData.turnBasedGame) {
          if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login || MAIN.game.data.commonData.turnsPaused) {

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


    // document.querySelector('#sectorMenu_List').innerHTML = '';
    // console.log(buttons)
    // buttons.forEach((buttonName, i) => {
    //
    //
    //   const position = {
    //     x: radius * Math.sin((((360 / (buttons.length)) * i) - 90) * Math.PI / 180) + radius / 1.25,
    //     y: radius * Math.cos((((360 / (buttons.length)) * i) - 90) * Math.PI / 180) + radius / 1.25,
    //   };
    //   const id = generateId('button', 4);
    //   const button = `
    //     <div class="sectorMenu_button" id='${id}' style="background-color:${MAIN.game.configs.buildings[buttonName].buttonColor}">
    //       <div class="sectorMenu_button_title">
    //         ${MAIN.game.configs.buildings[buttonName].title[lang]}
    //       </div>
    //       <div class="sectorMenu_button_price">
    //         $${MAIN.game.configs.buildings[buttonName].coast}
    //       </div>
    //     </div>`;
    //
    //
    //
    //
    //
    //
    //
    //     // `<div id='${id}' class='sectorMenuButton' style="top:${position.x}px;left:${position.y}px;">
    //     //   <img class='sectorMenuButton_image' src="./scripts/modules/interface/game/ceilMenu/icons/${buttonName}.png">
    //     // </div>`;
    //
    //   document.querySelector('#sectorMenu_List').insertAdjacentHTML('beforeEnd', button);
    //
    //   function action() {
    //     if (buttonName === 'cancel') {
    //       MAIN.interface.game.ceilMenu.hideSectorMenu();
    //       if (MAIN.game.scene.temporaryHexMesh) {
    //         MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
    //         MAIN.game.scene.temporaryHexMesh.geometry.dispose();
    //         MAIN.game.scene.temporaryHexMesh.material.dispose();
    //       };
    //       if (MAIN.game.scene.temporarySectorMesh) {
    //         MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
    //         MAIN.game.scene.temporarySectorMesh.geometry.dispose();
    //         MAIN.game.scene.temporarySectorMesh.material.dispose();
    //       };
    //     } else {
    //       if (MAIN.game.data.commonData.turnBasedGame) {
    //         if (MAIN.game.data.commonData.queue != MAIN.game.data.playerData.login || MAIN.game.data.commonData.turnsPaused) {
    //
    //           // исследование карты
    //           CEIL_MENU.hideSectorMenu();
    //           if (MAIN.game.scene.temporaryHexMesh) {
    //             MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
    //             MAIN.game.scene.temporaryHexMesh.geometry.dispose();
    //             MAIN.game.scene.temporaryHexMesh.material.dispose();
    //           };
    //           if (MAIN.game.scene.temporarySectorMesh) {
    //             MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
    //             MAIN.game.scene.temporarySectorMesh.geometry.dispose();
    //             MAIN.game.scene.temporarySectorMesh.material.dispose();
    //           };
    //         }else{
    //           CEIL_MENU.showBuildingMenu(ceil, sector, buttonName);
    //         };
    //       }else{
    //         CEIL_MENU.showBuildingMenu(ceil, sector, buttonName);
    //       };
    //
    //     };
    //   };
    //   document.querySelector(`#${id}`).onclick = null;
    //   document.querySelector(`#${id}`).addEventListener('click', () => {
    //     action();
    //   });
    //   document.querySelector(`#${id}`).ontouchstart = null;
    //   document.querySelector(`#${id}`).addEventListener('touchstart', () => {
    //     action();
    //   });
    //
    // });

    // console.log(ceil,sector,buttons);

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
        console.log(productConfigs)
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
      if (MAIN.game.data.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
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

      if (MAIN.game.data.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
        CEIL_MENU.sendBuildRequest(ceil, sector, building);
      } else {
        MAIN.interface.game.balance.notEnoughMoney();
      };
    };


    // const sectorMenu = document.querySelector('#sectorMenu');
    // sectorMenu.style.display = 'none';
    // const menu = document.querySelector('#buildingMenu');
    // menu.innerHTML = '';
    // menu.style.display = 'flex';
    // const lang = MAIN.interface.lang.flag;
    // const div = `
    //
    //       <div class="buildingMenu_card" style="background-color:${MAIN.game.configs.buildings[building].buttonColor}">
    //           <div class="buildingMenu_card_title" id="buildName">
    //             ${MAIN.game.configs.buildings[building].title[lang]}
    //           </div>
    //           <div class="buildingMenu_card_price" id="buildCoast">
    //             $${MAIN.game.configs.buildings[building].coast}
    //           </div>
    //         </div>
    //         <div class="buildingMenu_button" id="cancelBuild">
    //           <span class="buildingMenu_button-span">назад</span>
    //         </div>
    //
    //         <div class="buildingMenu_button" id='aceptBuild'>
    //           <span class="buildingMenu_button-span">построить</span>
    //         </div>`;
    //
    // menu.insertAdjacentHTML('beforeEnd', div);
    //
    //
    // // const buildName = document.querySelector('#buildName');
    // // buildName.innerHTML = MAIN.game.configs.buildings[building].name;
    // //
    // // const buildCoast = document.querySelector('#buildCoast');
    // // buildCoast.innerHTML = '$' + MAIN.game.configs.buildings[building].coast;
    // //
    // // const buildDescription = document.querySelector('#buildDescription');
    // // buildDescription.innerHTML = MAIN.game.configs.buildings[building].description;
    //
    // const cancelButton = document.querySelector('#cancelBuild');
    // cancelButton.onclick = () => {
    //   CEIL_MENU.hideBuildMenu();
    // };
    // cancelButton.ontouchstart = () => {
    //   CEIL_MENU.hideBuildMenu();
    // };
    //
    // const buildButton = document.querySelector('#aceptBuild');
    // buildButton.onclick = () => {
    //   CEIL_MENU.hideSectorMenu();
    //   if (MAIN.game.scene.temporaryHexMesh) {
    //     MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
    //     MAIN.game.scene.temporaryHexMesh.geometry.dispose();
    //     MAIN.game.scene.temporaryHexMesh.material.dispose();
    //   };
    //   if (MAIN.game.scene.temporarySectorMesh) {
    //     MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
    //     MAIN.game.scene.temporarySectorMesh.geometry.dispose();
    //     MAIN.game.scene.temporarySectorMesh.material.dispose();
    //   };
    //   if (MAIN.game.data.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
    //     CEIL_MENU.sendBuildRequest(ceil, sector, building);
    //   } else {
    //     MAIN.interface.game.balance.notEnoughMoney();
    //   };
    // };
    // buildButton.ontouchstart = () => {
    //   CEIL_MENU.hideSectorMenu();
    //   if (MAIN.game.scene.temporaryHexMesh) {
    //     MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
    //     MAIN.game.scene.temporaryHexMesh.geometry.dispose();
    //     MAIN.game.scene.temporaryHexMesh.material.dispose();
    //   };
    //   if (MAIN.game.scene.temporarySectorMesh) {
    //     MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
    //     MAIN.game.scene.temporarySectorMesh.geometry.dispose();
    //     MAIN.game.scene.temporarySectorMesh.material.dispose();
    //   };
    //
    //   if (MAIN.game.data.playerData.balance >= MAIN.game.configs.buildings[building].coast) {
    //     CEIL_MENU.sendBuildRequest(ceil, sector, building);
    //   } else {
    //     MAIN.interface.game.balance.notEnoughMoney();
    //   };
    //
    // };


  },
  sendBuildRequest(ceil, sector, building) {
    const data = {
      player: MAIN.userData.login,
      gameID: MAIN.game.data.commonData.id,
      build: {
        ceilIndex: ceil.indexes,
        sector: sector,
        building: building,
      },
    };
    //чтобы не строил на уже построеном при игре безпошаговом режиме
    const chosenCeil = MAIN.game.data.map[data.build.ceilIndex.z][data.build.ceilIndex.x];
    if (chosenCeil.sectors[data.build.sector] === null) {
      if (MAIN.game.data.commonData.turnBasedGame) {
        if (MAIN.game.data.commonData.queue === MAIN.game.data.playerData.login) {
          if (!MAIN.game.data.playerData.gameOver) {
            MAIN.socket.emit('GAME_building', data);
          };
        };
      } else {
        if (!MAIN.game.data.playerData.gameOver) {
          MAIN.socket.emit('GAME_building', data);
        };
      };
    };
  },
};

export {
  CEIL_MENU
};
