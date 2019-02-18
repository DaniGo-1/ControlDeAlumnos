'use strict'

var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Teacher = require('../models/teacher');
var Student = require('../models/student');

/* --------------------- LOGIN TEACHERS ----------------------- */

function login(req, res){
    let params = req.body;
    let emailEntered = params.email;
    let passwordEntered = params.password;

    Teacher.findOne({email : emailEntered}, (err, teacher) => {

        if(err) return res.status(500).send({message : 'Error de peticion'});

        if(teacher){
            bcrypt.compare(passwordEntered, teacher.password, (err, check) => {
                if(check){

                    if(params.gettoken){
                        return res.status(200).send({
                            token : jwt.createToken(teacher)
                        })
                    }else{
                        teacher.password = undefined;
                        return res.status(200).send({teacher});
                    }

                }else{
                    return res.status(404).send({message : 'Los datos son incorrectos'});
                }
            })
        }else{
            return res.status(404).send({message : 'El usuario no existe'});
        }
        
    });
    
};


module.exports = {
    login
};