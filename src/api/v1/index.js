const signup = require('./controllers/signup');
const express = require('express');
const v1 = express.Router();

v1.post('/signup', signup);

module.exports = v1;