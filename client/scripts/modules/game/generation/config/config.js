/*
 * В этом модуле хранятся конфигурации игры(сколько всего ячеек,количество типов ячеек)
 */
import {
  MAIN
} from '../../../../main.js';

const CONFIG = {};

CONFIG.mapCeils = {
  meadow: 30,
  sand: 9,
  // sand_block : 2,
  forest: 12,
  mountain: 3,
  // mountain_block : 10,
  swamps: 2,
  // swamps_block : 8,
  sea: 4,
  // sea_block : 8,
  city: 3,
  block: 28,
};

CONFIG.cities = [
  'Westown',
  'Northfield',
  'Southcity',
];

export {
  CONFIG
};
