/*
 * Этот модуль и его вложения отвечает за все, что происходит в партии игры
 */
import {
  MAIN
} from '../../main.js';
import {
  GENERATION
} from './generation/generation.js';
import {
  SCENE
} from './scene/scene.js';

import {
  CONFIGS
} from './configs/main.js';
import {
  GAME_EVENTS
} from './events/gameEvents.js';


const GAME = {};
GAME.configs = CONFIGS;
GAME.generation = GENERATION;
GAME.scene = SCENE;
GAME.events = GAME_EVENTS;

console.log(MAIN);
export {
  GAME
};
