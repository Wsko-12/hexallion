import {
  MAIN
} from '../../../../main.js';





const CEIL_MENU = {
  showSectorMenu(ceil,sector,buttons){
    console.log(ceil,sector,buttons);
    const menu = document.querySelector('#sectorMenu');
    menu.style.display = 'block';


    const radius = menu.clientWidth/2;


    buttons.forEach((buttonName, i) => {


      const position = {
        x:radius*Math.sin((((360/(buttons.length))*i)-90) * Math.PI/180) + radius/1.25,
        y:radius*Math.cos((((360/(buttons.length))*i)-90) * Math.PI/180) + radius/1.25,
      };


      const button = `<div class='sectorMenuButton' style="top:${position.x}px;left:${position.y}px;"></div>`;
      menu.insertAdjacentHTML('beforeEnd',button);
    });






  },
  hideSectorMenu(){
      const menu = document.querySelector('#sectorMenu');
      menu.innerHTML = '';
      menu.style.display = 'none';
  },
};

export {
  CEIL_MENU
};
