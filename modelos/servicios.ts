import { Document, Schema, Model, model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { SErvicios } from '../interfaces/servicios';

export interface SErviciosModel extends SErvicios, Document{
    fullName: string;
}

export var serviciosSchema: Schema = new Schema({
    nombre: { type: String, required: [true, 'Nombre necesario']},
    descripcion: { type: String, required: [ true, 'Descripcion necesaria']},
    precio: { type: String, required: [true, 'Precio necesario']}
},

{ collection: 'servicios' }

);

serviciosSchema.plugin(uniqueValidator,{ message: ' { PATH } debe ser ùnico '});

export const Servicios: Model<SErviciosModel> = model <SErviciosModel> ("Servicios", serviciosSchema);