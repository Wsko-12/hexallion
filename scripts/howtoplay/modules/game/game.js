/*
 * Этот модуль и его вложения отвечает за все, что происходит в партии игры
 */
import {
  MAIN
} from '../../main.js';
// import {
//   GENERATION
// } from './generation/generation.js';
import {
  SCENE
} from './scene/scene.js';

import {
  CONFIGS
} from './configs/main.js';
import {
  GAME_EVENTS
} from './events/gameEvents.js';
import {
  FUNCTIONS
} from './functions/functions.js';



const GAME = {};
// GAME.generation = GENERATION;
GAME.configs = CONFIGS;
GAME.scene = SCENE;
GAME.events = GAME_EVENTS;
GAME.functions = FUNCTIONS;

export {
  GAME
};
