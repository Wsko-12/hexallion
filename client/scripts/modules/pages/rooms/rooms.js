import {
  MAIN
} from '../../../main.js';




const ROOMS = {

  showPage() {
    MAIN.pages.screen.innerHTML = '';

    const room = {
      maxMembers: 1,
      turnBasedGame: true,
      turnTime: 30,
      tickTime: 30,
    };




    const page = `
      <div id="roomsPage">
        <div id="roomsPageBG"></div>
        <div id="roomsList">
          <div class='room-card' id="createRoomCard">
            <div class='card-header'>Creating room</div>

            <div class='room-card-title'>New Room</div>
            <div class='room-card-property'>
              <div class='room-card-property-title'>Players:</div>
              <div class='room-card-property-set'>
                <div class='room-card-property-set-button' id="roomCard-players-minus"> - </div>
                <div class='room-card-property-set-value' id="roomCard-players-value"> 0${room.maxMembers} </div>
                <div class='room-card-property-set-button' id="roomCard-players-plus"> + </div>
              </div>
            </div>

            <div class='room-card-property'>
              <div class='room-card-property-title'>Turns:</div>
              <div class='room-card-property-set'>
                <input type="checkbox" class='room-card-property-set-checkBox' checked="${room.turnBasedGame} " id="roomCard-turns-value">
              </div>
            </div>


            <div class='room-card-property' id="turnProperty">
              <div class='room-card-property-title' id="roomCard-turn-title">Turns time:</div>
              <div class='room-card-property-set'>
                <div class='room-card-property-set-button' id="roomCard-turn-minus"> - </div>
                <div class='room-card-property-set-value' id="roomCard-turn-value"> ${room.turnBasedGame ? room.turnTime : room.tickTime}s </div>
                <div class='room-card-property-set-button' id="roomCard-turn-plus"> + </div>
              </div>
            </div>


            <div class='room-card-button' id="createRoomButton">
              <span class='room-card-button-span'>Create</span>
            </div>

          </div>

        </div>
      </div>
    `

    MAIN.pages.screen.insertAdjacentHTML('beforeEnd', page);


    function changePlayers(plus) {
      if (plus) {
        if (room.maxMembers < 4) {
          room.maxMembers++;
        }
      } else {
        if (room.maxMembers > 1) {
          room.maxMembers--;
        };
      };
      document.querySelector('#roomCard-players-value').innerHTML = '0' + room.maxMembers;
    };

    MAIN.interface.deleteTouches(document.querySelector('#roomCard-players-plus'));
    MAIN.interface.deleteTouches(document.querySelector('#roomCard-players-minus'));

    document.querySelector('#roomCard-players-plus').onclick = () => {
      changePlayers(true)
    };
    document.querySelector('#roomCard-players-minus').onclick = () => {
      changePlayers(false)
    };
    document.querySelector('#roomCard-players-plus').ontouchstart = () => {
      changePlayers(true)
    };
    document.querySelector('#roomCard-players-minus').ontouchstart = () => {
      changePlayers(false)
    };



    MAIN.interface.deleteTouches(document.querySelector('#roomCard-turn-plus'));
    MAIN.interface.deleteTouches(document.querySelector('#roomCard-turn-minus'));


    function changeTurnTime(plus) {
      if (plus) {
        if (room.turnTime < 90) {
          room.turnTime += 10;
        }
      } else {
        if (room.turnTime > 10) {
          room.turnTime -= 10;
        };
      };
      document.querySelector('#roomCard-turn-value').innerHTML = room.turnTime + 's';
    };

    function changeTickTime(plus) {
      if (plus) {
        if (room.tickTime < 90) {
          room.tickTime += 10;
        }
      } else {
        if (room.tickTime > 15) {
          room.tickTime -= 10;
        };
      };
      document.querySelector('#roomCard-turn-value').innerHTML = room.tickTime + 's';
    };

    document.querySelector('#roomCard-turns-value').onchange = (e) => {
      document.querySelector('#roomCard-turn-plus').onclick = null;
      document.querySelector('#roomCard-turn-minus').onclick = null;
      document.querySelector('#roomCard-turn-plus').ontouchstart = null;
      document.querySelector('#roomCard-turn-minus').ontouchstart = null;

      if (e.target.checked) {
        room.turnBasedGame = true;
        document.querySelector('#roomCard-turn-title').innerHTML = 'Turns time:';

        document.querySelector('#roomCard-turn-plus').onclick = () => {
          changeTurnTime(true)
        };
        document.querySelector('#roomCard-turn-minus').onclick = () => {
          changeTurnTime(false)
        };
        document.querySelector('#roomCard-turn-plus').ontouchstart = () => {
          changeTurnTime(true)
        };
        document.querySelector('#roomCard-turn-minus').ontouchstart = () => {
          changeTurnTime(false)
        };


        document.querySelector('#roomCard-turn-value').innerHTML = room.turnTime + 's';


      } else {
        room.turnBasedGame = false;
        document.querySelector('#roomCard-turn-title').innerHTML = 'Tick time:';


        document.querySelector('#roomCard-turn-plus').onclick = () => {
          changeTickTime(true)
        };
        document.querySelector('#roomCard-turn-minus').onclick = () => {
          changeTickTime(false)
        };
        document.querySelector('#roomCard-turn-plus').ontouchstart = () => {
          changeTickTime(true)
        };
        document.querySelector('#roomCard-turn-minus').ontouchstart = () => {
          changeTickTime(false)
        };


        document.querySelector('#roomCard-turn-value').innerHTML = room.tickTime + 's';
      };
    };



    //сразу вешаем на time plus и minus
    if (room.turnBasedGame) {
      document.querySelector('#roomCard-turn-title').innerHTML = 'Turns time:';

      document.querySelector('#roomCard-turn-plus').onclick = () => {
        changeTurnTime(true)
      };
      document.querySelector('#roomCard-turn-minus').onclick = () => {
        changeTurnTime(false)
      };
      document.querySelector('#roomCard-turn-plus').ontouchstart = () => {
        changeTurnTime(true)
      };
      document.querySelector('#roomCard-turn-minus').ontouchstart = () => {
        changeTurnTime(false)
      };


      document.querySelector('#roomCard-turn-value').innerHTML = room.turnTime + 's';


    } else {
      document.querySelector('#roomCard-turn-title').innerHTML = 'Tick time:';


      document.querySelector('#roomCard-turn-plus').onclick = () => {
        changeTickTime(true)
      };
      document.querySelector('#roomCard-turn-minus').onclick = () => {
        changeTickTime(false)
      };
      document.querySelector('#roomCard-turn-plus').ontouchstart = () => {
        changeTickTime(true)
      };
      document.querySelector('#roomCard-turn-minus').ontouchstart = () => {
        changeTickTime(false)
      };


      document.querySelector('#roomCard-turn-value').innerHTML = room.tickTime + 's';
    };


    function createRoom() {
      document.querySelector('#createRoomCard').style.display = 'none';
      room.owner = MAIN.userData.login;
      MAIN.socket.emit('LOBBY_room_create', room);
    };


    document.querySelector('#createRoomButton').onclick = () => {
      createRoom()
    };
    document.querySelector('#createRoomButton').ontouchstart = () => {
      createRoom()
    };
  },

  showedRooms: {

  },

  deleteRoom(id) {
    if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).remove();
    };
    delete this.showedRooms[id];
  },

  updateRoom(data) {
    if (MAIN.userData.inRoom) {
      document.querySelector('#createRoomCard').style.display = 'none';
    } else {
      document.querySelector('#createRoomCard').style.display = 'block';
    };

    let players = '';
    data.members.forEach((item, i) => {
      let color = '#303030';
      if (item === MAIN.userData.login) {
        color = '#ff3939';
      };
      players += `<div class='room-card-players-list-item' style = 'color:${color}'>${item}</div>`;
    });

    let button = '';
    if (MAIN.userData.inRoom === data.id) {
      button = `<span style='margin:auto'>Leave</span>`;
    } else {
      button = `<span style='margin:auto'>Join</span>`;
    };

    if (document.querySelector(`#${data.id}_players`)) {
      document.querySelector(`#${data.id}_players`).innerHTML = players;
      document.querySelector(`#${data.id}_button`).innerHTML = button;
    };

    function leaveRoom() {
      const data = {
        player: MAIN.userData.login,
        room: MAIN.userData.inRoom,
      };
      MAIN.socket.emit('LOBBY_userLeaveRoom', data);
    };

    function joinRoom() {
      if (MAIN.userData.inRoom) {
        leaveRoom();
      };
      setTimeout(() => {
        const sendData = {
          player: MAIN.userData.login,
          room: data.id,
        };
        console.log(sendData)
        MAIN.socket.emit('LOBBY_userJoinRoom', sendData);
      }, 100);
    };

    if (MAIN.userData.inRoom === data.id) {
      if (document.querySelector(`#${data.id}_button`)) {
        document.querySelector(`#${data.id}_button`).onclick = () => {
          leaveRoom()
        };
        document.querySelector(`#${data.id}_button`).ontouchstart = () => {
          leaveRoom()
        };
      };
    } else {
      if (document.querySelector(`#${data.id}_button`)) {
        document.querySelector(`#${data.id}_button`).onclick = () => {
          joinRoom()
        };
        document.querySelector(`#${data.id}_button`).ontouchstart = () => {
          joinRoom()
        };
      };
    };


  },

  createRoom(data) {
    this.showedRooms[data.id] = data;

    let players = '';
    data.members.forEach((item, i) => {
      let color = '#303030';
      if (item === MAIN.userData.login) {
        color = '#ff3939';
      };
      players += `<div class='room-card-players-list-item' style = 'color:${color}'>${item}</div>`;
    });


    let button = '';

    if (MAIN.userData.inRoom === data.id) {
      button = `<div id="${data.id}_button" class="room-card-button"><span style='margin:auto'>Leave</span></div>`;
    } else {
      button = `<div id="${data.id}_button" class="room-card-button"><span style='margin:auto'>Join</span></div>`;
    };
    const room = `
      <div id="${data.id}" class="room-card card room-card">
        <div class='room-card-string' id="${data.id}_maxMembers">Max members: ${data.maxMembers}</div>
        <div class='room-card-string' id="${data.id}_turnBased">Mode: ${data.turnBasedGame ? 'turns' : 'real time'}</div>
        <div class='room-card-string' id="${data.id}_time"> ${data.turnBasedGame ? 'Turn' : 'Tick'} time: ${data.turnBasedGame ? data.turnTime+'s' : data.tickTime+'s'}</div>
        <div class='room-card-string'>Players:</div>
        <div class='room-card-players-list' id="${data.id}_players">${players}</div>
        ${button}
      </div>
    `


    document.querySelector('#roomsList').insertAdjacentHTML('beforeEnd', room);


    function leaveRoom() {
      const data = {
        player: MAIN.userData.login,
        room: MAIN.userData.inRoom,
      };
      MAIN.socket.emit('LOBBY_userLeaveRoom', data);
    };

    function joinRoom() {
      if (MAIN.userData.inRoom) {
        leaveRoom();
      };
      setTimeout(() => {
        const sendData = {
          player: MAIN.userData.login,
          room: data.id,
        };
        MAIN.socket.emit('LOBBY_userJoinRoom', sendData);
      }, 100);
    };

    if (MAIN.userData.inRoom === data.id) {
      document.querySelector(`#${data.id}_button`).onclick = () => {
        leaveRoom()
      };
      document.querySelector(`#${data.id}_button`).ontouchstart = () => {
        leaveRoom()
      };

    } else {
      document.querySelector(`#${data.id}_button`).onclick = () => {
        joinRoom()
      };
      document.querySelector(`#${data.id}_button`).ontouchstart = () => {
        joinRoom()
      };
    };
  },

  updatePage(data) {
    for (let room in this.showedRooms) {
      const index = data.indexOf(room);
      if (index === -1) {
        this.deleteRoom(room);
      } else {
        this.updateRoom(data[index]);
      };
    };



    data.forEach((item, i) => {
      if (!this.showedRooms[item.id]) {
        this.createRoom(item);
      };
    });
  },

};


export {
  ROOMS
};
