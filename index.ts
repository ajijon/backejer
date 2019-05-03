import Server from './clases/server';
import {SERVER_PORT} from './global/environment'; //cuando todo esta escrito en mayuscula es porque es importante {}indica que solo se esta importando una cosa
import mongoose from 'mongoose';
import bodyparser from 'body-parser';
import cors from 'cors';

//importar rutas
import loginRoutes from './rutas/login';
import usuarioRoutes from './rutas/usuario';


const server = new Server(); //se crea una instancia de la clase servidor cuando se declara en mayus es por que es una funcion

//body parser
server.app.use( bodyparser.urlencoded({extended: true}) );
server.app.use( bodyparser.json() );

//cors
server.app.use( cors ({origin: true, credentials: true}));

//seteo de rutas
server.app.use('/login', loginRoutes); //uso de aplicacion de usuario
server.app.use('/usuario', usuarioRoutes);



//Conexion a la base de datos                 //creando index        creando nuevo url
mongoose.connect('mongodb://localhost/angel', { useCreateIndex: true, useNewUrlParser: true}, (err:any) => {
    if (err) throw err;
    console.log('Conectado a la base de datos puerto 27017');
});

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${SERVER_PORT}`)

});