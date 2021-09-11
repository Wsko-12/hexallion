/*
 * Этот модуль и его вложения отвечает за все, что происходит в партии игры
 */
import {
  MAIN
} from '../../main.js';
import {
  GENERATION
} from './generation/generation.js';

const GAME = {};
GAME.generation = GENERATION;

export {
  GAME
};
