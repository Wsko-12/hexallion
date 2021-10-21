const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const DB = require('./modules/db.js');
const COASTS = require('./modules/coasts.js');
const FACTORIES = require('./modules/factory.js');


http.listen(PORT, '0.0.0.0', () => {
  console.log('Сервер запущен');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

// app.use(express.static(__dirname + '/client'));
app.use('/', express.static(__dirname + '/client'));

function  generateId(type,x){
    if(type === undefined){
      type = 'u'
    }
    if(x === undefined){
      x = 5;
    }
    let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

    let numbers = '0123456789';
    let lettersMix,numbersMix;
    for(let i=0; i<10;i++){
      lettersMix += letters;
      numbersMix += numbers;
    }

    let mainArr = lettersMix.split('').concat(numbersMix.split(''));
    let shuffledArr = mainArr.sort(function(){
                        return Math.random() - 0.5;
                    });
    let id = type +'_';
    for(let i=0; i<=x;i++){
        id += shuffledArr[i];
    };
    return id;
};



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
    turnBasedGame: false,
    turnTime: 10000,
    tickTime:10000,
  },
};
const GAMES = {

};
class FACTORY_LIST {
  constructor(player){
    this.list = {};
    this.player = player;
  };

  add(factory){
    this.list[factory.id] = factory;
  };

};



class FACTORY {
  constructor(properties) {
      this.player = properties.player;
      this.id = properties.id;
      this.name = properties.building;
      //завод добывает ресурсы или перерабатывает
      this.mining = FACTORIES[properties.building].mining;
      this.resource = FACTORIES[properties.building].resource;

      this.ceilIndex = properties.ceilIndex;
      this.sector = properties.sector;

      this.warehouse = FACTORIES[properties.building].warehouse;
      this.speed = FACTORIES[properties.building].speed;
      this.quality = 0;
      //этот параметр сработает, когда придет апдейт на фабрику, нужно будет установить настройки фабрики
      //ее параметры скорость, стоймость, качество
      this.settingsSetted = false;
  };

  setSettings(settings){
    //происходит, когда игрок меняет настройки


    //проверяем на читы хотя вроде все внутри функции и область видимости не пробьешь
    //anticheat
    const points = 4;
    let pointsCounter = 0;
    for(let property in settings){
      if(property != 'cardUsed'){
          pointsCounter += settings[property];
      };
    };
    
    if(pointsCounter > points){
      if(settings.cardUsed === null){
        return;
      };
    };


    this.settingsSetted = true;

    this.productLine = [];
    //сначала забиваем стандартом
    for(let i = 0;i<FACTORIES[this.name].speed;i++){
      this.productLine.push(0);
    };
    //потом отризаем скорости
    for(let i=0;i<settings.speed;i++){
      this.productLine.pop();
    };


    //полная цена за все производство
    const prise = FACTORIES[this.name].price

    //каждый salary point сбивает цену производства на 15%
    //сразу добавляем +15% к стоймости, если у игрока зарплаты на 0 прокачаны;
    const newPrise = prise + (prise*(0.15));
    this.price = Math.round(newPrise - (newPrise*(0.15*settings.salary)));
    this.stepPrice = Math.round(this.price/this.productLine.length);

    this.warehouse = [];
    for(let i = 0;i<FACTORIES[this.name].warehouse + settings.warehouse;i++){
      this.warehouse.push(0);
    };



    this.sendNewSettings();
  };

  sendNewSettings(){
    const data = {
      id: this.id,
      name: this.name,
      mining: this.mining,
      resource: this.resource,
      warehouse: this.warehouse,
      speed: this.speed,
      quality: this.quality,
      productLine: this.productLine,
      price: this.price,
      stepPrice: this.stepPrice,
    };
    this.player.emit('GAME_factory_newSettings',data);
  };



  update(){
    if(this.settingsSetted){

    }else{
      //выслать уведомление по настройке фабрики
    }

  };
};


