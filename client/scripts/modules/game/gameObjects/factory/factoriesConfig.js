

//это конфиги фабрики( как долго длится производство,сколько места на складе, сколько стоит производство,  )
import {
  MAIN
} from '../../../../main.js';




const CONFIGS = {
  sawmill:{
    //значит, что добывает ресурс (есть еще перерабатывающие ресурсы)
    mining: true,
  },
  waterStation:{
    mining: true,
  },
  sandMine:{
    mining: true,
  },
};
export {
  CONFIGS
};
