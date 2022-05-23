const mongoose = require('mongoose');
const settings = require('../settings');

module.exports = testEnv => {
  const dbName = settings.db + (testEnv ? '-test' : '');
  const dbServer = settings.dbServer;
  const credentials =
    settings.dbUsername && settings.dbPassword
      ? settings.dbUsername + ':' + settings.dbPassword + '@'
      : '';

  mongoose.connect('mongodb://' + credentials + dbServer + '/' + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('useCreateIndex', true);

  const db = mongoose.connection;
  db.on('connected', console.log.bind(console, '[database] Connected to MongoDB.'));
  db.on('error', console.error.bind(console, '[database] Error occured while connecting to MongoDB.'));
};