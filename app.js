const express = require('express');
const app = express();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 3000;
const DB = require('./modules/db.js');
const COASTS = require('./modules/coasts.js');
const FACTORIES = require('./modules/factory.js');
const MAP_CONFIGS = require('./modules/mapConfigs.js');
const CREDITS = require('./modules/credits.js');
const bcrypt = require('bcryptjs');



//сразу делает игру
const DEV_GAMEPLAY = true;

if (DEV_GAMEPLAY) {
  http.listen(PORT, '0.0.0.0', () => {
    console.log('Сервер запущен');
  });

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
  });

  app.use('/', express.static(__dirname + '/client'));

} else {
  DB.connectToDB().then((result) => {
    console.log(result);

    http.listen(PORT, '0.0.0.0', () => {
      console.log('Сервер запущен');
    });

    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/client/index.html');
    });

    app.use('/', express.static(__dirname + '/client'));
  });
};








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
  // R_0000000000: {
  //   id: 'R_0000000000',
  //   gameID: null,
  //   owner: null,
  //   maxMembers:1,
  //   members: [],
  //   started: false,
  //   turnBasedGame: true,
  //   turnTime: 180000,
  //   tickTime:45000,
  //   cityEconomy:true,
  // },
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
    this.cityEconomy = properties.cityEconomy;


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
      cityEconomy: this.cityEconomy,
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


if (DEV_GAMEPLAY) {
  ROOMS.R_0000000000 = new ROOM({
    id: 'R_0000000000',
    gameID: null,
    owner: null,
    maxMembers: 1,
    members: [],
    started: false,
    turnBasedGame: true,
    turnTime: 180000,
    tickTime: 15000,
    cityEconomy: true,
  });
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


function NEW_USER(data) {
  this.login = data.login;
  this.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync(10));
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
    const data = {
      login: this.login,
    }
    this.emit('AUTH_true', data);
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
    this.cityEconomy = properties.cityEconomy;
    this.turnsPaused = false;

    this.queue = [];
    this.queueNum = -1;
    this.startedQueque = 0;
    this.turnsPaused = false;
    this.turnId = null;
    this.tickPaused = false;
    this.cities = {};

    this.tickStarted = false;
    this.tickNumber = 0;
    this.circle = 0;

    for (let cityName of MAP_CONFIGS.cities) {
      const city = new CITY({
        name: cityName,
        game: this,
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

    this.factoriesCount = {};
    for (let factory in FACTORIES) {
      this.factoriesCount[factory] = FACTORIES[factory].count;
    };

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

  payFromCities(value) {
    const averageValue = Math.floor(value / 3);
    for (let city in this.cities) {
      const thisCity = this.cities[city];
      thisCity.balance -= averageValue;
      thisCity.sendUpdate();
    };
  };
  payToCities(value) {
    const averageValue = Math.floor(value / 3);
    for (let city in this.cities) {
      const thisCity = this.cities[city];
      thisCity.balance += averageValue;
      thisCity.sendUpdate();
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
        cityEconomy: this.cityEconomy,
        cityEconomyPrice: this.cities.Westown.balance,
        //#bfbfbf серый для скринов
        //#fc4a4a красный для игрока
        playerColors: ['#bfbfbf', '#5d59ff', '#4dd14a', '#fff961', '#f366ff', '#67fff6'],
        factoriesCount: this.factoriesCount,
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
        game: this,
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
        number: this.factoriesCount[data.build.building] + 1,
        product: factory.product,
        category: factory.category,
      };

      this.players[data.player].emit('GAME_buildFactory', factoryClientData);
    };

    this.sendToAll('GAME_applyBuilding', data);
  };
  getAveragePrices() {
    const prices = {};
    for (let product in COASTS.products) {
      let averagePrice = 0;
      for (let city in this.cities) {
        const thisCity = this.cities[city];
        //так работает getProductPrice
        const prod = {
          name: product,
        };
        averagePrice += thisCity.getProductPrice(prod);
      };
      prices[product] = Math.round(averagePrice / Object.keys(this.cities).length);
    };
    return prices;
  };
  nextTurn() {
    //для подсчета объема продукции у игрока
    const averagePrices = this.getAveragePrices();



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

        nextPlayer.turnAction({
          averagePrices: averagePrices,
        });
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
    const averagePrices = this.getAveragePrices();


    const that = this;
    let allPlayersOff = true;
    for (let player in this.players) {
      if (USERS[player] && !this.players[player].gameOver) {
        allPlayersOff = false;
      };

      const thisPlayer = this.players[player];
      if (!thisPlayer.gameOver) {
        thisPlayer.turnAction({
          averagePrices: averagePrices,
        });
      };
    };
    this.tickNumber += 1;

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
      for (let prod in thisCity.storage) {
        data[city][prod] = thisCity.storage[prod].line
      };
      data[city].balance = thisCity.balance;
    };
    this.sendToAll('GAME_city_update', data);
  };
};

class CITY {
  constructor(properties) {
    this.name = properties.name;
    this.game = properties.game;
    this.balance = properties.game.cityEconomy ? 300000 : null,

      this.storage = this.createStorage();

  };
  createStorage() {
    const storage = {};
    const productBase = COASTS.products;
    for (let product in productBase) {
      const thisProduct = productBase[product];

      //касается только данного реесурса
      const prodStore = {};

      //его линия прогресса
      prodStore.line = [];
      for (let i = 0; i < thisProduct.sailSpeed; i++) {
        prodStore.line.push(0);
      };

      //максимальная цена ресурса
      prodStore.maxPrice = thisProduct.price;



      //массив цен на данный этап ресурса
      prodStore.prices = [];
      prodStore.line.forEach((item, i) => {
        //harder city price
        // const discount = (1 - ((i+1)/resStore.line.length)) + (0.10 - 0.10 * (i+1)/resStore.line.length);
        const discount = 1 - ((i + 1) / prodStore.line.length);
        let price = Math.round(prodStore.maxPrice - prodStore.maxPrice * discount);
        if (price < 0) {
          price = 0
        };
        prodStore.prices[i] = price;
      });
      storage[product] = prodStore;
    };
    return storage;
  };

  getProductPrice(product) {
    let price = 0;
    const firstFullCeilIndex = this.storage[product.name].line.indexOf(1);
    if (firstFullCeilIndex === -1) {
      price = this.storage[product.name].prices[this.storage[product.name].prices.length - 1];
    } else if (firstFullCeilIndex === 0) {
      price = 0;
    } else {
      price = this.storage[product.name].prices[firstFullCeilIndex - 1];
    };
    if (this.balance != null) {
      if (price >= this.balance) {
        return this.balance;
      };
    };
    return price;
  };

  unloadTruck(truck) {
    const product = truck.product;
    let price = this.getProductPrice(product);

    this.storage[product.name].line[0] = 1;

    let newPrice = Math.round(price + price * ((product.quality * 15) * 0.01));

    if (this.balance != null) {
      if (newPrice >= this.balance) {
        newPrice = this.balance;
      };
      this.balance -= newPrice;
    };


    product.player.changeBalance(newPrice);
    product.player.sendBalanceMessage(`Sale of ${product.name}`, newPrice);

    this.sendUpdate();
    truck.clear();
  };



  update() {
    for (let productStore in this.storage) {
      const thisProductStore = this.storage[productStore];
      thisProductStore.line.pop();
      thisProductStore.line.unshift(0);
    };
  };

  sendUpdate() {
    const data = {
      name: this.name,
      storage: {},
      balance: this.balance,
    };

    for (let prod in this.storage) {
      data.storage[prod] = this.storage[prod].line;
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
        const factoryData = thisFactory.getUpdates();

        data[thisFactory.id] = factoryData;
      };
    };
    this.player.emit('GAME_factoryList_updates', data);
  };

  calculateClearEarnings() {
    let earnings = 0;
    for (let factory in this.list) {
      const thisFactory = this.list[factory];
      if (thisFactory.settingsSetted) {


        if (thisFactory.category === 'mining') {
          const prodPriceStock = COASTS.products[thisFactory.product].price;
          const clearEarn = Math.round(prodPriceStock + prodPriceStock * ((thisFactory.quality * 15) * 0.01)) - thisFactory.price;
          earnings += clearEarn;
        } else if (thisFactory.category === 'mining') {
          let allProductSum = 0;
          thisFactory.products.forEach((product) => {
            // const coast =
          });

        };

      };
    };
    return earnings;
  };

  calculateProductsWorth(averagePrices) {
    // averagePrices:{
    //   sand: 3900,
    //   water: 9700,
    //   wood: 17400,
    //   steel: 27300,
    //   oil: 21000,
    //   gold: 59500,
    //   petrol: 18600,
    //   plastic: 18600,
    //   paints: 18600
    // },
    let products = [];
    for (let factory in this.list) {
      const thisFactory = this.list[factory];
      products = products.concat(thisFactory.getAllProducts());
    };

    for (let truck in this.player.trucks) {
      const thisTruck = this.player.trucks[truck];
      products = products.concat(thisTruck.getProductPriceData());
    };


    let sum = 0;
    products.forEach((prod, i) => {
      const price = averagePrices[prod.name];
      sum += price + Math.round(price * 0.15 * prod.quality);
    });
    return sum;
  };

};

