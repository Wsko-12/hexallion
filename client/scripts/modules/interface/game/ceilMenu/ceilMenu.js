import {
  MAIN
} from '../../../../main.js';


function  generateId(type,x){
    if(type === undefined){
      type = 'u'
    }
    if(x === undefined){
      x = 5;
    }
    let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

    let numbers = '0123456789';
    let lettersMix,numbersMix;
    for(let i=0; i<10;i++){
      lettersMix += letters;
      numbersMix += numbers;
    }

    let mainArr = lettersMix.split('').concat(numbersMix.split(''));
    let shuffledArr = mainArr.sort(function(){
                        return Math.random() - 0.5;
                    });
    let id = type +'_';
    for(let i=0; i<=x;i++){
        id += shuffledArr[i];
    };
    return id;
};



const CEIL_MENU = {
  showSectorMenu(ceil,sector,buttons){
      const section = document.querySelector('#onCeilDoubleClick');
      section.style.display = 'block';
      const menu = document.querySelector('#sectorMenu');
      menu.style.display = 'block';

      buttons.push('cancel');
      const radius = menu.clientWidth/2;

      let changeSectorButton = `<div id='changeSectorButton' class='changeSectorMenuButton' style="top:${radius/1.3}px;left:${radius/1.3}px;">
        <img class='sectorMenuButton_image' src="./scripts/modules/interface/game/ceilMenu/icons/changeSectorButton.png">
      </div>`;
      menu.insertAdjacentHTML('beforeEnd',changeSectorButton);
      changeSectorButton = document.querySelector(`#changeSectorButton`);
       function changeSector(){
        let newSector = sector;
        let startedSector = sector;
        for(let i = 0; i < 6;i++){
          newSector++;
          if(newSector > 5){
            newSector = 0
          };
          if(ceil.sectors[newSector] === null || newSector === startedSector){
            break;
          };
        };
        CEIL_MENU.hideSectorMenu();
          if(MAIN.game.scene.temporarySectorMesh){
            MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
            MAIN.game.scene.temporarySectorMesh.geometry.dispose();
            MAIN.game.scene.temporarySectorMesh.material.dispose();
          };
        //для безпошагового режима, если вдруг кто-то что-то построит пока этот игрок будет выбирать
        if(ceil.sectors[newSector] === null){
          ceil.addChosenSectorTemporaryMesh(newSector);
          ceil.showSectorMenu(newSector);
        };
      };
      changeSectorButton.onclick = changeSector;
      changeSectorButton.ontouchstart = changeSector;

      buttons.forEach((buttonName, i) => {


        const position = {
          x:radius*Math.sin((((360/(buttons.length))*i)-90) * Math.PI/180) + radius/1.25,
          y:radius*Math.cos((((360/(buttons.length))*i)-90) * Math.PI/180) + radius/1.25,
        };
        const id = generateId('button',4)
        const button = `<div id='${id}' class='sectorMenuButton' style="top:${position.x}px;left:${position.y}px;">
          <img class='sectorMenuButton_image' src="./scripts/modules/interface/game/ceilMenu/icons/${buttonName}.png">
        </div>`;


        menu.insertAdjacentHTML('beforeEnd',button);

        function action(){
          if(buttonName === 'cancel'){
            MAIN.interface.game.ceilMenu.hideSectorMenu();
            if(MAIN.game.scene.temporaryHexMesh){
              MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
              MAIN.game.scene.temporaryHexMesh.geometry.dispose();
              MAIN.game.scene.temporaryHexMesh.material.dispose();
            };
            if(MAIN.game.scene.temporarySectorMesh){
              MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
              MAIN.game.scene.temporarySectorMesh.geometry.dispose();
              MAIN.game.scene.temporarySectorMesh.material.dispose();
            };
          }else{
            CEIL_MENU.showBuildingMenu(ceil,sector,buttonName);
          };
        };
        document.querySelector(`#${id}`).onclick= null;
        document.querySelector(`#${id}`).addEventListener('click',() =>{
          action();
        });
        document.querySelector(`#${id}`).ontouchstart = null;
        document.querySelector(`#${id}`).addEventListener('touchstart',() =>{
          action();
        });

      });

    // console.log(ceil,sector,buttons);

  },
  hideSectorMenu(){
      const section = document.querySelector('#onCeilDoubleClick');
      section.style.display = 'none';
      const menu = document.querySelector('#sectorMenu');
      menu.innerHTML = '';
      const buildingMenu = document.querySelector('#buildingMenu');
      // buildingMenu.innerHTML = '';
      buildingMenu.style.display = 'none';
  },

  hideBuildMenu(){
    const sectorMenu = document.querySelector('#sectorMenu');
    sectorMenu.style.display = 'block';
    const buildingMenu = document.querySelector('#buildingMenu');
    buildingMenu.style.display = 'none';
  },
  showBuildingMenu(ceil,sector,building){
    const menu = document.querySelector('#buildingMenu');
    // menu.innerHTML = '';
    menu.style.display = 'block';

    const sectorMenu = document.querySelector('#sectorMenu');
    sectorMenu.style.display = 'none';


    const buildName = document.querySelector('#buildName');
    buildName.innerHTML = MAIN.game.configs.buildings[building].name;

    const buildCoast = document.querySelector('#buildCoast');
    buildCoast.innerHTML = '$' +MAIN.game.configs.buildings[building].coast;

    const buildDescription = document.querySelector('#buildDescription');
    buildDescription.innerHTML = MAIN.game.configs.buildings[building].description;

    const cancelButton = document.querySelector('#cancelBuild');
    cancelButton.onclick = () =>{
      CEIL_MENU.hideBuildMenu();
    };
    cancelButton.ontouchstart = () =>{
        CEIL_MENU.hideBuildMenu();
    };

    const buildButton = document.querySelector('#aceptBuild');
    buildButton.onclick = () =>{
      CEIL_MENU.hideSectorMenu();
        if(MAIN.game.scene.temporaryHexMesh){
          MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
          MAIN.game.scene.temporaryHexMesh.geometry.dispose();
          MAIN.game.scene.temporaryHexMesh.material.dispose();
        };
        if(MAIN.game.scene.temporarySectorMesh){
          MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
          MAIN.game.scene.temporarySectorMesh.geometry.dispose();
          MAIN.game.scene.temporarySectorMesh.material.dispose();
        };
      CEIL_MENU.sendBuildRequest(ceil,sector,building);
    };
    buildButton.ontouchstart = () =>{
      CEIL_MENU.hideSectorMenu();
        if(MAIN.game.scene.temporaryHexMesh){
          MAIN.renderer.scene.remove(MAIN.game.scene.temporaryHexMesh);
          MAIN.game.scene.temporaryHexMesh.geometry.dispose();
          MAIN.game.scene.temporaryHexMesh.material.dispose();
        };
        if(MAIN.game.scene.temporarySectorMesh){
          MAIN.renderer.scene.remove(MAIN.game.scene.temporarySectorMesh);
          MAIN.game.scene.temporarySectorMesh.geometry.dispose();
          MAIN.game.scene.temporarySectorMesh.material.dispose();
        };




      if(MAIN.game.playerData.balance >= MAIN.game.configs.buildings[building].coast){
        CEIL_MENU.sendBuildRequest(ceil,sector,building);
      }else{
        MAIN.interface.game.balance.notEnoughMoney();
      };

    };


  },
  sendBuildRequest(ceil,sector,building){
    const data = {
      player:MAIN.userData.login,
      gameID:MAIN.game.commonData.id,
      build:{
        ceilIndex:ceil.indexes,
        sector:sector,
        building:building,
      },
    };
    //чтобы не строил на уже построеном при игре безпошаговом режиме
    const chosenCeil = MAIN.game.data.map[data.build.ceilIndex.z][data.build.ceilIndex.x];
    if(chosenCeil.sectors[data.build.sector] === null){
      MAIN.socket.emit('GAME_building',data);
    };

  },
};

export {
  CEIL_MENU
};
