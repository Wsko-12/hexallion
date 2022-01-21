//в этом модуле все кофиги собираются в один

import {
  MAIN
} from '../../../main.js';

import {
  BUILDINGS
} from './builds/buildings.js';

import {
  CREDITS
} from './credits/credits.js';
import {
  PRODUCTS
} from './products/products.js';

const CONFIGS = {
  buildings:BUILDINGS,
  credits:CREDITS,
  products:PRODUCTS,
};

export {
  CONFIGS
};
