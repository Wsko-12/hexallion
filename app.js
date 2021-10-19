const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const DB = require('./modules/db.js');
const COASTS = require('./modules/coasts.js');



http.listen(PORT, '0.0.0.0', () => {
  console.log('Сервер запущен');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

// app.use(express.static(__dirname + '/client'));
app.use('/', express.static(__dirname + '/client'));

const SOCKETS = {};
const USERS = {};
//Это данные комнаты, которую пользователь будет создавать в лобби
const ROOMS = {
  R_0000000000: {
    id: 'R_0000000000',
    gameID: null,
    owner: null,
    maxMembers: 1,
    members: [],
    started: false,
    turnBasedGame:false,
    turnTime:10000,
  },
};
const GAMES = {

};


class CREDIT {
  constructor(properties){
    this.player = properties.player;
    this.amount = properties.amount;
    this.pays = properties.pays;
    this.deferment = properties.deferment;
    this.procent = properties.procent;
  };
};

class PLAYER {
  constructor(properties){
    this.login = properties.login;
  };
  applyCredit(credit){
    credit.player = this;
    this.balance = credit.amount;
    this.credit = new CREDIT(credit);
    if( USERS[this.login]){
      const socket = USERS[this.login].socket;
      const data = {
        amount:credit.amount,
        pays:credit.pays,
        deferment:credit.deferment,
        procent:credit.procent,
      };
      if(socket){
        socket.emit('GAME_applyCredit',data);
      };

    };
  };
  changeBalance(value){
    this.balance += value;
    const socket = USERS[this.login].socket;
    if(socket){
      socket.emit('GAME_changeBalance',this.balance);
    };
  };
};



class GAME {
  //Очередь пусть формируется из тех, кто первый выбрал кредит
  constructor(properties){
    this.id = properties.id;
    this.roomID = properties.roomID;
    this.members = properties.members;
    this.mapArray = properties.mapArray;
    this.players = properties.players;
    this.turnBasedGame = properties.turnBasedGame;
    this.queue = [];
    this.queueNum = 0;
  };
  sendToAll(message,data){
    this.members.forEach((member, i) => {
      if(USERS[member]){
        USERS[member].socket.emit(message,data);
      };
    });
  };

  playerBuilding(data){
    //нужно сюда впихнуть историю происходящего в игре
    // data = {
    //     ceilIndex: ceil.indexes,
    //     sector: sector,
    //     building: building,
    //   }

    this.sendToAll('GAME_applyBuilding',data);
  };

  sendTurn(){
    const currentTurn = this.queue[this.queueNum];
    this.sendToAll('GAME_reciveTurn',currentTurn);
  };


};

//
// DB.connectToDB().then(function() {
//   console.log('DB connected');
// });





const io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('connection');

  //dev
  SOCKETS[socket.id] = socket;

  /*
   * Это быстрая аутентификация, сразу рандомный логин записывается в USERS и SOCKET
   * Но логин будет приходить со строницы аутентификации
   * Если логин первый, то это хозяин комнаты
   * Дальше, как наберется нужное кол-во игроков, то Пользователь должен начать игру.
   */
  socket.on('auth', (data) => {

    SOCKETS[socket.id].user = data.login;
    USERS[data.login] = {};
    USERS[data.login].socket = socket;

    /*ДЛЯ ОДНОГО ИГРОКА*/
    ROOMS.R_0000000000.owner = data.login;
    ROOMS.R_0000000000.members = [];
    ROOMS.R_0000000000.members.push(data.login);
    /*ДЛЯ ОДНОГО ИГРОКА*/

    /*БОЛЬШЕ ОДНОГО ИГРОКА*/
    // if (ROOMS.R_0000000000.owner === null) {
    //   ROOMS.R_0000000000.owner = data.login;
    // };
    // ROOMS.R_0000000000.members.push(data.login);
    /*БОЛЬШЕ ОДНОГО ИГРОКА*/

    if (ROOMS.R_0000000000.members.length === ROOMS.R_0000000000.maxMembers) {

      const ownerSocket = USERS[ROOMS.R_0000000000.owner].socket;
      if (ownerSocket) {
        //Вызов у хозяина комнаты старта начала генерации игры
        ownerSocket.emit('GAME_generate', ROOMS.R_0000000000);
      };

      ROOMS.R_0000000000.members.forEach((member, i) => {
        if (member != ROOMS.R_0000000000.owner) {
          const memberSocket = USERS[member].socket;
          if (memberSocket) {
            //Участникам комнаты уведомление, что комната готова и идет генерация игры
            memberSocket.emit('ROOM_ready');
          };
        };
      });
    };
  });

  socket.on('disconnect', function() {
    const user = USERS[SOCKETS[socket.id].user];
    if (user) {
      delete USERS[SOCKETS[socket.id].user]
    };
    delete SOCKETS[socket.id]
    console.log('disconnect');
  });


  //происходит, когда сгенерирована карта, очередь и тд
  socket.on('GAME_generated', (gameData) => {
    //trigger game -> generation.js -> start()
    /*
      gameData = {
      roomID:R_0000000000,
      id:'G_0000000000',
      turns:[member1,member2,member3,member4],
      mapArray:[mapCeils],

    }
    */
    ROOMS[gameData.roomID].gameID = gameData.id;


    gameData.players = {};
    gameData.members.forEach((member, i) => {
      const properties = {
        login:member,
      };
      const player = new PLAYER(properties);
      gameData.players[player.login] = player;
    });


    // ---!--- сюда надо вкинуть класс GAME, чтобы через нее реализовать SOCKET.broadcast;
    const game = new GAME(gameData);
    GAMES[game.id] = game;
    // ---!--- сюда надо вкинуть класс ROOM, чтобы через нее реализовать SOCKET.broadcast;
    ROOMS[gameData.roomID].members.forEach((member) => {
      if (USERS[member]) {
        USERS[member].socket.emit('GAME_data', gameData);
      };
    });
  });


  //происходит, когда игрок выбирает себе кредит
  socket.on('GAME_choseCredit',(data)=>{
    //trigger interface -> game -> credit.js -> accept();
    /*
      data = {
        player:MAIN.userData.login,
        gameID:MAIN.game.commonData.id,
        credit:globalChoosenCredit,
      };
    */

    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/
    if(GAMES[data.gameID].queue.indexOf(data.player) === -1){
      GAMES[data.gameID].players[data.player].applyCredit(data.credit);
      GAMES[data.gameID].queue.push(data.player);
      //если это первый игрок в очереди, то отсылаем ему ход
      if(GAMES[data.gameID].turnBasedGame){
          if(GAMES[data.gameID].queue.length === 1){
            GAMES[data.gameID].sendTurn();
          };
      };

    };

    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/
  });


  //происходит, когда игрок хочет что-то построить
  socket.on('GAME_building',(data)=>{
    //trigger interface -> game -> ceilMenu.js -> sendBuildRequest();
    /*
      data = {
        player:MAIN.userData.login,
        gameID:MAIN.game.commonData.id,
        build:{
          ceilIndex:ceil.indexes,
          sector:sector,
          building:building,
        },
    */

    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/
    const game = GAMES[data.gameID];
    if(game){
      //anticheat
      if(game.players[data.player].balance >= COASTS.buildings[data.build.building]){
        game.players[data.player].changeBalance(COASTS.buildings[data.build.building]*(-1))
        //чтобы игрок не мог построить вне его хода
        if(game.turnBasedGame){
          if(game.queue[game.queueNum] === data.player){
            GAMES[data.gameID].playerBuilding(data.build);
          };
        }else{
          GAMES[data.gameID].playerBuilding(data.build);
        };
      };

    };
      /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/

    /*ДЛЯ ОДНОГО ИГРОКА*/
    // socket.emit('GAME_applyBuilding',data.build);
    /*ДЛЯ ОДНОГО ИГРОКА*/
  });

  // происходит в конце хода
  //trigger game -> functions
  socket.on('GAME_endTurn',(data)=>{
    /*const data = {
      player:MAIN.userData.login,
      gameID:MAIN.game.commonData.id,
    };
    */
    const game = GAMES[data.gameID];
    if(game){
      game.queueNum += 1;
      if(game.queueNum >= game.queue.length){
        game.queueNum = 0;
      };
      game.sendTurn();
    };
  })


});
