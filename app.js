const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const DB = require('./modules/db.js');
const COASTS = require('./modules/coasts.js');
const FACTORIES = require('./modules/factory.js');
const MAP_CONFIGS = require('./modules/mapConfigs.js');


http.listen(PORT, '0.0.0.0', () => {
  console.log('Сервер запущен');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

// app.use(express.static(__dirname + '/client'));
app.use('/', express.static(__dirname + '/client'));

function generateId(type, x) {
  if (type === undefined) {
    type = 'u'
  }
  if (x === undefined) {
    x = 5;
  }
  let letters = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnPpQqRrSsTtUuVvWwXxYyZz';

  let numbers = '0123456789';
  let lettersMix, numbersMix;
  for (let i = 0; i < 10; i++) {
    lettersMix += letters;
    numbersMix += numbers;
  }

  let mainArr = lettersMix.split('').concat(numbersMix.split(''));
  let shuffledArr = mainArr.sort(function() {
    return Math.random() - 0.5;
  });
  let id = type + '_';
  for (let i = 0; i <= x; i++) {
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
    turnBasedGame: true,
    turnTime: 60000,
    tickTime:5000,
  },
};
const GAMES = {

};


class ROOM {
  constructor(properties) {
    this.id = generateId('ROOM', 5);
    this.owner = properties.owner;

    this.maxMembers = properties.maxMembers;
    this.turnBasedGame = properties.turnBasedGame;
    this.turnTime = properties.turnTime;
    this.tickTime = properties.tickTime;

    this.members = [];
    this.gameStarted = false;
    this.gameID = null;
    this.ready = false;

  };


  getData() {
    const roomData = {
      id: this.id,
      maxMembers: this.maxMembers,
      members: this.members,
      turnBasedGame: this.turnBasedGame,
      tickTime: this.tickTime / 1000,
      turnTime: this.turnTime / 1000,
      ready: this.ready,
      started: false,
    };
    return roomData;
  };

  sendUpdate() {
    const data = this.getData();

    for (let user in USERS) {
      const thisUser = USERS[user];
      thisUser.sendRoomUpdate(data);
    };

  };

  addPlayer(login) {
    if (this.members.indexOf(login) === -1) {
      this.members.push(login)
    };
    if (USERS[login]) {
      USERS[login].joinRoom(this);
    };

    if (this.members.length === this.maxMembers) {
      this.ready = true;
    };
    this.sendUpdate();
    if (this.members.length === this.maxMembers) {
      this.startGame();
    };
  };
  removePlayer(login) {
    if (this.ready) {
      return;
    };
    if (this.members.indexOf(login) != -1) {
      this.members.splice(this.members.indexOf(login), 1);
      if (this.members.length === 0) {
        this.delete();
      };
    };
    if (USERS[login]) {
      USERS[login].leaveRoom();
    };
    this.sendUpdate();
    this.ready = false;
  };

  delete() {
    for (let user in USERS) {
      const thisUser = USERS[user];
      thisUser.deleteRoom(this.id);
    };
    delete ROOMS[this.id];
  };


  startGame() {
    const game = new GAME(this);
    GAMES[game.id] = game;
    game.generateMap();
    const gameData = game.getData();
    this.members.forEach((member) => {
      if (USERS[member]) {
        USERS[member].game = GAMES[game.id];
        USERS[member].inGame = GAMES[game.id];
        USERS[member].emit('GAME_data', gameData);
      };
    });



    this.delete();
  };
};







function sendToAllRoomsData() {
  const rooms = [];

  for (let room in ROOMS) {
    const thisRoom = ROOMS[room];
    rooms.push(thisRoom.getData());
  };


  for (let user in USERS) {
    const thisUser = USERS[user];
    thisUser.sendAllRoomsData(rooms);
  };

};




class USER {
  constructor(properties) {
    this.inGame = false;
    this.socket = properties.socket;
    this.login = properties.login;
    this.inRoom = false;
  };

  emit(message, data) {
    this.socket.emit(message, data)
  };

  joinRoom(room) {
    this.inRoom = room;
    this.emit('LOBBY_joinedToRoom', room.id);
  };
  leaveRoom(room) {
    this.inRoom = false;
    this.emit('LOBBY_leaveRoom');
  };
  deleteRoom(id) {
    this.emit('LOBBY_deleteRoom', id);
  };
  authTrue() {
    this.emit('LOBBY_authTrue');
    const that = this;
    setTimeout(function() {
      that.sendAllRoomsData();
    }, 250);
  };

  sendAllRoomsData() {
    const rooms = [];

    for (let room in ROOMS) {
      const thisRoom = ROOMS[room];
      rooms.push(thisRoom.getData());
    };

    this.emit('LOBBY_sendRoomsData', rooms);
  };

  sendRoomUpdate(roomData) {
    this.emit('LOBBY_updateRoom', roomData);
  };

  disconnect() {
    if (this.inGame) {
      //если его очередь ходить
      if (this.inGame.turnBasedGame) {
        if (this.inGame.queue[this.inGame.queueNum] === this.login) {
          this.inGame.nextTurn();
        };
      };
    };

    if (this.inRoom) {
      this.inRoom.removePlayer(this.login);
    };
    this.inGame = false;
  };
};


class GAME {
  //Очередь пусть формируется из тех, кто первый выбрал кредит
  constructor(properties) {
    this.id = generateId('Game', 5);
    this.roomID = properties.id;
    this.members = properties.members;
    this.players = {};
    properties.members.forEach((member, i) => {
      const properties = {
        login: member,
        game: this,
      };
      const player = new PLAYER(properties);
      this.players[player.login] = player;
    });


    this.turnBasedGame = properties.turnBasedGame;
    this.turnTime = properties.turnTime;
    this.tickTime = properties.tickTime;
    this.turnsPaused = false;


    this.queue = [];
    this.queueNum = -1;
    this.startedQueque = 0;
    this.turnsPaused = false;
    this.turnId = null;
    this.tickPaused = false;
    this.cities = {};

    this.tickNumber = 0;
    this.circle = 0;

    for (let cityName of MAP_CONFIGS.cities) {
      const city = new CITY({
        name: cityName,
        game: this
      });
      this.cities[cityName] = city;
    };

    //нужно для отправки транспорта, только на стороне сервера
    this.transportMap = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];
    //в массив сохраняется вся история построек в игре
    this.buildHistory = [];

    this.cityMapNames = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ];

    this.trucks = {
      count: COASTS.trucks.count,
      coast: COASTS.trucks.coast,
      all: {},
    };

    this.factoriesCount = {

    };
    for(let factory in FACTORIES){
      this.factoriesCount[factory] = FACTORIES[factory].count;
    };

    console.log(this);

  };

  generateCityMap() {
    let map_index = 0;
    for (let z = 0; z < this.cityMapNames.length; z++) {
      for (let x = 0; x < this.cityMapNames[z].length; x++) {
        if (this.map[map_index] === 'Westown' || this.map[map_index] === 'Northfield' || this.map[map_index] === 'Southcity') {
          this.cityMapNames[z][x] = this.map[map_index];
        };
        map_index++;
      };
    };
  };

  generateMap() {
    const map = [];
    for (let ceilType in MAP_CONFIGS.ceils) {
      for (let count = 0; count < MAP_CONFIGS.ceils[ceilType]; count++) {
        if (ceilType == 'city') {
          map.push(MAP_CONFIGS.cities[count])
        } else {
          map.push(ceilType);
        };
      };
    };
    map.sort(() => Math.random() - 0.5);
    this.map = map;
    this.generateCityMap();
  };

  getData() {
    //game data for user
    const data = {
      commonData: {
        id: this.id,
        mapArray: this.map,
        queue: '',
        turnsPaused: false,
        turnBasedGame: this.turnBasedGame,
        trucks: this.trucks,
        tickTime: this.tickTime,
        members: this.members,
        playerColors: ['#fc4a4a', '#5d59ff', '#4dd14a', '#fff961', '#f366ff'],
        factoriesCount:this.factoriesCount,
      },
    };
    return data;
  };

  sendToAll(message, data) {
    for (let player in this.players) {
      const thisPlayer = this.players[player];
      thisPlayer.emit(message, data);
    };
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
      owner: data.player,
      build: data.build,
    };

    this.buildHistory.push(historyArray);

    if (data.build.building != 'road' && data.build.building != 'bridge') {

      const properties = {
        player: this.players[data.player],
        id: data.build.id,
        building: data.build.building,
        ceilIndex: data.build.ceilIndex,
        sector: data.build.sector,
      }

      const factory = new FACTORY(properties);
      this.players[data.player].factoryList.add(factory);

      //дополняем инфу для постройки для хозяина фабрики
      const factoryClientData = {
        id: factory.id,
        building: data.build.building,
        ceilIndex: data.build.ceilIndex,
        sector: data.build.sector,
        number:this.factoriesCount[data.build.building] + 1,
      };
      this.players[data.player].emit('GAME_buildFactory', factoryClientData);
    };

    this.sendToAll('GAME_applyBuilding', data);
  };

  nextTurn() {
    //сохраняем значение, с которого запустили функцию
    let startedTurnIndex = this.queueNum;
    const random = generateId('Turn_', 4);
    this.turnId = random;
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
        //круг замкнулся
        that.circle += 1;
      };

      const nextPlayer = that.players[that.queue[that.queueNum]];

      //если функция зациклилась (снова вернулась на того, от кого пришла)
      if (that.queueNum === startedTurnIndex) {
        //если он банкрот или вышел из игры, то тормозим всю функцию
        if (nextPlayer.gameOver || !USERS[nextPlayer.login]) {
          that.turnsPaused = true;
        };
      };
      //сохраняем на ком был ход для setTimeout
      lastTurn = that.queueNum;
      //если у игрока все норм с балансом и он онлайн, то высылаем ход ему и ставим таймаут
      if (!nextPlayer.gameOver && USERS[nextPlayer.login]) {
        const data = {
          currentTurn: that.queue[that.queueNum],
          turnTime: that.turnTime,
        };


        //отправляем всем чей ход
        that.sendToAll('GAME_reciveTurn', data);

        // отправляем ему все функции для хода(кредит, фермы и тд)
        nextPlayer.turnAction();
        //обновляем города
        that.updateCities();


        setTimeout(function() {
          //чтобы не сработало, если игрок переключит ход сам
          //потому что если функция nextTurn вызовется еще раз, то изменится that.queueNum, а lastTurn нет
          if (lastTurn === that.queueNum) {
            if (that.turnId === random) {
              that.nextTurn();
            };
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
    for (let player in this.players) {
      if (USERS[player] && !this.players[player].gameOver) {
        allPlayersOff = false;
      };

      const thisPlayer = this.players[player];
      if(!thisPlayer.gameOver){
        thisPlayer.turnAction();
      };
    };
    this.tickNumber += 1;
    if(this.tickNumber % this.members.length === 0){
      this.circle += 1;
    };
    this.updateCities();
    if (!allPlayersOff) {
      setTimeout(function() {
        that.tick();
      }, that.tickTime);
    };
  };
  updateCities() {
    const data = {};
    for (let city in this.cities) {
      const thisCity = this.cities[city];
      thisCity.update();

      data[city] = {};

      for (let res in thisCity.storage) {
        data[city][res] = thisCity.storage[res].line
      };
    };
    this.sendToAll('GAME_city_update', data);
  };
};





class CITY {
  constructor(properties) {
    this.name = properties.name;
    this.game = properties.game;

    this.storage = this.createStorage();

  };
  createStorage() {
    const storage = {};
    const resouresBase = COASTS.resources;
    for (let resource in resouresBase) {
      const thisResource = resouresBase[resource];

      //касается только данного реесурса
      const resStore = {};

      //его линия прогресса
      resStore.line = [];
      for (let i = 0; i < thisResource.sailSpeed; i++) {
        resStore.line.push(0);
      };

      //максимальная цена ресурса
      resStore.maxPrice = thisResource.price;



      //массив цен на данный этап ресурса
      resStore.prices = [];
      resStore.line.forEach((item, i) => {
        //harder city price
        // const discount = (1 - ((i+1)/resStore.line.length)) + (0.10 - 0.10 * (i+1)/resStore.line.length);
        const discount = 1 - ((i + 1) / resStore.line.length);
        let price = Math.round(resStore.maxPrice - resStore.maxPrice * discount);
        if (price < 0) {
          price = 0
        };
        resStore.prices[i] = price;
      });
      storage[resource] = resStore;
    };
    return storage;
  };



  sellResource(resoure) {
    let price = 0;
    const firstFullCeilIndex = this.storage[resoure.name].line.indexOf(1);
    if (firstFullCeilIndex === -1) {
      price = this.storage[resoure.name].prices[this.storage[resoure.name].prices.length - 1];
    } else if (firstFullCeilIndex === 0) {
      price = 0;
    } else {
      price = this.storage[resoure.name].prices[firstFullCeilIndex - 1];
    };

    this.storage[resoure.name].line[0] = 1;

    const newPrice = Math.round(price + price * ((resoure.quality * 15) * 0.01));
    resoure.player.changeBalance(newPrice);
    resoure.player.sendBalanceMessage(`Sale of ${resoure.name}`, newPrice);



    this.sendUpdate();
    resoure.truck.clear();
  };



  update() {
    for (let resourceStore in this.storage) {
      const thisResourceStore = this.storage[resourceStore];
      thisResourceStore.line.pop();
      thisResourceStore.line.unshift(0);
    };
  };

  sendUpdate() {
    const data = {
      name: this.name,
      storage: {},
    }

    for (let res in this.storage) {
      data.storage[res] = this.storage[res].line;
    };
    this.game.sendToAll('GAME_city_updateOne', data)
  };
};

class FACTORY_LIST {
  constructor(player) {
    this.list = {};
    this.player = player;
  };

  add(factory) {
    this.list[factory.id] = factory;
  };

  turn() {
    for (let factory in this.list) {
      const thisFactory = this.list[factory];
      thisFactory.turn();
    };
  };

  sendUpdates() {
    const data = {};
    for (let factory in this.list) {
      const thisFactory = this.list[factory];
      if (thisFactory.settingsSetted) {
        const factoryData = {
          id: thisFactory.id,
          storage: thisFactory.storage,
          productLine: thisFactory.productLine,
        };
        data[thisFactory.id] = factoryData;
      };
    };
    this.player.emit('GAME_factoryList_updates', data);
  };

  calculateClearEarnings(){
    let earnings = 0;
    for (let factory in this.list) {
      const thisFactory = this.list[factory];
      if(thisFactory.settingsSetted){
        const resPriceStock = COASTS.resources[thisFactory.resource].price;
        const clearEarn = Math.round(resPriceStock + resPriceStock * ((thisFactory.quality * 15) * 0.01))  - thisFactory.price;
        earnings+=clearEarn;
      };
    };
    return earnings;
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

    this.storage = FACTORIES[properties.building].storage;
    this.stockSpeed = FACTORIES[properties.building].speed;
    this.quality = 0;
    //этот параметр сработает, когда придет апдейт на фабрику, нужно будет установить настройки фабрики
    //ее параметры скорость, стоймость, качество
    this.settingsSetted = false;
  };

  setSettings(settings) {
    //происходит, когда игрок меняет настройки


    //проверяем на читы хотя вроде все внутри функции и область видимости не пробьешь
    //anticheat
    const points = 4;
    let pointsCounter = 0;
    for (let property in settings) {
      if (property != 'cardUsed') {
        pointsCounter += settings[property];
      };
    };

    if (pointsCounter > points) {
      if (settings.cardUsed === null) {
        return;
      };
    };
    this.quality = settings.quality;

    this.settingsSetted = true;

    this.productLine = [];
    //сначала забиваем стандартом
    for (let i = 0; i < FACTORIES[this.name].speed; i++) {
      this.productLine.push(0);
    };
    //потом отризаем скорости
    for (let i = 0; i < settings.speed; i++) {
      this.productLine.pop();
    };


    //полная цена за все производство
    const prise = FACTORIES[this.name].price

    //каждый salary point сбивает цену производства на 15%
    //сразу добавляем +15% к стоймости, если у игрока зарплаты на 0 прокачаны;

    // const newPrise = prise + (prise*(0.15));
    const newPrise = prise;

    this.price = Math.round(newPrise - (newPrise * (0.15 * settings.salary)));
    this.stepPrice = Math.round(this.price / this.productLine.length);

    this.stockStorage = FACTORIES[this.name].storage;
    this.storage = [];
    for (let i = 0; i < FACTORIES[this.name].storage + settings.storage; i++) {
      this.storage.push(0);
    };



    this.sendNewSettings();
  };

  sendNewSettings() {
    const data = {
      id: this.id,
      name: this.name,
      mining: this.mining,
      resource: this.resource,
      storage: this.storage,
      //надо, чтобы забить на карточке клетки
      stockStorage: this.stockStorage,
      stockSpeed: this.stockSpeed,
      quality: this.quality,
      productLine: this.productLine,
      price: this.price,
      stepPrice: this.stepPrice,
    };
    this.player.emit('GAME_factory_newSettings', data);
  };

  sendUpdates() {
    const updates = {
      factoryID: this.id,
      updates: {
        productLine: this.productLine,
        storage: this.storage,
      },
    };

    this.player.emit('GAME_factory_update', updates);
  };

  turn() {
    if (this.settingsSetted) {
      this.player.balance -= this.stepPrice;
      this.player.sendBalanceMessage(`${this.name.charAt(0).toUpperCase() + this.name.slice(1)} production`, -this.stepPrice);
      //если в storage есть место
      if (this.storage.includes(0)) {
        if (!this.productLine.includes(1)) {
          //если вообще не начато производство
          this.productLine[0] = 1;
        } else {
          //если производтсво кончилось
          if (this.productLine[this.productLine.length - 1] === 1) {
            this.storage.unshift(this.storage.pop());
            this.storage[0] = 1;
            if (this.storage.includes(0)) {
              this.productLine.unshift(this.productLine.pop());
            } else {
              this.productLine.forEach((item, i) => {
                this.productLine[i] = 0;
              });
            };
          } else {
            this.productLine.unshift(this.productLine.pop());
          };
        };
      } else {
        //в хранилище нет места
        this.productLine.forEach((item, i) => {
          this.productLine[i] = 0;
        });
      };
    } else {
      //выслать уведомление по настройке фабрики
    };
  };



  loadResourceToTruck(data) {
    /*

    const data = {
                 game,
                 player,
                 factory,
                 truck,
               };
   */


    if (data.truck.resource === null) {
      if (this.storage[0] === 1) {
        //забираем единицу вначале
        this.storage.shift();
        //вкидываем ноль в конец
        this.storage.push(0);

        //отправляем игроку update фабрики
        this.sendUpdates();

        const resourceProperties = {
          name: this.resource,
          quality: this.quality,
          game: data.game,
          player: data.player,
          factory: data.factory,
          truck: data.truck,
        };

        const resource = new RESOURCE(resourceProperties);
        data.truck.loadResource(resource);
        data.truck.placeTruck(this);
      };
    };



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
      that.player.emit('GAME_creditChanges', data);
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
        this.player.sendBalanceMessage('Credit payment', (-pay));
        send();
      };
    };
  };
};

