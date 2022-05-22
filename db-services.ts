import AsyncStorage from '@react-native-async-storage/async-storage';


var Datastore = require('react-native-local-mongodb'),
  db = new Datastore({
    filename: 'flashApp',
    storage: AsyncStorage,
    autoload: true,
  });


export default db;
