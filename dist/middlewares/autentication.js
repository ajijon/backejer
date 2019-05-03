"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var environment_1 = require("../global/environment");
function verificaToken(req, res, next) {
    var token = req.headers.authorization; //token inyecta informacion al header mediante la palabra clave autorizacion
    //(peticion, lugar, palabra clave)
    console.log(req.headers.authorization);
    jsonwebtoken_1.verify(token, environment_1.SEED, function (err, decoded) {
        if (err) { //y si son correctos que muestre la informacion del usuario
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto'
            });
        }
        req.body.usuario = decoded.usuario; //inyecta los datos en la peticion. Se pide informacion del usuario 
        next(); //next que el programa pase a lo siguiente              //y se decodifica como un token
    });
}
exports.default = verificaToken; //se exporta para utilizarse en otra parte del programa
