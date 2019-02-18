'use strict'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var teacher_routes = require('./routes/teacherRoutes');
var student_routes = require('./routes/studentRoutes');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers' , 'Authorization, X-API-KEY, Origin, X-Requested-With, Contect-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods' , 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

app.use('/api' , teacher_routes);
app.use('/api' , student_routes);

module.exports = app;