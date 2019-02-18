'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = '12345';

exports.createToken = teacher => {
    var payload = {
        sub : teacher._id,
        usuario : teacher.usuario,
        email : teacher.email,
        password : teacher.password,
        rol : teacher.rol,
        iat: moment().unix(),
        exp: moment().day(1, 'days').unix
    };

    return jwt.encode(payload, secret);
}