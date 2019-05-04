import { Document, Schema, Model, model} from 'mongoose'; //mongoose es un mapeador de documento / objeto que permite definir objetos con un esquema
import uniqueValidator from 'mongoose-unique-validator';
import { IUsuario } from '../interfaces/usuario';

export interface IUsuarioModel extends IUsuario, Document{  //se exporta la interfaz IUsuariomodel que es una extension o 
    fullName: string;                                       //instancia IUsuario que va hacer un documento llamado fullName 
}
const rolesValidos = {                    //es un arreglo de valores y mensaje
    values: ['ADMIN_ROLE', 'USER_ROLE'],  //no dejar espacio en los corchetes o marcara error
    message: '{VALUE} no es un rol permitido'
}

export var usuarioSchema: Schema = new Schema({    // variable usuarioSchema que es de tipo Schema y tiene una instancia del
                                                   // squema (=new Schema el cual contiene role, nombre etc)
    role: { type: String, enum: rolesValidos, default: 'USER_ROLE' }, //enum enumero los roles validos, agrega por default el rol
    nombre: { type: String, required:[ true, 'nombre necesario']}, //en require si no fuera obligatorio se le pone false y no true
    apellido: { type: String, required:[true,'El apellido es necesario']},
    email: { type: String, unique: true, required: [ true, 'correo necesario']},     //unique hace unico un valor 
    password: { type: String, required:[ true, 'contraseña necesaria']}  // String la escribimos en may si es un tip de var????
},

{ collection: 'usuario' } //en coleccion usuario guarda todos los registros ingresados

);

usuarioSchema.plugin(uniqueValidator, { message: '{ PATH } debe ser unico'}); //plugin es una extension que ayuda a unique a
                                                                    //mostrar el msg, PATH es el campo donde se ingresan los datos
// (:)tipo (=)objeto (" ")nombre (' ')impresion
//const usuario de (:) tipo modelo, llamado IUsuariomodel que es igual al objeto model llamado IUsuario model con nombre usuario 
export const Usuario: Model<IUsuarioModel> = model <IUsuarioModel> ("Usuario", usuarioSchema); // y una variable usuarioSchema
                                                                     //< > indica que es el nombre del objeto que lo antecede