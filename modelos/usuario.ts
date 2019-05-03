import { Document, Schema, Model, model} from 'mongoose'; //mongoose es un mapeador de documento / objeto que permite definir objetos con un esquema
import uniqueValidator from 'mongoose-unique-validator';
import { IUsuario } from '../interfaces/usuario';

export interface IUsuarioModel extends IUsuario, Document{
    fullName: string;
}
const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],  //no dejar espacio en los corchetes o marcara error
    message: '{VALUE} no es un rol permitido'
}

export var usuarioSchema: Schema = new Schema({

    role: { type: String, enum: rolesValidos, default: 'USER_ROL' },
    nombre: { type: String, required:[ true, 'nombre necesario']},
    apellido: { type: String, required: [ true, 'apellido necesario']},
    email: { type: String, required: [ true, 'correo necesario']},
    password: { type: String, required: [ true, 'contraseña necesaria']}
},

{ collection: 'usuario' }

);

usuarioSchema.plugin(uniqueValidator, { message: '{ PATH } debe ser unico'});

// (:)tipo (=)objeto (" ")nombre (' ')impresion
//const usuario de (:) tipo modelo, llamado IUsuariomodel que es igual al objeto model llamado IUsuario model con nombre usuario 
export const Usuario: Model<IUsuarioModel> = model <IUsuarioModel> ("Usuario", usuarioSchema); // ya variable usuarioSchema