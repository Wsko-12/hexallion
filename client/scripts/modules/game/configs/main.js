//в этом модуле все кофиги собираются в один

import {
  MAIN
} from '../../../main.js';

import {
  BUILDINGS
} from './builds/buildings.js';

import {
  FACTORIES
} from './factories/factoriesConfig.js';

import {
  CREDITS
} from './credits/credits.js';

const CONFIGS = {
  factories:FACTORIES,
  buildings:BUILDINGS,
  credits:CREDITS,
};

export {
  CONFIGS
};