class CREDIT {
  constructor(properties) {
    this.player = properties.player;
    this.amount = properties.amount;
    this.paysParts = properties.pays;
    this.pays = properties.pays;
    this.deferment = properties.deferment;
    this.procent = properties.procent;
  };
  turn() {
    const that = this;

    function send() {
      const data = {
        pays: that.pays,
        deferment: that.deferment,
      };
      if (USERS[that.player.login]) {
        USERS[that.player.login].socket.emit('GAME_creditChanges', data);
      };
    };
    if (this.deferment > 0) {
      this.deferment -= 1;
      send();
      return;
    } else {
      if (this.pays > 0) {
        this.pays -= 1;
        const pay = (this.amount / this.paysParts) + (this.amount / this.paysParts) * (this.procent / 100);
        this.player.balance -= pay;
        this.player.sendBalanceMessage('Credit payment',(-pay));
        send();
      };
    };
  };
};

class PLAYER {
  constructor(properties) {
    this.login = properties.login;
    this.balance = 0;
    this.balanceHistory = [];
    this.factoryList = new FACTORY_LIST(this);
  };
  sendBalanceMessage(message,amount){
    this.balanceHistory.push({message,amount});
    if(USERS[this.login]){
      USERS[this.login].socket.emit('GAME_BalanceMessage', {
        message,
        amount,
      });
    };
  };
  applyCredit(credit) {
    credit.player = this;
    this.balance = credit.amount;
    this.credit = new CREDIT(credit);
    if (USERS[this.login]) {
      const socket = USERS[this.login].socket;
      const data = {
        amount: credit.amount,
        pays: credit.pays,
        deferment: credit.deferment,
        procent: credit.procent,
      };
      if (socket) {
        socket.emit('GAME_applyCredit', data);
      };
    };
  };
  changeBalance(value) {
    this.balance += value;
    if (USERS[this.login]) {
      const socket = USERS[this.login].socket;
      socket.emit('GAME_changeBalance', this.balance);
    };
  };
  turnAction() {
    if (this.credit) {
      this.credit.turn();
      if (USERS[this.login]) {
        const socket = USERS[this.login].socket;
        socket.emit('GAME_changeBalance', this.balance);
      };
    };
  };
  emit(message,data){
    if(USERS[this.login]){
      USERS[this.login].socket.emit(message,data);
    };
  };
};



class GAME {
  //Очередь пусть формируется из тех, кто первый выбрал кредит
  constructor(properties) {
    this.id = properties.id;
    this.roomID = properties.roomID;
    this.members = properties.members;
    this.players = {};
    properties.members.forEach((member, i) => {
      const properties = {
        login: member,
      };
      const player = new PLAYER(properties);
      this.players[player.login] = player;
    });
    this.mapArray = properties.mapArray;
    this.turnBasedGame = properties.turnBasedGame;
    this.turnTime = properties.turnTime;
    this.tickTime = properties.tickTime;
    this.queue = [];
    this.queueNum = -1;
    this.startedQueque = 0;
    this.turnsPaused = false;
    this.tickPaused = false;


    //в массив сохраняется вся история построек в игре
    this.buildHistory = [];

  };
  sendToAll(message, data) {
    this.members.forEach((member, i) => {
      if (USERS[member]) {
        USERS[member].socket.emit(message, data);
      };
    });
  };


  playerBuilding(data) {
      //происходит, когда игрок что-то строит, вызывается и проверяется в сокете ('GAME_building')
    /*data = {
      player:MAIN.userData.login,
      gameID:MAIN.game.commonData.id,
      build:{
        ceilIndex:ceil.indexes,
        sector:sector,
        building:building,
      }
    */

    data.build.id = generateId(data.build.building, 5);


    const historyArray = {
      owner:data.player,
      build:data.build,
    };

    this.buildHistory.push(historyArray);

    if(data.build.building != 'road' && data.build.building != 'bridge'){

      const properties = {
        player:this.players[data.player],
        id:data.build.id,
        building:data.build.building,
        ceilIndex:data.build.ceilIndex,
        sector:data.build.sector,
      }

      const factory = new FACTORY(properties);
      this.players[data.player].factoryList.add(factory);

      //дополняем инфу для постройки для хозяина фабрики
      const factoryClientData = {
        id:factory.id,
        building:data.build.building,
        ceilIndex:data.build.ceilIndex,
        sector:data.build.sector,
      };
      this.players[data.player].emit('GAME_buildFactory',factoryClientData);
    };

    this.sendToAll('GAME_applyBuilding', data);
  };

