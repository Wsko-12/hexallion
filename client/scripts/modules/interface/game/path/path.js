import {
  MAIN
} from '../../../../main.js';
import {
  Vector3
} from '../../../../libs/ThreeJsLib/build/three.module.js';

// function showSendButton(data) {
//   const button = document.querySelector('#pathSection_sendButton');
//   document.querySelector('#pathSection_sendButton_title').innerHTML = 'Send';
//   MAIN.interface.deleteTouches(button);
//   button.onclick = null;
//   button.ontouchstart = null;
//
//   button.onclick = send;
//   button.ontouchstart = send;
//
//   button.style.display = 'flex';
//
//   function send() {
//     MAIN.interface.game.trucks.turningInterfase = false;
//     MAIN.interface.game.city.hideCityPrices();
//     button.style.display = 'none';
//     MAIN.interface.dobleClickFunction.standard = true;
//     MAIN.interface.dobleClickFunction.function = null;
//     document.querySelector('#truckCancelButton').style.display = 'none';
//     document.querySelector('#truckDice').style.display = 'none';
//     MAIN.game.scene.path.clear();
//
//     const pathServerData = [];
//     data.path.forEach((ceil, i) => {
//       pathServerData.push(ceil.indexes);
//     });
//
//     const serverData = {
//       gameID: MAIN.game.data.commonData.id,
//       truckID: data.truck.id,
//       path: pathServerData,
//       playerMoveToCity: data.playerMoveToCity,
//     };
//
//     //bug fix не знаю откуда взялся, но после высылки грузовика не закрылось path меню
//     if (!data.truck.sended) {
//       data.truck.sended = true;
//       if (data.truck.resource) {
//         if (data.truck.place.x != null && data.truck.place.z != null) {
//           data.truck.clearNotification();
//           if(!MAIN.game.data.playerData.gameOver){
//             MAIN.socket.emit('GAME_truck_send', serverData);
//           };
//         };
//       };
//     } else {
//       // баг происходит, если пришел тик, а игрок все еще не отправил грузовик.
//       // тик возвращает ему sended = false, а тут сбивается опять
//       //два пути решения:
//       // 1.создавать апдейтовый ид
//       // 2.просто отключить send на карточке грузовика и почистить notifications что я и сделаю, потому что иначе выглядит так, будто ходы "скапливаются"
//       //  а так будет, что если игрок в данный тик не отправил груз, то просрал тик.
//       closeAll();
//     };
//   };
//
// };

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
  MAIN.interface.game.trucks.turningInterfase = false;
  MAIN.interface.game.city.hideCityPrices();
  const button = document.querySelector('#pathSection_sendButton');
  MAIN.interface.dobleClickFunction.standard = true;
  MAIN.interface.dobleClickFunction.function = null;
  document.querySelector('#truckCancelButton').style.display = 'none';
  document.querySelector('#truckDice').style.display = 'none';
  MAIN.game.scene.path.clear();
  hideButtons();
};

