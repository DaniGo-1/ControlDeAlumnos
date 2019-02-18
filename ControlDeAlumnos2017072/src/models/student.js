'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let studentSchema = Schema({
    nombre : String,
    carne : String,
    codigoAcademico : String,
    codigoTecnico : String,
    cursos : []
});

module.exports = mongoose.model('Student' , studentSchema);
