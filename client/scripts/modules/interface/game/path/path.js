import {
  MAIN
} from '../../../../main.js';
import {
  Vector3
} from '../../../../libs/ThreeJsLib/build/three.module.js';

function showSendButton(data) {
  const button = document.querySelector('#pathSection_sendButton');
  document.querySelector('#pathSection_sendButton_title').innerHTML = 'Send';
  MAIN.interface.deleteTouches(button);
  button.onclick = null;
  button.ontouchstart = null;

  button.onclick = send;
  button.ontouchstart = send;

  button.style.display = 'flex';

  function send() {
    MAIN.interface.game.city.hideCityPrices();
    button.style.display = 'none';
    MAIN.interface.dobleClickFunction.standard = true;
    MAIN.interface.dobleClickFunction.function = null;
    document.querySelector('#truckCancelButton').style.display = 'none';
    document.querySelector('#truckDice').style.display = 'none';
    MAIN.game.scene.path.clear();

    const pathServerData = [];
    data.path.forEach((ceil, i) => {
      pathServerData.push(ceil.indexes);
    });

    const serverData = {
      gameID: MAIN.game.data.commonData.id,
      truckID: data.truck.id,
      path: pathServerData,
      playerMoveToCity: data.playerMoveToCity,
    };

    //bug fix не знаю откуда взялся, но после высылки грузовика не закрылось path меню
    if (!data.truck.sended) {
      data.truck.sended = true;
      if (data.truck.resource) {
        if (data.truck.place.x && data.truck.place.z) {
          MAIN.socket.emit('GAME_truck_send', serverData);
        };
      };
    } else {
      closeAll();
    };
  };

};

let notificationID = null;

function showNotification(coords3D) {
  notificationID = generateId('notification', 10);
  const thisID = notificationID;
  const notification = document.querySelector('#pathSection_notification');
  notification.style.display = 'block';


  const tempV = new Vector3(coords3D.x, 0.2, coords3D.z);
  tempV.project(MAIN.renderer.camera);

  // convert the normalized position to CSS coordinates
  const x = (tempV.x * .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
  const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

  // move the elem to that position
  notification.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;




  setTimeout(() => {
    if (thisID === notificationID) {
      notification.style.display = 'none'
    };
  }, 1000)
};

function closeAll() {
  // console.log("closeAll")
  MAIN.interface.game.city.hideCityPrices();
  const button = document.querySelector('#pathSection_sendButton');
  MAIN.interface.dobleClickFunction.standard = true;
  MAIN.interface.dobleClickFunction.function = null;
  document.querySelector('#truckCancelButton').style.display = 'none';
  document.querySelector('#truckDice').style.display = 'none';
  button.style.display = 'none';
  MAIN.game.scene.path.clear();
};


function showSellResourceButton(data) {
  MAIN.game.scene.path.clear();
  const button = document.querySelector('#pathSection_sendButton');
  document.querySelector('#pathSection_sendButton_title').innerHTML = 'Sell';

  MAIN.interface.deleteTouches(button);
  button.onclick = null;
  button.ontouchstart = null;

  button.onclick = sell;
  button.ontouchstart = sell;

  button.style.display = 'flex';

  function sell() {
    MAIN.interface.game.city.hideCityPrices();
    button.style.display = 'none';
    MAIN.interface.dobleClickFunction.standard = true;
    MAIN.interface.dobleClickFunction.function = null;
    document.querySelector('#truckCancelButton').style.display = 'none';
    document.querySelector('#truckDice').style.display = 'none';
    MAIN.game.scene.path.clear();


    const serverData = {
      gameID: MAIN.game.data.commonData.id,
      truckID: data.truck.id,
    };

    const sendData = {
      gameID: MAIN.game.data.commonData.id,
      player: MAIN.game.data.playerData.login,
      truckID: data.truck.id,
      city: data.city,
    };
    MAIN.socket.emit('GAME_resource_sell', sendData)
  };

};


const PATH = {
  showSendButton,
  showNotification,
  closeAll,
  showSellResourceButton,


};
export {
  PATH
};
