"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose"); //mongoose es un mapeador de documento / objeto que permite definir objetos con un esquema
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};
exports.usuarioSchema = new mongoose_1.Schema({
    role: { type: String, enum: rolesValidos, default: 'USER_ROL' },
    nombre: { type: String, required: [true, 'nombre necesario'] },
    apellido: { type: String, required: [true, 'apellido necesario'] },
    email: { type: String, required: [true, 'correo necesario'] },
    password: { type: String, required: [true, 'contraseña necesaria'] }
}, { collection: 'usuario' });
exports.usuarioSchema.plugin(mongoose_unique_validator_1.default, { message: '{ PATH } debe ser unico' });
// (:)tipo (=)objeto (" ")nombre (' ')impresion
//const usuario de (:) tipo modelo, llamado IUsuariomodel que es igual al objeto model llamado IUsuario model con nombre usuario 
exports.Usuario = mongoose_1.model("Usuario", exports.usuarioSchema); // ya variable usuarioSchema
