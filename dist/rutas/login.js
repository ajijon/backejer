"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var environment_1 = require("../global/environment");
var loginRoutes = express_1.Router();
loginRoutes.post('/', function (req, res) {
    var body = req.body;
    usuario_1.Usuario.findOne({ email: body.email }, function (error, usuarioDB) {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usario',
                mess_err: error
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -email',
                mess_err: error
            });
        }
        //compara la contraseña enriptada
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) { //compara el pass ingresado con el de la BDg
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -password',
                mess_err: error
            });
        }
        var token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, environment_1.SEED, { expiresIn: 14400 });
        usuarioDB.password = ';)';
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB.id,
            token: token
        });
    });
});
exports.default = loginRoutes;