class FACTORY {
  constructor(properties) {
    this.game = properties.game;
    this.player = properties.player;

    this.id = properties.id;
    this.name = properties.building;

    this.ceilIndex = properties.ceilIndex;
    this.sector = properties.sector;

    //этот параметр сработает, когда придет апдейт на фабрику, нужно будет установить настройки фабрики
    //ее параметры скорость, стоймость, качество
    this.settingsSetted = false;



    //завод добывает ресурсы или перерабатывает
    this.category = FACTORIES[properties.building].category;


    this.storage = FACTORIES[properties.building].storage;
    this.stockSpeed = FACTORIES[properties.building].speed;
    this.paused = false;



    if (this.category === 'mining') {
      this.quality = 0;
      this.product = FACTORIES[properties.building].product;
      this.productInProcess = null;
      this.productSelected = FACTORIES[properties.building].product;

    } else if (this.category === 'factory') {
      this.products = FACTORIES[properties.building].products;
      this.downtimeCost = FACTORIES[properties.building].downtimeCost;
      this.rawStorage = {};
      this.products.forEach((product) => {
        product.raw.forEach((raw) => {
          this.rawStorage[raw] = null;
        });
      });
      this.productSelected = null;
      this.productInProcess = null;
    };


  };

  setSettings(settings) {
    const points = 4
    if (this.category === 'mining') {

      //проверяем на читы хотя вроде все внутри функции и область видимости не пробьешь
      //anticheat
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
      this.qualityPoints = settings.quality;

      this.settingsSetted = true;

      this.productLine = [];
      //сначала забиваем стандартом
      for (let i = 0; i < FACTORIES[this.name].speed; i++) {
        this.productLine.push(0);
      };
      //потом отрезаем скорости
      for (let i = 0; i < settings.speed; i++) {
        this.productLine.pop();
      };
      this.speedPoints = settings.speed;


      //полная цена за все производство
      const prise = FACTORIES[this.name].price

      //каждый salary point сбивает цену производства на 15%
      //сразу добавляем +15% к стоймости, если у игрока зарплаты на 0 прокачаны;

      // const newPrise = prise + (prise*(0.15));
      const newPrise = prise;

      this.price = Math.round(newPrise - (newPrise * (0.15 * settings.salary)));
      this.stepPrice = Math.round(this.price / this.productLine.length);
      this.salaryPoints = settings.salary;


      this.stockStorage = FACTORIES[this.name].storage;
      this.storage = [];
      for (let i = 0; i < FACTORIES[this.name].storage + settings.storage; i++) {
        this.storage.push(null);
      };
      this.storagePoints = settings.storage;


      //надо для переназначения настроек фабрики
      this.productInProcess = null;
      this.productSelected = FACTORIES[this.name].product;

      this.sendNewSettings();

    };
    //происходит, когда игрок меняет настройки

    if (this.category === 'factory') {
      //проверяем на читы хотя вроде все внутри функции и область видимости не пробьешь
      //anticheat

      //speed
      //low salary
      //storage
      //volume
      //!!! quality будет браться от raw ресурса

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

      this.settingsSetted = true;

      this.productLine = [];
      //сначала забиваем стандартом
      for (let i = 0; i < FACTORIES[this.name].speed; i++) {
        this.productLine.push(0);
      };
      //потом отрезаем скорости
      for (let i = 0; i < settings.speed; i++) {
        this.productLine.pop();
      };

      this.speedPoints = settings.speed;

      //каждый salary point сбивает цену производства на 15%
      this.salaryPoints = settings.salary;


      // this.price = Math.round(newPrise - (newPrise * (0.15 * settings.salary)));
      // this.stepPrice = Math.round(this.price / this.productLine.length);

      this.stockStorage = FACTORIES[this.name].storage;
      this.storage = [];
      for (let i = 0; i < FACTORIES[this.name].storage + settings.storage; i++) {
        //null потому что могут быть разные ресурсы на складе
        this.storage.push(null);
      };
      this.storagePoints = settings.storage;


      this.volumePoints = settings.volume;


      //надо для переназначения настроек фабрики
      this.productInProcess = null;
      this.productSelected = null;
      this.rawStorage = {};
      this.products.forEach((product) => {
        product.raw.forEach((raw) => {
          this.rawStorage[raw] = null;
        });
      });

      this.sendNewSettings();

    };

  };

