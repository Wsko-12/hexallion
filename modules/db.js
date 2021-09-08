const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://wskodev:12121222@hexallion.fg65r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const DB = {};


DB.connectToDB = async function connectToDB() {
  DBConnection = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // DBConnection.db('kapitalistDB').collection('users').remove();
  // DBConnection.db('kapitalistDB').collection('players').remove();
  // DBConnection.db('kapitalistDB').collection('rooms').remove();
  if(DBConnection){
    return true;
  };
};




module.exports = DB;
