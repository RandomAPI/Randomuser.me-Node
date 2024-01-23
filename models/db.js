const mongoose = require('mongoose');
const settings = require('../settings');

module.exports = async testEnv => {
  const dbName = settings.db + (testEnv ? '-test' : '');

  const db = mongoose.connection;
  db.on('connecting', console.log.bind(console, '[database] Connecting to MongoDB...'));
  db.on('connected', console.log.bind(console, '[database] Connected to MongoDB.'));
  db.on('error', console.error.bind(console, '[database] Error occured in MongoDB connection.'));

  try {
    await mongoose.connect('mongodb://localhost/' + dbName, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (err) {
    console.error('[database] Error occured while connecting to MongoDB. Is it running?');
    process.exit(1);
  }

  mongoose.set('useCreateIndex', true);
};