  sendNewSettings() {
    let data = {};
    if (this.category === 'mining') {
      data = {
        id: this.id,
        name: this.name,
        product: this.product,
        storage: this.storage,
        //надо, чтобы забить на карточке клетки
        stockStorage: this.stockStorage,
        stockSpeed: this.stockSpeed,
        quality: this.quality,
        salary: this.salaryPoints,
        productLine: this.productLine,
        price: this.price,
        stepPrice: this.stepPrice,

        productInProcess: this.productInProcess,
        speedPoints: this.speedPoints,
        salaryPoints: this.salaryPoints,
        qualityPoints: this.qualityPoints,
        storagePoints: this.storagePoints,
      };
    } else if (this.category === 'factory') {
      data = {
        id: this.id,
        name: this.name,
        products: this.products,
        storage: this.storage,
        //надо, чтобы забить на карточке клетки
        productLine: this.productLine,
        stockStorage: this.stockStorage,
        stockSpeed: this.stockSpeed,
        salary: this.salaryPoints,
        productSelected: this.productSelected,
        productInProcess: this.productInProcess,
        rawStorage: this.rawStorage,


        speedPoints: this.speedPoints,
        salaryPoints: this.salaryPoints,
        volumePoints: this.volumePoints,
        storagePoints: this.storagePoints,
      };
    };

    this.player.emit('GAME_factory_newSettings', data);
  };

  getUpdates() {

    const updates = {
      id: this.id,
      productSelected: this.productSelected,
      productInProcess: this.productInProcess ? this.productInProcess.getData() : null,
      productLine: this.productLine,
      storage: [],
      paused: this.paused,
    };

    for (let i = 0; i < this.storage.length; i++) {
      if (this.storage[i]) {
        updates.storage.push(this.storage[i].getData());
      } else {
        updates.storage.push(null);
      };
    };


    if (this.category === 'factory') {
      updates.rawStorage = {};
      for (let product in this.rawStorage) {
        const thisProduct = this.rawStorage[product]
        if (thisProduct) {
          updates.rawStorage[product] = thisProduct.getData();
        } else {
          updates.rawStorage[product] = null;
        }
      };
    };


    return updates;
  };

  sendUpdates() {
    this.player.emit('GAME_factory_update', this.getUpdates());
  };

