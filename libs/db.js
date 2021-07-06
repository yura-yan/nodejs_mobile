const mongoose = require('mongoose')
const config = require('./config');
const logger = require('./log')

mongoose.connect(config.get('mongoose:uri'), {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    });

const db = mongoose.connection;

db.on('error', function (err) {
    logger.error('connection error:', err.message);
});
db.once('open', function callback () {
    logger.info("Connected to DB!");
});

module.exports = mongoose