class PLAYER {
  constructor(properties) {
    this.login = properties.login;
    this.game = properties.game;
    this.balance = 0;
    this.balanceHistory = [];
    this.factoryList = new FACTORY_LIST(this);
    this.trucks = {};
    this.gameOver =false;
  };
  sendBalanceMessage(message, amount) {
    this.balanceHistory.push({
      message,
      amount
    });
    this.emit('GAME_BalanceMessage', {
      message,
      amount,
    });
  };
  applyCredit(credit) {
    credit.player = this;
    this.balance = credit.amount;
    this.credit = new CREDIT(credit);

    const data = {
      amount: credit.amount,
      pays: credit.pays,
      deferment: credit.deferment,
      procent: credit.procent,
    };
    this.emit('GAME_applyCredit', data);
  };
  changeBalance(value) {
    this.balance += value;

    this.emit('GAME_changeBalance', this.balance);
  };
  turnAction() {
    //credit
    if (this.credit) {
      this.credit.turn();

      this.factoryList.turn();
      this.factoryList.sendUpdates();
    };

    //tax
    const taxProcent = Math.floor(this.game.circle/10);
    // console.log('Circle'+this.game.circle)
    // console.log('taxProcent' + taxProcent)
    const clearEarn = this.factoryList.calculateClearEarnings();

    const taxValue = Math.floor(clearEarn * (taxProcent/100));
    this.balance -= taxValue;
    this.emit('GAME_taxValue',{
      value:taxValue,
      procent:taxProcent,
      earn:clearEarn,
    });


    this.sendBalanceMessage('Tax payment', (-taxValue));

    this.emit('GAME_changeBalance', this.balance);

    if(this.balance + clearEarn < 0){
      this.gameOver = true;
      this.emit('GAME_over');
      for(let truck in this.trucks){
        this.trucks[truck].clear();
      };
      return
    };


    this.emit('GAME_turn_action');




  };
  emit(message, data) {
    if (USERS[this.login]) {
      if (USERS[this.login].inGame) {
        USERS[this.login].emit(message, data);
      };
    };
  };
};

