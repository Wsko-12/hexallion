/*
 * В этом модуле хранятся конфигурации игры(сколько всего ячеек,количество типов ячеек)
 */
import {
  MAIN
} from '../../../../main.js';

const CONFIG = {};

CONFIG.mapCeils = {
  meadow: 50,
  sand: 9,
  forest: 12,
  mountain: 3,
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