  nextTurn() {
    //сохраняем значение, с которого запустили функцию
    let startedTurnIndex = this.queueNum;
    const that = this;
    //понадобится для автоматического перехода хода и если игрок сам скипнет ход
    let lastTurn;

    //ищет следующего подходящего игрока
    findTurn();

    function findTurn() {
      //просто убираем флаг
      that.turnsPaused = false;

      //меняем очередь
      that.queueNum += 1;
      if (that.queueNum >= that.queue.length) {
        that.queueNum = 0;
      };

      const nextPlayer = that.players[that.queue[that.queueNum]];

      //если функция зациклилась (снова вернулась на того, от кого пришла)
      if (that.queueNum === startedTurnIndex) {
        //если он банкрот или вышел из игры, то тормозим всю функцию
        if (nextPlayer.balance <= 0 || !USERS[nextPlayer.login]) {
          that.turnsPaused = true;
        };
      };
      //сохраняем на ком был ход для setTimeout
      lastTurn = that.queueNum;
      //если у игрока все норм с балансом и он онлайн, то высылаем ход ему и ставим таймаут
      if (nextPlayer.balance > 0 && USERS[nextPlayer.login]) {
        const data = {
          currentTurn: that.queue[that.queueNum],
          turnTime: that.turnTime,
        };
        // отправляем ему все функции для хода(кредит, фермы и тд)
        nextPlayer.turnAction();
        //отправляем всем чей ход
        that.sendToAll('GAME_reciveTurn', data);
        setTimeout(function() {
          //чтобы не сработало, если игрок переключит ход сам
          //потому что если функция nextTurn вызовется еще раз, то изменится that.queueNum, а lastTurn нет
          if (lastTurn === that.queueNum) {
            that.nextTurn();
          };
        }, that.turnTime);
      } else {
        //если баланс 0 или меньше, и ходы не на паузе, то рекурсим функцию чтобы нашел следующего подходящего игрока
        if (!that.turnsPaused) {
          //сет таймаут нужен для ошибки стека
          setTimeout(() => {
            findTurn();
          });
        } else {
          // если пауза, то всем кидаем что копец
          that.sendToAll('GAME_pasedTurn');
          //так же тут можно проверить, если все игроки банкроты, то закрывать игру
        };
      };
    };
  };
  tick() {
    const that = this;
    let allPlayersOff = true;
    for(let player in this.players){
      if(USERS[player]){
        allPlayersOff = false;
        const thisPlayer = this.players[player];
        thisPlayer.turnAction();
      };
    };
    if(!allPlayersOff){
      setTimeout(function() {
        that.tick();
      }, that.tickTime);
    };
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
      if (user.game) {
        //если его очередь ходить
        if (user.game.turnBasedGame) {
          if (user.game.queue[user.game.queueNum] === SOCKETS[socket.id].user) {
            user.game.nextTurn();
          };
        };
      };
      delete USERS[SOCKETS[socket.id].user];
    };
    delete SOCKETS[socket.id];
    console.log('disconnect');
  });



  socket.on('GAME_generated', (gameData) => {
    //происходит, когда сгенерирована карта
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
    const game = new GAME(gameData);
    GAMES[game.id] = game;
    // ---!--- сюда надо вкинуть класс ROOM, чтобы через нее реализовать SOCKET.broadcast;
    ROOMS[gameData.roomID].members.forEach((member) => {
      if (USERS[member]) {
        USERS[member].game = GAMES[game.id];
        USERS[member].socket.emit('GAME_data', gameData);
      };
    });
  });



  socket.on('GAME_choseCredit', (data) => {
      //происходит, когда игрок выбирает себе кредит
    //trigger interface -> game -> credit.js -> accept();
    /*
      data = {
        player:MAIN.userData.login,
        gameID:MAIN.game.commonData.id,
        credit:globalChoosenCredit,
      };
    */

    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/
    //просто баг фикс, чтобы он два раза не выбрал кредит
    if (GAMES[data.gameID].queue.indexOf(data.player) === -1) {
      //тут надо сделать античит по кредитам
      GAMES[data.gameID].players[data.player].applyCredit(data.credit);
      GAMES[data.gameID].queue.push(data.player);
      //если пошаговая игра, то высылаем ходы
      if (GAMES[data.gameID].turnBasedGame) {
        //если это первый игрок в очереди, то отсылаем ему ход
        if (GAMES[data.gameID].queue.length === 1) {
          GAMES[data.gameID].nextTurn();
        };
        //если первый игрок уже проиграл или вышел и игра стала на паузу, а этот только выбрал кредит то чекаем следующий ход
        if(GAMES[data.gameID].turnsPaused){
          GAMES[data.gameID].nextTurn();
        };
      } else {
        //если не пошаговая, то начинаем тики
        GAMES[data.gameID].tick();
      };
    };

    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/
  });



  socket.on('GAME_building', (data) => {
    //происходит, когда игрок хочет что-то построить
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
    if (game) {
      //anticheat
      if (game.players[data.player].balance >= COASTS.buildings[data.build.building]) {
        //если игра пошаговая, то нужно перепроверитьь его ли ход
        if (game.turnBasedGame) {
          //если ходы не на паузе
          if(!game.turnsPaused){
            //чтобы игрок не мог построить вне его хода
            if (game.queue[game.queueNum] === data.player) {
                const cost = COASTS.buildings[data.build.building] * (-1);
                game.players[data.player].changeBalance(cost);
                game.players[data.player].sendBalanceMessage(`Сonstruction of the ${data.build.building}`,cost);
                game.playerBuilding(data);
            };
          };
        } else {
          const cost = COASTS.buildings[data.build.building] * (-1);
          game.players[data.player].changeBalance(cost);
          game.players[data.player].sendBalanceMessage(`Сonstruction of the ${data.build.building}`,cost);
          game.playerBuilding(data);
        };
      };
    };
    /*ДЛЯ НЕСКОЛЬКИХ ИГРОКОВ*/

    /*ДЛЯ ОДНОГО ИГРОКА*/
    // socket.emit('GAME_applyBuilding',data.build);
    /*ДЛЯ ОДНОГО ИГРОКА*/
  });

  socket.on('GAME_factory_applySettings',(data)=>{
    //происходит, когда игрок настраивает фабрику
    //trigger game - interface - factory.js applySettings();
    /*const data = {
      player:MAIN.game.playerData.login,
      gameID:MAIN.game.commonData.id,
      factory:factory.id,
      settings:{
        points:3,
        speed:0,
        salary:0,
        quality:0,
      };
    };*/

    if(GAMES[data.gameID]){
      if(GAMES[data.gameID].players[data.player]){
        if(GAMES[data.gameID].players[data.player].factoryList.list[data.factory]){
          if(GAMES[data.gameID].players[data.player].factoryList.list[data.factory].settingsSetted === false){
              GAMES[data.gameID].players[data.player].factoryList.list[data.factory].setSettings(data.settings);
          };
        };
      };
    };

  });
  socket.on('GAME_endTurn', (data) => {
    // происходит в конце хода
    //trigger game -> functions
    /*const data = {
      player:MAIN.userData.login,
      gameID:MAIN.game.commonData.id,
    };
    */
    const game = GAMES[data.gameID];
    if (game) {
      game.nextTurn();
    };
  })


});