  turn(auto) {
    //auto значит, что был загружен в фабрику ресурс и если не все ресурсы собратны, то не надо еще раз
    //с игрока снимать деньги за содержание фабрики
    if (this.category === 'mining') {

      if (this.settingsSetted) {
        if (this.paused) {
          if (this.game.cityEconomy) {
            this.game.payToCities(Math.floor(this.stepPrice / 2));
          };
          this.player.balance -= Math.floor(this.stepPrice / 2);
          this.player.sendBalanceMessage(`Maintenance ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -Math.floor(this.stepPrice / 2));
          this.productLine.forEach((item, i) => {
            this.productLine[i] = 0;
          });
          return;
        };
        //если в storage есть место
        if (this.storage.includes(null)) {
          if (!this.productLine.includes(1)) {
            //если вообще не начато производство
            if (!this.productInProcess) {
              this.productInProcess = new PRODUCT({
                game: this.game,
                factory: this,
                player: this.player,

                name: this.productSelected,
                quality: this.qualityPoints,
              });
            };
            if (this.game.cityEconomy) {
              this.game.payToCities(this.stepPrice);
            };
            this.player.balance -= this.stepPrice;
            this.player.sendBalanceMessage(`Production on ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -this.stepPrice);
            this.productLine[0] = 1;
          } else {
            //если производтсво кончилось
            if (this.productLine[this.productLine.length - 1] === 1) {
              const emptySpace = this.storage.indexOf(null);
              if (emptySpace != -1) {
                this.storage[emptySpace] = this.productInProcess;
              };
              this.productInProcess = null;

              if (this.storage.includes(0)) {
                this.productLine.unshift(this.productLine.pop());
              } else {
                this.productLine.forEach((item, i) => {
                  this.productLine[i] = 0;
                });
              };

              this.turn();
            } else {
              if (this.game.cityEconomy) {
                this.game.payToCities(this.stepPrice);
              };
              this.player.balance -= this.stepPrice;
              this.player.sendBalanceMessage(`Production on ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -this.stepPrice);
              this.productLine.unshift(this.productLine.pop());
            };
          };
        } else {
          //в хранилище нет места
          if (this.game.cityEconomy) {
            this.game.payToCities(Math.floor(this.stepPrice / 2));
          };
          this.player.balance -= Math.floor(this.stepPrice / 2);
          this.player.sendBalanceMessage(`Maintenance ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -Math.floor(this.stepPrice / 2));
          this.productLine.forEach((item, i) => {
            this.productLine[i] = 0;
          });
        };
      } else {
        //выслать уведомление по настройке фабрики
      };
    };


    if (this.category === 'factory') {

      //если продукт выбран
      if (this.productSelected) {
        if (this.paused) {
          if (this.game.cityEconomy) {
            this.game.payToCities(this.downtimeCost);
          };
          this.player.balance -= this.downtimeCost;
          this.player.sendBalanceMessage(`Maintenance ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -this.downtimeCost);
          this.productLine.forEach((item, i) => {
            this.productLine[i] = 0;
          });
          return;
        };
        //если уже какой-то продукт производится
        if (this.productInProcess) {
          //1. если это последний этап производства
          if (this.productLine[this.productLine.length - 1] === 1) {
            //скидываем продукты на склад
            //0. очищаем productLine
            this.productLine[this.productLine.length - 1] = 0;
            //1. ищем стандары продукта
            const productConfigs = this.products.find((product) => {
              if (product.name === this.productInProcess.name) {
                return product;
              };
            });

            //2. добавляем объем производства на фабрике к стандартному
            let productionVolume = productConfigs.productionVolume + this.volumePoints;

            //3. и запихиваем клоны ресурса во все свободные места на складе

            this.storage.forEach((place, i) => {
              if (place === null) {
                if (productionVolume > 0) {
                  productionVolume--;
                  this.storage[i] = this.productInProcess.clone();
                };
              };
            });

            //4. очищаем продукт в процессе
            this.productInProcess = null;

            //5.запускаем функцию еще раз
            this.turn();
          } else {
            //проводим ход
            this.productLine.unshift(this.productLine.pop());
            //считаем, сколько денег должен
            const productConfigs = this.products.find((product) => {
              if (product.name === this.productInProcess.name) {
                return product;
              };
            });

            const productionPrice = Math.round(productConfigs.price - (productConfigs.price * (0.15 * this.salaryPoints)));
            if (this.game.cityEconomy) {
              this.game.payToCities(Math.floor(productionPrice / (this.stockSpeed - this.speedPoints)));
            };
            this.player.balance -= Math.floor(productionPrice / (this.stockSpeed - this.speedPoints));
            this.player.sendBalanceMessage(`Production on ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -Math.floor(productionPrice / (this.stockSpeed - this.speedPoints)));
          };
        } else {
          //если не начато производство продукта
          //0. проверяем, есть ли вообще такой продукт на фабрике
          //0.1  находим желаемый продукт
          const productConfigs = this.products.find((product) => {
            if (product.name === this.productSelected) {
              return product;
            };
          });

          //0.2 если undefined то выходим
          if (!productConfigs) {
            return;
          };

          //1. проверяем, есть ли все сырье для этого продукта
          //1.2. смотрим есть ли на rawStorage нужные продукты
          //изначально ставим, что у нас есть все продукты (потому что из forEach return не срабатывает)
          let allProduct = true;
          productConfigs.raw.forEach((rawProductName, i) => {
            //если хоть одного продукта не хватает
            if (!this.rawStorage[rawProductName]) {
              allProduct = false;
            };
          });


          //2. если все продукты есть
          if (allProduct) {
            //2.1 создаем массив сырья, чтобы посчитать качество будущего продукта
            const raw = [];

            productConfigs.raw.forEach((rawProductName, i) => {
              //2.4 добавляем в массив нужных продуктов
              raw.push(this.rawStorage[rawProductName]);
              //2.3 удаляем его со склада
              this.rawStorage[rawProductName] = null;
            });

            //3. считаем качество будущего продукта
            function calculateQuality() {
              // let sum = 0;
              // raw.forEach((product) => {
              //   sum += product.quality;
              // });
              // return Math.floor(sum/raw.length);

              const sum = raw.reduce(function(accumulator, currentValue) {
                return accumulator + currentValue.quality
              }, 0);
              return Math.floor(sum / raw.length);
            };

            let productQuality = calculateQuality();

            //4. создаем нужный продукт
            const product = new PRODUCT({
              game: this.game,
              player: this.player,
              factory: this,

              name: productConfigs.name,
              quality: productQuality,
            });

            this.productInProcess = product;

            //5. начинаем производство
            this.productLine[0] = 1;
          };
        };

      } else {
        if (this.game.cityEconomy) {
          this.game.payToCities(this.downtimeCost);
        };
        this.player.balance -= this.downtimeCost;
        this.player.sendBalanceMessage(`Maintenance ${this.name.charAt(0).toUpperCase() + this.name.slice(1)}`, -this.downtimeCost);
      };
    };
  };

