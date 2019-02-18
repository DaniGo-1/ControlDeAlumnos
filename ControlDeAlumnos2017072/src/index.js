'use strict'

const mongoose = require('mongoose');
const app = require('./app');
var bcryp = require('bcrypt-nodejs');
var Teacher = require('./models/teacher');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/ControlDeAlumnosDb' , {useNewUrlParser : true}).then(() => {
    console.log('Se conecto a la base de datos Control De Alumnos');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'), ()=>{
        console.log(`El servidor esta corriendo en el puerto ${app.get('port')}`);
    })
}).catch(err => console.log(err));

/* ---------- TEACHER BY DEFAULT -----------*/

var teacher = new Teacher();

function crearProfesor(){
    teacher.usuario = 'admin';
    teacher.email = 'admin';
    teacher.password = 'admin';
    teacher.rol = 'teacher';

    bcryp.hash('admin', null, null, (err, hash) => {
        teacher.password = hash;

        teacher.save();
    })
}

Teacher.find({email: 'admin'}).exec((err, teachers) => {
    if(teachers && teachers.length >= 1){
    }else{
        crearProfesor();
    }
})