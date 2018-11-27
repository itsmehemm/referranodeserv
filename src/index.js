const express = require('express');
const v1apis = require('./api/v1');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/api/v1', v1apis);

module.exports = app;