function showButtons(buttons,data){
  PATH.buttonsDOM = document.querySelector('#pathSection_ButtonsContainer');
  PATH.buttonsDOM.style.display = 'flex';
  PATH.buttonsShowed = true;


  const sellButton = document.querySelector('#pathSection_sellButton');
  const moveButton = document.querySelector('#pathSection_moveButton');

  sellButton.onclick = null;
  sellButton.ontouchstart = null;
  moveButton.onclick = null;
  moveButton.ontouchstart = null;


  sellButton.style.display = 'none';
  moveButton.style.display = 'none';


  if(buttons === 1){
    moveButton.style.display = 'flex';

    moveButton.onclick = ()=>{action(false)};
    moveButton.ontouchstart = ()=>{action(false)};
  }else if(buttons === 2){
    sellButton.style.display = 'flex';
    moveButton.style.display = 'flex';

    moveButton.onclick = ()=>{action(false)};
    moveButton.ontouchstart = ()=>{action(false)};
    sellButton.onclick = ()=>{action(true)};
    sellButton.ontouchstart = ()=>{action(true)};
  }else{
    //если грузовик уже стоял в городе, то показываем только продажу;
    sellButton.style.display = 'flex';

    sellButton.onclick = ()=>{immediatelySell()};
    sellButton.ontouchstart = ()=>{immediatelySell()};

  };




  function action(selling) {
    MAIN.interface.game.trucks.turningInterfase = false;
    MAIN.interface.game.city.hideCityPrices();
    // button.style.display = 'none';
    MAIN.interface.dobleClickFunction.standard = true;
    MAIN.interface.dobleClickFunction.function = null;
    document.querySelector('#truckCancelButton').style.display = 'none';
    document.querySelector('#truckDice').style.display = 'none';
    MAIN.game.scene.path.clear();
    hideButtons();


    const pathServerData = [];
    data.path.forEach((ceil, i) => {
      pathServerData.push(ceil.indexes);
    });

    const serverData = {
      gameID: MAIN.game.data.commonData.id,
      truckID: data.truck.id,
      path: pathServerData,
      selling:selling,
    };
    if(selling){
      serverData.city = data.path[data.path.length-1].type;
    };

    //bug fix не знаю откуда взялся, но после высылки грузовика не закрылось path меню
    if (!data.truck.sended) {
      data.truck.sended = true;
      if (data.truck.product) {
        if (data.truck.place.x != null && data.truck.place.z != null) {
          data.truck.clearNotification();
          if(!MAIN.game.data.playerData.gameOver){
            MAIN.socket.emit('GAME_truck_send', serverData);
          };
        };
      };
    } else {
      // баг происходит, если пришел тик, а игрок все еще не отправил грузовик.
      // тик возвращает ему sended = false, а тут сбивается опять
      //два пути решения:
      // 1.создавать апдейтовый ид
      // 2.просто отключить send на карточке грузовика и почистить notifications что я и сделаю, потому что иначе выглядит так, будто ходы "скапливаются"
      //  а так будет, что если игрок в данный тик не отправил груз, то просрал тик.
      closeAll();
    };
  };

  function immediatelySell(){
    //если грузовик сразу стоит в городе

    MAIN.interface.game.trucks.turningInterfase = false;
    MAIN.interface.game.city.hideCityPrices();
    MAIN.interface.dobleClickFunction.standard = true;
    MAIN.interface.dobleClickFunction.function = null;
    document.querySelector('#truckCancelButton').style.display = 'none';
    document.querySelector('#truckDice').style.display = 'none';
    MAIN.game.scene.path.clear();
    hideButtons();



    const sendData = {
      gameID: MAIN.game.data.commonData.id,
      player: MAIN.game.data.playerData.login,
      truckID: data.truck.id,
      city: data.city,
    };
    if(!MAIN.game.data.playerData.gameOver){
        MAIN.socket.emit('GAME_product_sell', sendData); 
    };

  };
};

function hideButtons(){
  PATH.buttonsDOM = document.querySelector('#pathSection_ButtonsContainer');
  PATH.buttonsShowed = false;
  PATH.buttonsDOM.style.display = 'none';
};

function moveButtons(){
  const tempV = new Vector3(PATH.point3D.x, 0, PATH.point3D.z);
  // console.log(MAIN.interface.game.camera.configs.rail.yAngle.current); 0-4
  tempV.project(MAIN.renderer.camera);

  // convert the normalized position to CSS coordinates
  const x = (tempV.x * .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
  const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

  // pseudo3d
  // const cameraAngle = 4-MAIN.interface.game.camera.configs.rail.yAngle.current;
  // PATH.buttonsDOM.style.transform = `translate(-50%, -50%) translate(${x}px,${y-cameraAngle*2}px)`;
  // PATH.buttonsDOM.childNodes.forEach((item) => {
  //   if(item.nodeType === 1){
  //     item.style.transform = `rotateX(${cameraAngle*15}deg)`;
  //   };
  // });

  PATH.buttonsDOM.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;


};

function showActionsButton(data){
  PATH.point3D.x = data.path[data.path.length-1].position.x;
  PATH.point3D.z = data.path[data.path.length-1].position.z;

  if(data.path[data.path.length-1].cityCeil){
    //если финальная точка оказалась городом, то показываем две кнопки отправить  и продать
    showButtons(2,data);
  }else{
    showButtons(1,data);
  };
};

function showOnlySellButton(data){
  PATH.buttonsDOM = document.querySelector('#pathSection_ButtonsContainer');
  PATH.buttonsDOM.style.display = 'flex';
  PATH.buttonsShowed = true;

  PATH.point3D.x = data.truck.object3D.position.x;
  PATH.point3D.z = data.truck.object3D.position.z;

  showButtons(0,data);
};

const PATH = {
  point3D:{
    x:0,
    z:0,
  },
  buttonsDOM:null,
  buttonsShowed:false,

  showActionsButton,
  showOnlySellButton,
  moveButtons,
  hideButtons,

  showNotification,
  closeAll,






};
export {
  PATH
};
