const credits = {
  basic:{
    title:'basic',
    //сколько дадут денег
    amount:120000,

    //какое кол-во платежей будет
    pays:25,
    //какое кол-во шагов отсрочка
    deferment:15,
    //под какой процент кредит
    procent:12,

  },

  longPause:{
    title:'long pause',

    //сколько дадут денег
    amount:120000,

    //какое кол-во платежей будет
    pays:15,
    //какое кол-во шагов отсрочка
    deferment:25,
    //под какой процент кредит
    procent:18,

  },
  huge:{
    title:'huge',

    //сколько дадут денег
    amount:200000,

    //какое кол-во платежей будет
    pays:20,
    //какое кол-во шагов отсрочка
    deferment:18,
    //под какой процент кредит
    procent:25,

  },
};
module.exports = credits;
