import {
  MAIN
} from '../../../../main.js';





function init(){
  const section = `
  <section id="cityMenuSection">
    <div class="card" id="cityCard">

    </div>

    <div id="cityPriceSection">
      <div class="cityPriceNotification" id="Westown_priceNotification"></div>
      <div class="cityPriceNotification" id="Northfield_priceNotification"></div>
      <div class="cityPriceNotification" id="Southcity_priceNotification"></div>
    </div>

  </section>
  `

  document.querySelector('#gameInterface').insertAdjacentHTML('beforeEnd', section);


  const clicker = document.querySelector('#cityMenuSection');
  MAIN.interface.deleteTouches(clicker);
  // MAIN.interface.returnTouches(document.querySelector('#trucksMenuList'));
  clicker.style.pointerEvents = 'none';
  clicker.onclick = closeMenu;
  clicker.ontouchstart = closeMenu;
};


function openMenu(city){
  CITY.cardOpened = city;
  const clicker = document.querySelector('#cityMenuSection');

  clicker.style.pointerEvents = 'auto';
  document.querySelector('#cityCard').style.display = 'block';
  document.querySelector('#cityCard').innerHTML = '';




  const cities = [
    'Westown',
    'Northfield',
    'Southcity',
  ];

  let resourceList = '';
  for(let resource in city.storage){
    const thisRes = city.storage[resource];


    let holes = '';

    thisRes.line.forEach((item, i) => {
      if(item === 0){
        const price = thisRes.prices[i];
        const str = `
          <div class="resource-hole">
            <div class="cityCard-resource-info-holes-price">$${price}</div>
          </div>
        `
        holes+=str;
      }else{
        const str = `
          <div class="resource-gag resource-bg-color-${resource}" style="margin:">
            <div class="resource-gag-title">${resource}</div>
          </div>
        `
        holes+=str;
      };
    });



    const resListItem = `
      <div class="cityCard-list-item">
        <div class="resource-bg-color-${resource} cityCard-resource-image">
          <div class="cityCard-resource-image-name">
            ${resource}
          </div>
        </div>
        <div class="cityCard-resource-info">
          <div class="cityCard-resource-info-price ">$${city.getCurrentResourcePrice(resource)}</div>
          <div class="cityCard-resource-info-holes">
            ${holes}
          </div>
        </div>
      </div>
    `

    resourceList += resListItem;
  };

  const card = `

    <div class="card-header">
      city <span class="card-header-span"> | ${city.name} </span>
    </div>
    <div class="cityCard-title">
      ${city.name}
    </div>


    <div class="cityCard-list" id="cityCard_list">
      ${resourceList}
    </div>

  `



  document.querySelector('#cityCard').insertAdjacentHTML('beforeEnd', card);
  MAIN.interface.returnTouches(document.querySelector('#cityCard_list'))



};




function closeMenu(event){
  CITY.cardOpened  = false;
  const clicker =  document.querySelector('#cityMenuSection');
  if(event === undefined ||event.target ===  clicker){
    document.querySelector('#cityCard').style.display = 'none';
    clicker.style.pointerEvents = 'none';
  };
};


function showCityPrices(resoure){
  CITY.priceShow = resoure;
  document.querySelector('#cityPriceSection').style.display = 'block';
  for(let city in MAIN.game.data.cities){
    const thisCity = MAIN.game.data.cities[city];
    thisCity.showPrice(resoure);
  };
};


function updatePricePosition(){
  for(let city in MAIN.game.data.cities){
    const thisCity = MAIN.game.data.cities[city];
    thisCity.updatePricePosition();
  };
};

function hideCityPrices(){
  document.querySelector('#cityPriceSection').style.display = 'none';
  CITY.priceShow = false;
};


const CITY = {
  init,
  closeMenu,
  openMenu,
  cardOpened:false,
  priceShow:false,
  showCityPrices,
  updatePricePosition,
  hideCityPrices,
};

export {CITY};