  sendProduct(data) {
    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   storageIndex:index,
    // };
    data.factory = this;
    if (this.storage[data.storageIndex]) {
      if (this.player.trucks[data.truckID]) {
        this.player.trucks[data.truckID].loadProduct(this.storage[data.storageIndex], data);
        this.storage[data.storageIndex] = null;
        this.sendUpdates();
      };
    };

  };

  sendRawProduct(data) {
    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   product:,
    // };
    data.factory = this;
    if (this.rawStorage[data.product]) {
      if (this.player.trucks[data.truckID]) {
        this.player.trucks[data.truckID].loadProduct(this.rawStorage[data.product], data);
        this.rawStorage[data.product] = null;
        this.sendUpdates();
      };
    };

  };

  unloadTruck(truck) {
    if (this.category === 'factory') {

      if (truck.product.name in this.rawStorage) {
        this.rawStorage[truck.product.name] = truck.product;
        this.rawStorage[truck.product.name].factory = this;
      };

      truck.clear();
      if(this.productInProcess === null){
        this.turn(true);
      };
      this.sendUpdates();
    };
    // let price = 0;
    // const product = truck.product;
    // const firstFullCeilIndex = this.storage[product.name].line.indexOf(1);
    // if (firstFullCeilIndex === -1) {
    //   price = this.storage[product.name].prices[this.storage[product.name].prices.length - 1];
    // } else if (firstFullCeilIndex === 0) {
    //   price = 0;
    // } else {
    //   price = this.storage[product.name].prices[firstFullCeilIndex - 1];
    // };
    //
    // this.storage[product.name].line[0] = 1;
    //
    // const newPrice = Math.round(price + price * ((product.quality * 15) * 0.01));
    // product.player.changeBalance(newPrice);
    // product.player.sendBalanceMessage(`Sale of ${product.name}`, newPrice);


  };


  setProductSelected(data) {

    this.products.find((product) => {
      if (product.name === data.product) {
        this.productSelected = data.product;
        return;
      };
    });

    this.turn(true);

    this.sendUpdates();

  };

  getAllProducts() {
    if (this.settingsSetted) {
      const products = [];
      if (this.productInProcess) {
        products.push({
          name: this.productInProcess.name,
          quality: this.productInProcess.quality,
        });
      };
      this.storage.forEach((prod, i) => {
        if (prod) {
          products.push({
            name: prod.name,
            quality: prod.quality,
          });
        };
      });
      if (this.category === 'factory') {
        if (this.productInProcess) {
          //тк на перерабатывающих может производится сразу несколько ресурсов
          const productSettings = this.products.find((prod) => {
            if (prod.name === this.productInProcess.name) {
              return prod;
            };
          });
          for (let i = 0; i < ((productSettings.productionVolume + this.volumePoints) - 1); i++) {
            products.push({
              name: this.productInProcess.name,
              quality: this.productInProcess.quality,
            });
          };
        };

        for (let prodName in this.rawStorage) {
          const thisProduct = this.rawStorage[prodName];
          if (thisProduct) {
            products.push({
              name: thisProduct.name,
              quality: thisProduct.quality,
            });
          };
        };
      };
      return products;
    } else {
      return [];
    };

  };



};


class CREDIT {
  constructor(properties) {
    this.player = properties.player;
    const creditName = properties.name;
    this.game = properties.game;
    this.amount = CREDITS[creditName].amount;
    if (this.game.cityEconomy) {
      this.game.payFromCities(this.amount);
    };
    this.paysParts = CREDITS[creditName].pays;
    this.pays = CREDITS[creditName].pays;
    this.deferment = CREDITS[creditName].deferment;
    this.procent = CREDITS[creditName].procent;
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
    this.gameOver = false;
    this.productsWorth = 0;
    this.lastStepProfit = 0;
  };
  sendBalanceMessage(message, amount) {
    this.balanceHistory.push({
      message,
      amount
    });
    if (amount > 0) {
      this.lastStepProfit += amount;
    };
    this.emit('GAME_BalanceMessage', {
      message,
      amount,
    });
  };
  applyCredit(creditName) {
    const credit = {
      name: creditName,
      game: this.game,
    };
    credit.player = this;

    this.credit = new CREDIT(credit);
    this.balance = this.credit.amount;

    const data = {};
    data.amount = this.credit.amount;
    data.pays = this.credit.pays;
    data.deferment = this.credit.deferment;
    data.procent = this.credit.procent;
    data.creditName = creditName;
    this.emit('GAME_applyCredit', data);
  };
  changeBalance(value) {
    this.balance += value;

    this.emit('GAME_changeBalance', this.balance);
  };
  turnAction(data) {
    /*
    data = {
      averagePrices:{
        sand: 3900,
        water: 9700,
        wood: 17400,
        steel: 27300,
        oil: 21000,
        gold: 59500,
        petrol: 18600,
        plastic: 18600,
        paints: 18600
      },
    };



    */
    //отправляем пустое сообщения для balanceHistory
    this.sendBalanceMessage(null);
    //credit
    if (this.credit) {
      this.credit.turn();
      this.factoryList.turn();
      this.factoryList.sendUpdates();
      //ресурсы в грузовиках считаются там же
      this.productsWorth = this.factoryList.calculateProductsWorth(data.averagePrices);
      this.taxPay();
    };


    this.emit('GAME_changeBalance', this.balance);

    if (this.balance + this.productsWorth < 0) {
      this.gameOver = true;
      this.emit('GAME_over');
      for (let truck in this.trucks) {
        this.trucks[truck].clear();
      };
      if (this.game.turnBasedGame) {
        this.game.nextTurn();
      };
      return;
    };


    this.emit('GAME_turn_action');




  };