class TRUCK {
  constructor(properties) {
    this.id = generateId('Truck', 5);
    this.player = properties.player;
    this.game = properties.game;
    this.truckNumber = properties.truckNumber;
    this.resource = null;
    this.positionIndexes = {};
  };


  loadResource(resource) {
    this.resource = resource;

    const data = {
      player: this.player.login,
      truckID: this.id,
      resoure: {
        name: this.resource.name,
        quality: this.resource.quality,
      },
    };

    this.game.sendToAll('GAME_truck_loaded', data);
  };


  //размешает грузовик на карте
  placeTruck(factory) {
    this.game.transportMap[factory.ceilIndex.z][factory.ceilIndex.x] = 1;
    this.positionIndexes.x = factory.ceilIndex.x;
    this.positionIndexes.z = factory.ceilIndex.z;
    const data = {
      player: this.player.login,
      truckID: this.id,
      place: factory.ceilIndex,
    };
    this.game.sendToAll('GAME_truck_place', data);
  };

  send(data) {
    //если игрок направляется в город
    const lastPoin = data.path[data.path.length - 1];
    let city = null
    if (this.game.cityMapNames[lastPoin.z][lastPoin.x] != 0) {
      city = this.game.cityMapNames[lastPoin.z][lastPoin.x];
    };

    //здесь можно делать проверку на фабрику
    const sendData = {
      truckID: this.id,
      playerMoveToCity: data.playerMoveToCity,
      path: data.path,
    };

    //если вдруг игрок занял
    if (this.game.transportMap[lastPoin.z][lastPoin.x] === 1) {
      return;
    };

    //bug fix не знаю, как он вылетел, но было что когда оттправил грузовик, не отключилось path меню у игрока
    if (this.positionIndexes.z != undefined && this.positionIndexes.x != undefined) {
      this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 0;
      this.positionIndexes.x = lastPoin.x;
      this.positionIndexes.z = lastPoin.z;
      //если едет не в город, то обновляем позиции
      if (city === null) {
        this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 1;
      };
      this.game.sendToAll('GAME_truck_sending', sendData);
    };
  };

