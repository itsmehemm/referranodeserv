const mysqlx = require('@mysql/xdevapi');

const options = require('./config/config.json');

const dbSession = mysqlx.getSession(options).then(session => session)

module.exports = dbSession;