'use strict'

var express = require('express');
var teacherController = require('../controllers/teacherController');
var md_auth = require('../middleware/autheticated');

let api = express.Router();

    api.post('/login', teacherController.login);    

module.exports = api;