  clear() {
    this.resource = null;
    //if player destroy truck
    if (this.game.transportMap[this.positionIndexes.z]) {
      if (this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x]) {
        this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 0;
      };
    };
    this.positionIndexes = {};


    this.game.sendToAll('GAME_truck_clear', this.id);

  };
};


class RESOURCE {
  constructor(properties) {
    this.name = properties.name;
    this.quality = properties.quality;
    this.game = properties.game;
    this.player = properties.player;
    this.factory = properties.factory;
    this.truck = properties.truck;
    this.id = generateId(`Resource_${this.name}`, 5);
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



    const user = new USER({
      socket,
      login: data.login
    })

    SOCKETS[socket.id].user = user;
    USERS[user.login] = user;
    // user.authTrue();





    // socket.emit('auth_true',afterAuthData);

    /*ДЛЯ ОДНОГО ИГРОКА*/
    ROOMS.R_0000000000.owner = data.login;
    ROOMS.R_0000000000.members = [];
    ROOMS.R_0000000000.members.push(data.login);
    /*ДЛЯ ОДНОГО ИГРОКА*/

    // /*БОЛЬШЕ ОДНОГО ИГРОКА*/
    // if (ROOMS.R_0000000000.owner === null) {
    //   ROOMS.R_0000000000.owner = data.login;
    // };
    // ROOMS.R_0000000000.members.push(data.login);
    // /*БОЛЬШЕ ОДНОГО ИГРОКА*/
    //
    if (ROOMS.R_0000000000.members.length === ROOMS.R_0000000000.maxMembers) {

      const ownerSocket = USERS[ROOMS.R_0000000000.owner].socket;

      /* ГЕНЕРАЦИЯ на стороне клиента*/
      // if (ownerSocket) {
      //   //Вызов у хозяина комнаты старта начала генерации игры
      //   ownerSocket.emit('GAME_generate', ROOMS.R_0000000000);
      // };



      //ЭТО ДОЛЖНО БЫТЬ, КОГДА КОМНАТА ГОТОВА

      ROOMS.R_0000000000.members.forEach((member, i) => {
        if (member != ROOMS.R_0000000000.owner) {
          const memberSocket = USERS[member].socket;
          if (memberSocket) {
            //Участникам комнаты уведомление, что комната готова и идет генерация игры
            memberSocket.emit('ROOM_ready');
          };
        };
      });

      /* ГЕНЕРАЦИЯ на стороне сервера*/
      const game = new GAME(ROOMS.R_0000000000);
      GAMES[game.id] = game;
      game.generateMap();
      const gameData = game.getData();
      ROOMS.R_0000000000.members.forEach((member) => {
        if (USERS[member]) {
          USERS[member].game = GAMES[game.id];
          USERS[member].inGame = GAMES[game.id];
          USERS[member].socket.emit('GAME_data', gameData);
        };
      });
    };
  });

  socket.on('disconnect', function() {
    const user = SOCKETS[socket.id].user;
    if (user) {
      user.disconnect();
      delete SOCKETS[socket.id].user;
    };
    delete SOCKETS[socket.id];
    console.log('disconnect');
  });


  socket.on('LOBBY_room_create', (roomData) => {
    const room = new ROOM({
      owner: roomData.owner,
      maxMembers: roomData.maxMembers,
      turnBasedGame: roomData.turnBasedGame,
      turnTime: roomData.turnTime * 1000,
      tickTime: roomData.tickTime * 1000,
    });

    ROOMS[room.id] = room;
    room.addPlayer(roomData.owner);
    sendToAllRoomsData();
  });


  socket.on('LOBBY_userLeaveRoom', (data) => {
    // const data = {
    //   player:MAIN.userData.login,
    //   room:MAIN.userData.inRoom,
    // };

    if (ROOMS[data.room]) {
      ROOMS[data.room].removePlayer(data.player);
    };
  });
  socket.on('LOBBY_userJoinRoom', (data) => {
    // const data = {
    //   player:MAIN.userData.login,
    //   room:MAIN.userData.inRoom,
    // };
    if (ROOMS[data.room]) {
      ROOMS[data.room].addPlayer(data.player);
    };
  });

  //поменял на генерацию со стороны сервера
  // socket.on('GAME_generated', (gameData) => {
  //   //происходит, когда сгенерирована карта
  //   //trigger game -> generation.js -> start()
  //   /*
  //     gameData = {
  //     roomID:R_0000000000,
  //     id:'G_0000000000',
  //     turns:[member1,member2,member3,member4],
  //     mapArray:[mapCeils],
  //
  //   }
  //   */
  //   // ROOMS[gameData.roomID].gameID = gameData.id;
  //   // const game = new GAME(gameData);
  //   // GAMES[game.id] = game;
  //   // gameData.trucks = {
  //   //   count:game.trucks.count,
  //   //   coast:game.trucks.coast
  //   // };
  //   // ---!--- сюда надо вкинуть класс ROOM, чтобы через нее реализовать SOCKET.broadcast;
  //   // ROOMS[gameData.roomID].members.forEach((member) => {
  //   //   if (USERS[member]) {
  //   //     USERS[member].game = GAMES[game.id];
  //   //     USERS[member].socket.emit('GAME_data', gameData);
  //   //   };
  //   // });
  // });



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
        if (GAMES[data.gameID].turnsPaused) {
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
    const game = GAMES[data.gameID];
    if (game) {
      //anticheat
      if (game.players[data.player].balance >= COASTS.buildings[data.build.building]) {

        if (GAMES[data.gameID]) {
          const game = GAMES[data.gameID];
          //если игра пошаговая, то нужно перепроверитьь его ли ход
          if (game.turnBasedGame) {
            //если ходы на паузе
            if (game.turnsPaused) {
              return;
            };
            if (game.queue[game.queueNum] != data.player) {
              return;
            };
          };

          if (game.players[data.player]) {
            const player = game.players[data.player];
            if(!player.gameOver){
              //если это какая-то фабрика
              if(game.factoriesCount[data.build.building]){
                if(game.factoriesCount[data.build.building] > 0){
                  game.factoriesCount[data.build.building] -= 1;
                  const cost = COASTS.buildings[data.build.building] * (-1);
                  player.changeBalance(cost);
                  player.sendBalanceMessage(`Сonstruction of the ${data.build.building}`, cost);
                  game.playerBuilding(data);
                };

              }else{
                //если это дорога и тд, чему счет не ведется
                const cost = COASTS.buildings[data.build.building] * (-1);
                player.changeBalance(cost);
                player.sendBalanceMessage(`Сonstruction of the ${data.build.building}`, cost);
                game.playerBuilding(data);
              };

            };
          };

        };
      };
    };
  });
  socket.on('GAME_factory_applySettings', (data) => {
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

    if (GAMES[data.gameID]) {
      if (GAMES[data.gameID].players[data.player]) {
        if(!GAMES[data.gameID].players[data.player].gameOver){
          if (GAMES[data.gameID].players[data.player].factoryList.list[data.factory]) {
            if (GAMES[data.gameID].players[data.player].factoryList.list[data.factory].settingsSetted === false) {
              GAMES[data.gameID].players[data.player].factoryList.list[data.factory].setSettings(data.settings);
            };
          };
        };
      };
    };

  });



  socket.on('GAME_truck_buy', (data) => {
    //происходит, когда игрок покупает грузовик
    //trigger game => interface => truck => buyTruck

    if (GAMES[data.gameID]) {
      const game = GAMES[data.gameID];
      //если игра пошаговая, то нужно перепроверитьь его ли ход
      if (game.turnBasedGame) {
        //если ходы на паузе
        if (game.turnsPaused) {
          return;
        };
        if (game.queue[game.queueNum] != data.player) {
          return;
        };
      };


      if (GAMES[data.gameID].players[data.player]) {
        const player = GAMES[data.gameID].players[data.player];

        if (player.balance >= COASTS.trucks.coast && !player.gameOver) {
          if (game.trucks.count > 0) {
            game.trucks.count -= 1;
            player.changeBalance(-COASTS.trucks.coast);
            player.sendBalanceMessage('Buying a truck', -COASTS.trucks.coast);

            const properties = {
              game,
              player,
              truckNumber: game.trucks.count + 1,
            };

            const truck = new TRUCK(properties);
            game.trucks.all[truck.id] = truck;
            player.trucks[truck.id] = truck;

            const sendData = {
              player: data.player,
              truckID: truck.id,
              trucksCount: game.trucks.count,
              truckNumber: game.trucks.count + 1,
            };
            game.sendToAll('GAME_truck_playerBoughtTruck', sendData);
          };
        };
      };
    };

  });

  socket.on('GAME_truck_load', (data) => {
    //происходит, когда игрок загружает грузовик
    //trigger interface -> game -> truck -> sendTruck();
    /*
      const data = {
        player:MAIN.game.data.playerData.login,
        gameID:MAIN.game.data.commonData.id,
        factoryID:factory.id,
        truckID:truck.id,
      };
    */

    if (GAMES[data.gameID]) {
      const game = GAMES[data.gameID];
      //если игра пошаговая, то нужно перепроверитьь его ли ход
      if (game.turnBasedGame) {
        //если ходы на паузе
        if (game.turnsPaused) {
          return;
        };
        if (game.queue[game.queueNum] != data.player) {
          return;
        };
      };

      if (game.players[data.player]) {
        const player = game.players[data.player];
        if(!player.gameOver){
          if (player.factoryList.list[data.factoryID]) {
            const factory = player.factoryList.list[data.factoryID];
            if (player.trucks[data.truckID]) {
              const truck = player.trucks[data.truckID];
              //проверяем, не занята ли клетка
              if (game.transportMap[factory.ceilIndex.z][factory.ceilIndex.x] === 0) {
                const nData = {
                  game,
                  player,
                  factory,
                  truck,
                };
                factory.loadResourceToTruck(nData);
              } else {
                //если клетка на карте занята другим транспортом
                const indexes = {
                  z: factory.ceilIndex.z,
                  x: factory.ceilIndex.x,
                };
                player.emit('GAME_truck_ceilFull', indexes);
              };
            };
          };
        };
      };
    };
  });



  socket.on('GAME_truck_send', (data) => {
    //происходит, когда игрок высылает грузовик
    //trigger interface -> game -> path.js -> showSendButton() -> send();

    /*
    const data = {
      gameID:MAIN.game.data.commonData.id,
      truckID:data.truck.id,
      path:pathServerData,
    };
    */


    if (GAMES[data.gameID]) {
      const game = GAMES[data.gameID];
      if (game.trucks.all[data.truckID]) {
        const truck = game.trucks.all[data.truckID];
        if(!truck.player.gameOver){
        //если игра пошаговая, то нужно перепроверитьь его ли ход
          if (game.turnBasedGame) {
            //если ходы на паузе
            if (game.turnsPaused) {
              return;
            };
            if (game.queue[game.queueNum] != truck.player.login) {
              return;
            };
          };

          truck.send(data);
        };
      };

    };

  });

  socket.on('GAME_truck_destroy', (data) => {
    //происходит, когда игрок выкидывает товар из грузовика
    //trigger interface -> game -> gameObjects.js -> truck.js -> destroyRequest;

    /*
    const data = {
      gameID:MAIN.game.data.commonData.id,
      truckID:data.truck.id,
      path:pathServerData,
    };
    */


    if (GAMES[data.gameID]) {
      const game = GAMES[data.gameID];
      if (game.trucks.all[data.truckID]) {
        const truck = game.trucks.all[data.truckID];
        truck.clear();
      };
    };

  });




  socket.on('GAME_resource_sell', (data) => {
    if (GAMES[data.gameID]) {
      const game = GAMES[data.gameID];

      if (game.players[data.player]) {
        const player = game.players[data.player];
        if(!player.gameOver){
          if (game.trucks.all[data.truckID]) {
            const truck = game.trucks.all[data.truckID];

            if (game.cities[data.city]) {
              const city = game.cities[data.city];
              if (truck.resource) {
                city.sellResource(truck.resource);
              };
            };
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
