import {
  MAIN
} from '../../../../main.js';
import {Vector3} from '../../../../libs/ThreeJsLib/build/three.module.js';

function showSendButton(data){
  const button = document.querySelector('#pathSection_sendButton');
  MAIN.interface.deleteTouches(button);
  button.onclick = null;
  button.ontouchstart = null;

  button.onclick = send;
  button.ontouchstart = send;

  button.style.display = 'flex';

  function send(){
    button.style.display = 'none';
    MAIN.interface.dobleClickFunction.standard = true;
    MAIN.interface.dobleClickFunction.function = null;
    document.querySelector('#truckDice').style.display = 'none';
    MAIN.game.scene.path.clear();

    const pathServerData = [];
    data.path.forEach((ceil, i) => {
      pathServerData.push(ceil.indexes);
    });

    const serverData = {
      gameID:MAIN.game.data.commonData.id,
      truckID:data.truck.id,
      path:pathServerData,
    };

    MAIN.socket.emit('GAME_truck_send',serverData);
  };

};

let notificationID = null;
function showNotification(coords3D){
  notificationID = generateId('notification',10);
  const thisID = notificationID;
  const notification =   document.querySelector('#pathSection_notification');
  notification.style.display = 'block';


  const tempV = new Vector3(coords3D.x,0.2,coords3D.z);
  tempV.project(MAIN.renderer.camera);

  // convert the normalized position to CSS coordinates
  const x = (tempV.x *  .5 + .5) * MAIN.renderer.renderer.domElement.clientWidth;
  const y = (tempV.y * -.5 + .5) * MAIN.renderer.renderer.domElement.clientHeight;

  // move the elem to that position
  notification.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;




  setTimeout(()=>{
    if(thisID === notificationID){
      notification.style.display = 'none'
    };
  },1000)
};
function closeAll(){
  console.log("closeAll")
  const button = document.querySelector('#pathSection_sendButton');
  MAIN.interface.dobleClickFunction.standard = true;
  MAIN.interface.dobleClickFunction.function = null;
  document.querySelector('#truckDice').style.display = 'none';
  button.style.display = 'none';
  MAIN.game.scene.path.clear();
};


const PATH = {
  showSendButton,
  showNotification,
  closeAll,


};
export {PATH};