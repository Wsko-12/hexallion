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

const CONFIGS = {
  factories:FACTORIES,
  buildings:BUILDINGS,
};

export {
  CONFIGS
};
