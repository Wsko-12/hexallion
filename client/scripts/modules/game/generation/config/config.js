/*
 * В этом модуле хранятся конфигурации игры(сколько всего ячеек,количество типов ячеек)
 */
import {
  MAIN
} from '../../../../main.js';

const CONFIG = {};

CONFIG.mapCeils = {
  meadow: 39,
  sand: 9,
  forest: 20,
  mountain: 6,
  sea: 14,
  city: 3,
};

CONFIG.cities = [
  'Westown',
  'Northfield',
  'Southcity',
];

export {
  CONFIG
};
