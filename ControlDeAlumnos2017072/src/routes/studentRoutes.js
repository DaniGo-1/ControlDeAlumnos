'use strict'

var express = require('express');
var studentController = require('../controllers/studentController');
var md_auth = require('../middleware/autheticated');

let api = express.Router();

    api.post('/registrar-alumno' , md_auth.ensureAuth, studentController.registrar);
    api.put('/editar-alumno/:id', md_auth.ensureAuth, studentController.editarAlumno);
    api.delete('/eliminar-alumno/:id' , md_auth.ensureAuth, studentController.eliminarAlumno);
    api.get('/buscar-alumno', md_auth.ensureAuth, studentController.buscarAlumno);
    api.put('/asignar-clases/:id', md_auth.ensureAuth, studentController.asignarClases);
    api.put('/eliminar-clases/:id', md_auth.ensureAuth, studentController.eliminarClases);
    api.get('/listar-alumnos',studentController.listar);

module.exports = api;