  taxPay() {
    // //tax
    //
    let taxProcent;
    if (this.game.turnBasedGame) {
      taxProcent = Math.floor(this.game.circle / 10);
    } else {
      taxProcent = Math.floor(this.game.tickNumber / 10);
    };
    const taxValue = Math.floor(this.lastStepProfit * (taxProcent / 100));
    this.lastStepProfit = 0;
    this.balance -= taxValue;
    this.emit('GAME_taxValue', {
      value: taxValue,
      procent: taxProcent,
    });
    if (this.game.cityEconomy) {
      this.game.payToCities(taxValue);
    };

    this.sendBalanceMessage('Tax payment', (-taxValue));

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
    this.game = properties.game;
    this.player = properties.player;

    this.id = generateId('Truck', 5);


    this.truckNumber = properties.truckNumber;
    this.product = null;
    this.positionIndexes = {};
    this.autosend = false;
  };
  getProductPriceData() {
    if (this.product) {
      return [{
        name: this.product.name,
        quality: this.product.quality,
      }];
    } else {
      return [];
    };
  };

  loadProduct(product, data) {
    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   storageIndex:index,
    //   factory:FACTORY,
    // };
    this.product = product;
    product.truck = this;
    this.autosend = data.auto;
    this.placeTruck(data);


    // const data = {
    //   player: this.player.login,
    //   truckID: this.id,
    //   product: {
    //     name: this.product.name,
    //     quality: this.product.quality,
    //   },
    // };
    //
    // this.game.sendToAll('GAME_truck_loaded', data);
  };


  //размешает грузовик на карте
  placeTruck(data) {
    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   storageIndex:index,
    //   factory:FACTORY,
    // };
    this.game.transportMap[data.factory.ceilIndex.z][data.factory.ceilIndex.x] = this;
    this.positionIndexes.x = data.factory.ceilIndex.x;
    this.positionIndexes.z = data.factory.ceilIndex.z;
    if (data.auto) {
      this.autosend = data.auto;
    };
    this.game.sendToAll('GAME_truck_place', this.getData());

  };

  send(data) {
    // data = {
    //   game: 'Game_nxwqNu',
    //   player: 'p_dFUXZK',
    //   truck: 'Truck_nsCGHC',
    //   product: 'Product_oil_HKBmSU',
    //   path: [ { z: 6, x: 9 } ],
    //   autosend: false,
    //   delivery: true,
    //   finalObject: 'oilRefinery_uGeDnF'
    // }

    //грузовик в той же клетке, значит можно сразу разружать
    if (data.path.length === 1) {
      if (data.autosend) {
        if (data.autosend.finished) {
          if (data.autosend.sell) {
            data.city = data.autosend.finalObject;
            if (this.game.cities[data.city]) {
              const city = this.game.cities[data.city];
              if (this.product.id === data.product) {
                city.unloadTruck(this);
              };
            };
          };
          if (data.autosend.delivery) {
            const factory = this.player.factoryList.list[data.autosend.finalObject];
            if (factory) {
              if (this.product.id === data.product) {
                factory.unloadTruck(this);
              };
            };
          };
        };
      };
      if (data.sell) {
        data.city = data.finalObject;
        if (this.game.cities[data.city]) {
          const city = this.game.cities[data.city];
          if (this.product.id === data.product) {
            city.unloadTruck(this);
          };
        };
      };
      if (data.delivery) {
        const factory = this.player.factoryList.list[data.finalObject];
        if (factory) {
          if (this.product.id === data.product) {
            factory.unloadTruck(this);
          };
        };
      };
      return;
    } else {
      //если на разгрузку, то последнюю точку занимать не надо
      if (data.delivery || data.sell) {
        this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 0;
      } else {
        //если вдруг игрок занял
        const lastPoint = data.path[data.path.length - 1];
        if (this.game.transportMap[lastPoint.z][lastPoint.x]) {
          const truckOnMap = this.game.transportMap[lastPoint.z][lastPoint.x];
          if (this.game.transportMap[lastPoint.z][lastPoint.x] === 0) {
            // continue
          } else {
            const truckOnMap = this.game.transportMap[lastPoint.z][lastPoint.x];
            if (truckOnMap.positionIndexes.x === null && truckOnMap.positionIndexes.z === null) {
              this.game.transportMap[lastPoint.z][lastPoint.x] = 0;
              // continue
            } else if (truckOnMap.positionIndexes.x === lastPoint.x && truckOnMap.positionIndexes.z === lastPoint.z) {
              return;
            } else {
              this.game.transportMap[lastPoint.z][lastPoint.x] = 0;
              // continue
            };
          };
        };
        if (this.positionIndexes.z != null && this.positionIndexes.x != null) {
          this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 0;
          this.positionIndexes.x = lastPoint.x;
          this.positionIndexes.z = lastPoint.z;
          this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = this;
        };
      };

      const sendData = {
        autosend: data.autosend,
        truck: this.id,
        path: data.path,
        sell: data.sell,
        delivery: data.delivery,
        finalObject: data.finalObject,
      };
      this.game.sendToAll('GAME_truck_sending', sendData);
    };

  };

