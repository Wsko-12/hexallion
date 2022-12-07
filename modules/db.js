const {
  MongoClient
} = require('mongodb');
const uri = "mongodb+srv://wskodev:79sx2kG1zk3Pltdl@hexallion.fg65r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});




const DB = {};



DB.connectToDB = async function() {
  const prom = new Promise(function(resolve, reject) {
    client.connect().then((connection) => {
      DB.connection = connection;
      if (DB.connection) {
        // DB.connection.db('hexallion').collection('users').updateMany( {}, {$set: { lastGame: null } });
        resolve('mongoDB connected');
        // DB.connection.db('hexallion').collection('users').remove();
      };
    }).catch((error) => {
      console.log("mongoDB not connected");
      console.log(error);
    });
  });
  return prom;
};

DB.checkLogin = async function(login) {
  const prom = new Promise(function(resolve, reject) {
    DB.connection.db('hexallion').collection('users').findOne({
      login
    }).then((result) => {
      resolve(result);
    });
  });
  return prom;
};


DB.createUser = async function(user) {
  const prom = new Promise((resolve, reject) => {
    DB.connection.db('hexallion').collection('users').insertOne(user).then((result) => {
      resolve(result);
    });
  });
  return prom;
};

DB.setLastGame = async function(login, lastGame) {
  const prom = new Promise((resolve, reject) => {
    DB.connection.db('hexallion').collection('users').updateOne({login:login},{$set:{lastGame:lastGame}});
  });
  return prom;
};


module.exports = DB;
