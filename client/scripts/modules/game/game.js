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

const GAME = {};
GAME.generation = GENERATION;
GAME.scene = SCENE;


export {
  GAME
};