  clear() {
    if (this.product) {
      this.product.truck = null;
    };
    this.product = null;
    //if player destroy truck
    if (this.game.transportMap[this.positionIndexes.z]) {
      if (this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x]) {
        if (this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] === this) {
          this.game.transportMap[this.positionIndexes.z][this.positionIndexes.x] = 0;
        };
      };
    };
    this.positionIndexes = {
      x: null,
      y: null,
    };

    this.game.sendToAll('GAME_truck_clear', this.id);

  };

  getData() {
    const data = {
      game: this.game.id,
      player: this.player.login,
      id: this.id,

      truckNumber: this.truckNumber,
      product: this.product ? this.product.getData() : null,
      positionIndexes: this.positionIndexes,
      autosend: this.autosend,
    };
    return data;
  };
};

class PRODUCT {
  constructor(properties) {
    this.game = properties.game;
    this.player = properties.player;
    this.factory = properties.factory;
    this.name = properties.name;

    this.id = generateId(`Product_${this.name}`, 5);


    this.quality = properties.quality;

    this.truck = properties.truck || null;

  };
  clone() {
    const clone = new PRODUCT(this);
    return clone;
  };
  getData() {
    const data = {
      game: this.game.id,
      player: this.player.login,
      factory: this.factory.id,
      id: this.id,
      name: this.name,
      quality: this.quality,

      truck: this.truck ? this.truck.id : null,
    };
    return data;
  };
};



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



  if (DEV_GAMEPLAY) {
    socket.emit('DEV_GAMEPLAY');
  };
  socket.on('auth', (data) => {
    // AUTH.checkUser(data).then((result)=>{
    //   console.log(result)
    // });

    const user = new USER({
      socket,
      login: data.login
    });

    SOCKETS[socket.id].user = user;
    USERS[user.login] = user;
    user.authTrue();


    if (DEV_GAMEPLAY) {
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



      if (ROOMS.R_0000000000.members.length === ROOMS.R_0000000000.maxMembers) {

        const ownerSocket = USERS[ROOMS.R_0000000000.owner].socket;

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
    };
  });

  socket.on('AUTH', (data) => {
    function checkLoginReg(login) {
      const reg = /^[a-z][a-z0-9_]{3,15}/;
      const found = login.match(reg);
      if (found) {
        if (found[0] === found.input) {
          return true;
        } else {
          return false;
        };
      } else {
        return false;
      };
    };



    if (!checkLoginReg(data.login)) {
      socket.emit('AUTH_false', {
        reason: 'badLogin'
      });
      return;
    };

    if (data.password.length < 8) {
      socket.emit('AUTH_false', {
        reason: 'badPassword',
        password: true
      });
      return;
    };
    if (data.registration) {
      registration();
    } else {
      login();
    };




    function registration() {
      DB.checkLogin(data.login).then((user) => {
        if (user) {
          socket.emit('AUTH_false', {
            reason: 'loginExist'
          });
        } else {
          DB.createUser(new NEW_USER(data)).then((result) => {
            if (result.insertedId) {
              login();
            } else {
              socket.emit('AUTH_false', {
                reason: 'unexpected'
              });
            };
          });
        };
      });
    };

    function login() {
      DB.checkLogin(data.login).then((user) => {
        if (USERS[data.login]) {
          socket.emit('AUTH_false', {
            reason: 'userOnline'
          });
          return;
        };
        if (user) {
          if (bcrypt.compareSync(data.password, user.password)) {

            const user = new USER({
              socket,
              login: data.login,
            })
            SOCKETS[socket.id].user = user;
            USERS[user.login] = user;
            user.authTrue();

          } else {
            socket.emit('AUTH_false', {
              reason: 'loginPasswordFalse'
            });
          };
        } else {
          socket.emit('AUTH_false', {
            reason: 'loginPasswordFalse'
          });
        };
      });
    };
  });




  socket.on('disconnect', function() {
    const user = SOCKETS[socket.id].user;
    if (user) {
      user.disconnect();
      delete USERS[user.login];
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
      if (CREDITS[data.credit]) {
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
          if (!GAMES[data.gameID].tickStarted) {
            GAMES[data.gameID].tickStarted = true;
            GAMES[data.gameID].tick();
          };

        };
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
            if (!player.gameOver) {
              //если это какая-то фабрика
              if (game.factoriesCount[data.build.building]) {
                if (game.factoriesCount[data.build.building] > 0) {
                  game.factoriesCount[data.build.building] -= 1;
                  const cost = COASTS.buildings[data.build.building] * (-1);
                  player.changeBalance(cost);
                  if (game.cityEconomy) {
                    game.payToCities(cost * (-1));
                  };
                  player.sendBalanceMessage(`Сonstruction of the ${data.build.building}`, cost);
                  game.playerBuilding(data);
                };

              } else {
                //если это дорога и тд, чему счет не ведется
                const cost = COASTS.buildings[data.build.building] * (-1);
                if (game.cityEconomy) {
                  game.payToCities(cost * (-1));
                };
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
        quality or value,
        salary:0,
      };
    };*/

    if (GAMES[data.gameID]) {
      if (GAMES[data.gameID].players[data.player]) {
        if (!GAMES[data.gameID].players[data.player].gameOver) {
          if (GAMES[data.gameID].players[data.player].factoryList.list[data.factory]) {
            GAMES[data.gameID].players[data.player].factoryList.list[data.factory].setSettings(data.settings);
          };
        };
      };
    };

  });

  socket.on('GAME_factory_stop', (data) => {
    //происходит, когда игрок останавливает или запускает фабрику
    /*const data = {
      player:MAIN.game.playerData.login,
      gameID:MAIN.game.commonData.id,
      factory:factory.id,
    };*/


    if (GAMES[data.gameID]) {
      if (GAMES[data.gameID].players[data.player]) {
        if (!GAMES[data.gameID].players[data.player].gameOver) {
          if (GAMES[data.gameID].players[data.player].factoryList.list[data.factory]) {
            const thisFactory = GAMES[data.gameID].players[data.player].factoryList.list[data.factory];
            if (thisFactory.paused) {
              thisFactory.paused = false;
            } else {
              thisFactory.productLine.forEach((item, i) => {
                thisFactory.productLine[i] = 0;
              });
              thisFactory.paused = true;
            };
            thisFactory.sendUpdates();
          };
        };
      };
    };

  });

  socket.on('GAME_factory_setProductSelected', (data) => {

    // const data = {
    //   game:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factory:this.id,
    //   product:product,
    // }

    if (GAMES[data.game]) {
      // const game = GAMES[data.gameID];
      // //если игра пошаговая, то нужно перепроверитьь его ли ход
      // if (game.turnBasedGame) {
      //   //если ходы на паузе
      //   if (game.turnsPaused) {
      //     return;
      //   };
      //   if (game.queue[game.queueNum] != data.player) {
      //     return;
      //   };
      // };

      if (GAMES[data.game].players[data.player]) {
        const player = GAMES[data.game].players[data.player];
        if (player.factoryList.list[data.factory]) {
          const factory = player.factoryList.list[data.factory];
          factory.setProductSelected(data);
        };
      };
    };

  });



  socket.on('GAME_factory_sendProduct', (data) => {
    //с фабрики высылается продукт factory.js class factory -> sendProduct

    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   storageIndex:index,
    // };

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
        if (player.factoryList.list[data.factoryID]) {
          const factory = player.factoryList.list[data.factoryID];

          if (GAMES[data.gameID].transportMap[factory.ceilIndex.z][factory.ceilIndex.x] === 0) {
            factory.sendProduct(data);
          } else {
            const truckOnMap = GAMES[data.gameID].transportMap[factory.ceilIndex.z][factory.ceilIndex.x];
            if (truckOnMap.positionIndexes.x === null && truckOnMap.positionIndexes.z === null) {
              GAMES[data.gameID].transportMap[factory.ceilIndex.z][factory.ceilIndex.x] = 0;
              factory.sendProduct(data);
            } else if (truckOnMap.positionIndexes.x === factory.ceilIndex.x && truckOnMap.positionIndexes.z === factory.ceilIndex.z) {
              return;
            } else {
              GAMES[data.gameID].transportMap[factory.ceilIndex.z][factory.ceilIndex.x] = 0;
              factory.sendProduct(data);
            };
          };
        };
      };
    };

  });

  socket.on('GAME_factory_sendProduct_raw', (data) => {
    //с фабрики высылается продукт factory.js class factory -> sendProduct

    // const data = {
    //   gameID:MAIN.game.data.commonData.id,
    //   player:MAIN.game.data.playerData.login,
    //   factoryID:this.id,
    //   truckID:freeTrucks[0].id,
    //   auto:false,
    //   product:productName,
    // };

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
        if (player.factoryList.list[data.factoryID]) {
          const factory = player.factoryList.list[data.factoryID];

          if (GAMES[data.gameID].transportMap[factory.ceilIndex.z][factory.ceilIndex.x] === 0) {
            factory.sendRawProduct(data);
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
            if (game.cityEconomy) {
              game.payToCities(COASTS.trucks.coast);
            };
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
        if (!player.gameOver) {
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
                factory.loadProductToTruck(nData);
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

    // data = {
    //   game: 'Game_nxwqNu',
    //   player: 'p_dFUXZK',
    //   truck: 'Truck_nsCGHC',
    //   product: 'Product_oil_HKBmSU',
    //   path: [ { z: 6, x: 9 } ],
    //   autosend: false,
    //   delivery: true,
    //   finalObject: 'oilRefinery_uGeDnF'
    // }
    if (GAMES[data.game]) {
      const game = GAMES[data.game];
      if (game.trucks.all[data.truck]) {
        const truck = game.trucks.all[data.truck];
        if (!truck.player.gameOver) {
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
          if (truck.product) {
            if (truck.product.id === data.product) {
              truck.send(data);
            };
          };
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




  socket.on('GAME_product_sell', (data) => {
    // const sendData = {
    //   game:MAIN.game.data.commonData.id,
    //   player:that.player,
    //   truck:that.id,
    //   city:data.finalObject,
    //   product:that.product.id,
    // };


    if (GAMES[data.game]) {
      const game = GAMES[data.game];
      if (game.players[data.player]) {
        const player = game.players[data.player];
        if (!player.gameOver) {
          if (game.trucks.all[data.truck]) {
            const truck = game.trucks.all[data.truck];
            if (game.cities[data.city]) {
              const city = game.cities[data.city];
              if (truck.product) {
                if (truck.product.id === data.product) {
                  city.unloadTruck(truck);
                };
              };
            };
          };
        };
      };
    };
  });

  socket.on('GAME_product_delivery', (data) => {
    // const sendData = {
    //   game:MAIN.game.data.commonData.id,
    //   player:that.player,
    //   truck:that.id,
    //   factory:data.finalObject,
    //   product:that.product.id,
    // };


    if (GAMES[data.game]) {
      const game = GAMES[data.game];
      if (game.players[data.player]) {
        const player = game.players[data.player];
        if (!player.gameOver) {
          if (game.trucks.all[data.truck]) {
            const truck = game.trucks.all[data.truck];
            if (player.factoryList.list[data.factory]) {
              const factory = player.factoryList.list[data.factory];
              if (truck.product.id === data.product) {
                factory.unloadTruck(truck);
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
