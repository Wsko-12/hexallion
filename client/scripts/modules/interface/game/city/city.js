import {
  MAIN
} from '../../../../main.js';





function init(){
  const section = `
  <section id="cityMenuSection">
    <div class="cityCard" id="cityCard">

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
  clicker.style.pointerEvents = 'none';
  clicker.onclick = closeMenu;
  clicker.ontouchstart = closeMenu;
};

function updateProductsList(city,category){
  const productsList = document.querySelector('#cityCard_productsList');
  productsList.innerHTML = '';

  let allList = '';
  for(let product in city.storage){
    const thisProduct = city.storage[product];
    if(MAIN.game.configs.products[product].category === category){
      let divisions = '';
      for(let i = 0; i<20;i++){
        divisions+= `<div class="cityCard_body_list-item-progressBar-division">${100 - i*5}%</div>`
      };

      let productGap = '';
      let progressBarColor = ``;

      if(thisProduct.fullness > 0){
        productGap = `
          <div  class="cityCard_body_list-item-progressBar-product" style="top:${(100-thisProduct.fullness)/5 * 8}px">
            <div class="cityCard_body_list-item-progressBar-product-icon product-${product}">
            </div>
          </div>
        `;
        progressBarColor = `
          <div class="cityCard_body_list-item-progressBar-color" top="-28px">
            <div class="cityCard_body_list-item-progressBar-color-red" style='height:${100-thisProduct.fullness}%'></div>
            <div class="cityCard_body_list-item-progressBar-color-green" style='height:${thisProduct.fullness}%'></div>
          </div>
        `;
      };

      allList+=`
        <div class="cityCard_body_list-item">
          <div class="cityCard_body_list-item-price">
            $${city.getCurrentProductPrice(product)}
          </div>
          <div class="cityCard_body_list-item-progressBar">

            <div class="cityCard_body_list-item-progressBar-start">
              <div class="cityCard_body_list-item-progressBar-start-icon product-${product}">
              </div>
            </div>

            ${divisions}

            ${progressBarColor}
            ${productGap}


          </div>

          <div class="cityCard_body_list-item-speed">
            ${thisProduct.speed}%/step
          </div>
        </div>
      `;
    };
  };

  productsList.insertAdjacentHTML('beforeEnd',allList);

};
function openMenu(city){

  //нужно для апдейта
  if(!city){
    if(!CITY.cardOpened){
      return;
    }else{
      city = CITY.cardOpened;
    };
  };

  if(!CITY.cardOpened){
    CITY.cardOpened = city;
    CITY.categoryOpened = 'raw';
  };


  const clicker = document.querySelector('#cityMenuSection');
  clicker.style.pointerEvents = 'auto';
  document.querySelector('#cityCard').style.display = 'block';

  const categories = MAIN.game.configs.products.categories;

  let categoriesList = '';
  categories.forEach((category, i) => {
    const item = `
      <div id="cityCard_menu_${category}" class="cityCard_body-menu-item ${category === CITY.categoryOpened? 'cityCard_body-menu-item-selected' :''}">
        <div class="cityCard_body-menu-item-icon icon-shop-${category}"></div>
      </div>
    `;
    categoriesList+=item;
  });








  document.querySelector('#cityCard').innerHTML = `
    <div class="cityCard_header">
      <div class="cityCard_header_bg">
        <div class="cityCard_header-header">
          <span>city <span class="cityCard_header-header-span">| ${city.name}</span></span>
        </div>
        <div class="cityCard_header-title">
          ${city.name}
        </div>
        <div class="cityCard_header-balance">
          ${city.balance ? '$'+city.balance:''}
        </div>
      </div>
    </div>

    <div class="cityCard_body">
      <div class="cityCard_body-menu">
        ${categoriesList}
      </div>


      <div class="cityCard_body-body">
        <div class="cityCard_body_list" id="cityCard_productsList">
        </div>
      </div>
    </div>
  `;
  const cityCard = ``;

  document.querySelector('#cityCard').insertAdjacentHTML('beforeEnd',cityCard)
  MAIN.interface.returnTouches(document.querySelector('#cityCard_productsList'));

  updateProductsList(city,CITY.categoryOpened);



  //вешаем функции
  categories.forEach((category, i) => {
    const menuButton = document.querySelector(`#cityCard_menu_${category}`);

    function changeCategory(){

      document.querySelector(`#cityCard_menu_${CITY.categoryOpened}`).classList.remove('cityCard_body-menu-item-selected');
      document.querySelector(`#cityCard_menu_${category}`).classList.add('cityCard_body-menu-item-selected');

      CITY.categoryOpened = category;
      updateProductsList(city,category);

    };

    menuButton.onclick = changeCategory;
    menuButton.ontouchstart = changeCategory;
  });




  // CITY.cardOpened = city;
  // const clicker = document.querySelector('#cityMenuSection');
  //
  // clicker.style.pointerEvents = 'auto';
  // document.querySelector('#cityCard').style.display = 'block';
  // document.querySelector('#cityCard').innerHTML = '';
  //
  //
  //
  //
  // const cities = [
  //   'Westown',
  //   'Northfield',
  //   'Southcity',
  // ];
  //
  // let productList = '';
  // for(let product in city.storage){
  //   const thisProd = city.storage[product];
  //
  //
  //   let holes = '';
  //
  //   thisProd.line.forEach((item, i) => {
  //     if(item === 0){
  //       const price = thisProd.prices[i];
  //       const str = `
  //         <div class="resource-hole">
  //           <div class="cityCard-resource-info-holes-price">$${price}</div>
  //         </div>
  //       `
  //       holes+=str;
  //     }else{
  //       const str = `
  //         <div class="resource-gag resource-bg-color-${product}" style="margin:">
  //           <div class="resource-gag-title">${product}</div>
  //         </div>
  //       `
  //       holes+=str;
  //     };
  //   });
  //
  //
  //
  //   const prodListItem = `
  //     <div class="cityCard-list-item">
  //       <div class="cityCard-resource-image">
  //         <div style="background-size:cover; width:100%;height:100%" class="product-${product}">
  //         </div>
  //       </div>
  //       <div class="cityCard-resource-info">
  //         <div class="cityCard-resource-info-price ">$${city.getCurrentProductPrice(product)}</div>
  //         <div class="cityCard-resource-info-holes">
  //           ${holes}
  //         </div>
  //       </div>
  //     </div>
  //   `
  //
  //   productList += prodListItem;
  // };
  //
  // const card = `
  //
  //   <div class="card-header">
  //     city <span class="card-header-span"> | ${city.name} <span>$${city.balance}</span> </span>
  //   </div>
  //   <div class="cityCard-title">
  //     ${city.name}
  //   </div>
  //
  //
  //   <div class="cityCard-list" id="cityCard_list">
  //     ${productList}
  //   </div>
  //
  // `
  //
  //
  //
  // document.querySelector('#cityCard').insertAdjacentHTML('beforeEnd', card);
  // MAIN.interface.returnTouches(document.querySelector('#cityCard_list'))



};




function closeMenu(event){
  const clicker =  document.querySelector('#cityMenuSection');
  if(event.target ===  clicker){
    CITY.cardOpened = false;
    document.querySelector('#cityCard').style.display = 'none';
    clicker.style.pointerEvents = 'none';
  };

};



function showCityPrices(product){
  CITY.priceShow = product;
  document.querySelector('#cityPriceSection').style.display = 'block';
  for(let city in MAIN.game.data.cities){
    const thisCity = MAIN.game.data.cities[city];
    thisCity.showPrice(product);
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
