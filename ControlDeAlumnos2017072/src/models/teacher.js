'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var teacherSchema = Schema({
    usuario : String,
    email : String, 
    password : String,
    rol : String,
});

module.exports = mongoose.model('Teacher', teacherSchema);