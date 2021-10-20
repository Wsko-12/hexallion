/*
 * В этом модуле происсходит генерация данных игры(раскладка карты)
 */
import {
  MAIN
} from '../../../main.js';
import {
  CONFIG
} from './config/config.js';

const GENERATION = {};

GENERATION.start = (room) => {
  const game = {};
  game.roomID = room.id;

// /*ДЛЯ ОДНОГО ИГРОКА*/
//   game.id = 'G_0000000000';

/*БОЛЬШЕ ОДНОГО ИГРОКА*/
game.id = generateId('G', 9);


  // function turns(membersArray) {
  //   const turnsArray = [...membersArray];
  //   turnsArray.sort(() => Math.random() - 0.5);
  //   return turnsArray;
  // };
  game.members = room.members;
  // game.turns = turns(room.members);

  function map() {
    const mapArray = [];
    for (let ceilType in CONFIG.mapCeils) {
      for (let count = 0; count < CONFIG.mapCeils[ceilType]; count++) {
        if (ceilType == 'city') {
          mapArray.push(CONFIG.cities[count])
        } else {
          mapArray.push(ceilType);
        };
      };
    };
    mapArray.sort(() => Math.random() - 0.5);
    return mapArray;
  };
  game.mapArray = map();
  game.turnBasedGame = room.turnBasedGame;
  game.turnTime = room.turnTime;
  game.turnsPaused = false;
  game.tickTime = room.tickTime;

  MAIN.socket.emit('GAME_generated', game);

};

export {
  GENERATION
};
