const bcrypt = require('bcryptjs');
const DB = require('./db.js');

const AUTH = {};
AUTH.checkUser = async function(data){
  const prom = new Promise(function(resolve, reject) {
      resolve(data);
  });
  return prom;

};







module.exports = AUTH;
