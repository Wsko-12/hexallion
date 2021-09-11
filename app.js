const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const DB = require('./modules/db.js');



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
    maxMembers: 3,
    members: [],
    started: false,
  },
};
const GAMES = {

};




DB.connectToDB().then(function() {
  console.log('DB connected');
});





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


    if (ROOMS.R_0000000000.owner === null) {
      ROOMS.R_0000000000.owner = data.login;
    };

    ROOMS.R_0000000000.members.push(data.login);

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





  //происходит, когда сгенерирована карта, очередь и тд
  socket.on('GAME_generated', (gameData) => {
    /*
      gameData = {
      roomID:R_0000000000,
      id:'G_0000000000',
      turns:[member1,member2,member3,member4],
      mapArray:[mapCeils],
    }
    */
    ROOMS[gameData.roomID].gameID = gameData.id;
    // ---!--- сюда надо вкинуть класс GAME, чтобы через нее реализовать SOCKET.broadcast;
    GAMES[gameData.id] = gameData;

    // ---!--- сюда надо вкинуть класс ROOM, чтобы через нее реализовать SOCKET.broadcast;
    ROOMS[gameData.roomID].members.forEach((member) => {
      if (USERS[member]) {
        USERS[member].socket.emit('GAME_data', gameData);
      };
    });
  });



  socket.on('disconnect', function() {
    const user = USERS[SOCKETS[socket.id].user];
    if (user) {
      delete USERS[SOCKETS[socket.id].user]
    };
    delete SOCKETS[socket.id]
    console.log('disconnect');
  });
});
