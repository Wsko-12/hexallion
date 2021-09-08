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
const DEV_ROOM = {
  owner:null,
  maxMembers:4,
  members:[],
  started:false
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
  socket.on('auth',(data)=>{
    console.log(data.login)

    SOCKETS[socket.id].user = data.login;
    USERS[data.login] = {};
    USERS[data.login].socket = socket;


    if(DEV_ROOM.owner === null){
      DEV_ROOM.owner = data.login;
    };

    DEV_ROOM.members.push(data.login);

    if(DEV_ROOM.members.length === DEV_ROOM.maxMembers){
      const owner = USERS[DEV_ROOM.owner].socket.emit('ROOM_ready',DEV_ROOM);
    };

  });






  socket.on('disconnect', function() {
    const user = USERS[SOCKETS[socket.id].user];
    if(user){
      delete USERS[SOCKETS[socket.id].user]
    };
    delete SOCKETS[socket.id]
    console.log('disconnect');
  });
});
