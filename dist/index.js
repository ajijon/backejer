"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./clases/server"));
var environment_1 = require("./global/environment"); //cuando todo esta escrito en mayuscula es porque es importante {}indica que solo se esta importando una cosa
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
//importar rutas
var login_1 = __importDefault(require("./rutas/login"));
var usuario_1 = __importDefault(require("./rutas/usuario"));
var server = new server_1.default(); //se crea una instancia de la clase servidor cuando se declara en mayus es por que es una funcion
//body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//cors
server.app.use(cors_1.default({ origin: true, credentials: true }));
//seteo de rutas
server.app.use('/login', login_1.default); //uso de aplicacion de usuario
server.app.use('/usuario', usuario_1.default);
//Conexion a la base de datos                 //creando index        creando nuevo url
mongoose_1.default.connect('mongodb://localhost/angel', { useCreateIndex: true, useNewUrlParser: true }, function (err) {
    if (err)
        throw err;
    console.log('Conectado a la base de datos puerto 27017');
});
server.start(function () {
    console.log("Servidor corriendo en el puerto " + environment_1.SERVER_PORT);
});
