"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.serviciosSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'Nombre necesario'] },
    descripcion: { type: String, required: [true, 'Descripcion necesaria'] },
    precio: { type: String, required: [true, 'Precio necesario'] }
}, { collection: 'servicios' });
exports.serviciosSchema.plugin(mongoose_unique_validator_1.default, { message: ' { PATH } debe ser ùnico ' });
exports.Servicios = mongoose_1.model("Servicios", exports.serviciosSchema);
