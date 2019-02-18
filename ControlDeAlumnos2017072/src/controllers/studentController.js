'use strict'

var Student = require('../models/student');
var path = require('path');
var ignoreCase = require('ignore-case');


/* ------------------- REGISTRO DE STUDENT ----------------------- */

function registrar(req , res){
    let student = new Student();   
    let params = req.body;

    if((ignoreCase.equals(req.teacher.rol , 'teacher')) === false){
        return resizeBy.status(500).send({message : 'Solo profesores pueden crear usuarios'});
    }else{
        if(params.nombre && params.carne){

            student.nombre = params.nombre;
            student.carne = params.carne;
            student.codigoAcademico = params.codigoAcademico;
            student.codigoTecnico = params.codigoTecnico;
            student.cursos = []

            Student.find({$or: 
                [
                    {nombre : student.nombre.toLowerCase()},
                    {nombre : student.nombre.toUpperCase()},
                    {carne : student.carne}
                ]
            }).exec((err, students) => {

                if(err) return res.status(500).send({message : 'Error ene la peticion del student'});

                if(students && students.length >= 1){
                    return res.status(500).send({message : 'El alumno ya existe en el sistema'});
                }else{
                    student.save((err, alumnoGuardado) => {
                        if(err) return res.status(500).send({message : 'Error al guardar!'});

                        alumnoGuardado
                        ? res.status(200).send({student : alumnoGuardado})
                        : res.status(404).send({message: 'No se ha podido registrar el alumno'})
                    });
                }

            })

        }else{
            res.status(200).send({message : 'Ingrese los campos necesarios!'});
        }

    }


}

/* ---------------------- UPDATE STUDENT --------------------------- */

function editarAlumno(req, res){
    let params = req.body;
    let studentId = req.params.id;
    
    Student.findByIdAndUpdate(studentId,params ,{new : true}, (err, alumnoActualizado) => {
        if(err) return res.status(500).send({message : 'error en la peticion'});

        if(!alumnoActualizado) return res.status(404).send({message : 'No se ha podido actualizar el alumno'});

        return res.status(200).send({student : alumnoActualizado});
    });

}
/* ---------------- Elimina los diacriticos --------------------  */

var normalize = function eliminarDiacriticosEs(texto) {
    return texto
           .normalize('NFD')
           .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
           .normalize();
}


/* ------------- ASIGNAR CLASES AL ALUMNO ----------------- */

function asignarClases(req, res){
    let params = req.body;
    let studentId = req.params.id;
    let existe = 0;

    Student.findById(studentId, (err, studentCurses) => {
        
        for(let i = 0; i < studentCurses.cursos.length; i++){
            if(normalize(studentCurses.cursos[i].toLowerCase()) === normalize(params.cursos.toLowerCase())){
                existe = 1;
                return res.status(200).send({message : 'El curso ya existe'});
            }
        }

        if(existe === 0){
            studentCurses.cursos.push(params.cursos)

            Student.findByIdAndUpdate(studentId,  {cursos : studentCurses.cursos}, (err) => {
                if(err) return res.status(500).send({message : 'error de peticion'});
                
                Student.findById(studentId, (err, listo) => {
                    return res.status(200).send({clasesAsignadas : listo});
                })
            })
        }        
    })
        
}

/* --------------- DELETE CLASES DE ALUMNOS ---------------- */

function eliminarClases(req, res){
    let params = req.body;
    let studentId = req.params.id;
    let existe = 0;
    let clase = "";
    
    Student.findById(studentId, (err, studentCurses) => {
        
        for(let i = 0; i < studentCurses.cursos.length; i++){
            if(normalize(studentCurses.cursos[i].toLowerCase()) === normalize(params.cursos.toLowerCase())){
                existe = 1;  
                clase = studentCurses.cursos[i];              
            }
        }

        if(existe === 0){
            return res.status(200).send({message : 'El curso no existe'});
        }

        if(existe === 1){
            studentCurses.cursos.pull(clase);

            Student.findByIdAndUpdate(studentId,  {cursos : studentCurses.cursos}, (err) => {
                if(err) return res.status(500).send({message : 'error de peticion'});
                
                Student.findById(studentId, (err, listo) => {
                    return res.status(200).send({clasesAsignadas : listo});
                })
            })
        }        
    })
        
}

/* ---------------- LISTAR STUDENTS-------------------- */


function listar(req, res){

    Student.find((err, lista) =>{
        if(err) return res.status(500).send({message : 'Error en la peticion'});

        if(!lista) return res.status(404).send({message : 'No existen alumnos!'});

        res.status(200).send({student : lista});
    })
}


/* -------------------------- DELETE STUDENT ------------------------- */

function eliminarAlumno(req, res){
    let studentId = req.params.id;

    Student.findByIdAndDelete(studentId, (err, studentEliminado) => {
        if(err) return res.status(500).send({message : 'Error en la peticion'});

        if(!studentEliminado) return res.status(404).send({message : 'No se ha podido eliminar el alumno'});

        return res.status(200).send({message : 'Alumno Eliminado'});
    });
}

/* -------------------- SEARCH STUDENT ------------------- */

function buscarAlumno(req, res){
    let name = req.body.nombre;

    if(req.teacher.sub === false){
        res.status(500).send({message : 'No tiene los permisos para buscar alumnos'})
    }

    Student.find().exec((err, alumnos)=>{
        
        if(err) return res.status(500).send({message: 'Error en la peticion'});
   
        let alumnosEncontradas = [];
        let x = name.length;

        for(let i = 0; i < alumnos.length; i++){
            if(normalize(alumnos[i].nombre.toLowerCase().substring(0,x)).includes(normalize(name.toLowerCase(),0))){
                alumnosEncontradas[i] = alumnos[i];              
            }
        }

        if(alumnos.length === 0) return res.status(404).send({message: 'No hay alumnos con ese nombre'});

        if(alumnosEncontradas.length === 0){
            res.status(404).send({message : 'No existen alumnos con ese nombre'});
        }else{
            let y = 0;
            let coincidenciaDeAlumnos = [];
                for(let e = 0;e < alumnosEncontradas.length; e++){
                    if(alumnosEncontradas[e] != null){
                        coincidenciaDeAlumnos[y] = alumnosEncontradas[e];
                        y++;
                    }
                }
            return res.status(200).send({company : coincidenciaDeAlumnos}); 
        } 
    });
}

module.exports = {
    registrar,
    editarAlumno,
    eliminarAlumno,
    buscarAlumno,
    asignarClases,
    eliminarClases,
    listar    
};