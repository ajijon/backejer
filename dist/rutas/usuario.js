"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var bcrypt_1 = __importDefault(require("bcrypt"));
var autentication_1 = __importDefault(require("../middlewares/autentication"));
var usuarioRoutes = express_1.Router();
//==================================
//Crear usuario
//==================================
usuarioRoutes.post('/', autentication_1.default, function (req, res) {
    var body = req.body; //body de tipo interfaz IUsuario, (req: es una peticion) que es igual a una peticion alojada en el body
    var usuario = new usuario_1.Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        role: body.role,
        password: bcrypt_1.default.hashSync(body.password, 10)
    });
    usuario.save(function (err, usuarioGuardado) {
        if (err) { //el if es una funcion de condicion
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                err: err
            });
        }
        usuarioGuardado.password = ':)';
        res.status(200).json({
            ok: true,
            mensaje: 'usuario guardado'
        });
    });
});
//==================================
//Enlistar usuarios
//==================================
usuarioRoutes.get('/'), autentication_1.default, function (req, res) {
    usuario_1.Usuario.find(function (err, usuarioDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error en la base de datos',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
};
//==================================
//Enlistar usuarios con paginacion
//==================================
usuarioRoutes.get('/:desde?/:limit?', autentication_1.default, function (req, res) {
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') { //( !== ) diferente de
        return res.status(401).json({
            ok: false,
            mensaje: 'se require permisos de administrador'
        });
    }
    var desde = req.params.desde || 0; //indica que es la 1er pagina a mostrar, var que recibe parametros x url x medio de params      
    desde = Number(desde);
    var limit = req.params.limit || 2; //permite elegir cuantos registros mostrar en cada consulta
    limit = Number(limit);
    usuario_1.Usuario.find({}, 'nombre apellido email password role')
        .skip(desde) //funcion de mongoose que omite registros, su variable indica que es la 1er pagina a mostrar
        .limit(limit) //permite elegir cuantos registros mostrar en cada consulta
        .exec(function (err, usuarios) {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos',
                err: err
            });
        }
        usuario_1.Usuario.countDocuments({}, function (err, conteo) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error en el conteo de usuarios',
                    err: err
                });
            }
            res.status(200).json({
                ok: true,
                usuario: usuarios,
                total: conteo
            });
        });
    });
});
//==================================
//buscar usario por filtro
//==================================
usuarioRoutes.post('/buscar', autentication_1.default, function (req, res) {
    var termino = req.headers.termino; //debemos de saber donde buscar si en el header o en el body
    var regex = new RegExp(termino, 'i');
    usuario_1.Usuario.find({ $or: [{ nombre: regex }, { apellido: regex }, { email: regex }] }, 'id nombre apellido email')
        .exec(function (err, usuarioEnc) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos al buscar usuario',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            resultados: usuarioEnc,
            total: usuarioEnc.length //length muestra el numero total de resultados
        });
    });
});
//==================================
//buscar usario por filtro de ROLES  TAREA X CONCLUIR
//==================================
usuarioRoutes.post('/usad', autentication_1.default, function (req, res) {
    var admin = req.body.usuario;
    var regex = new RegExp(admin, 'i'); // 'i' que ignore si es M o m
    if (admin.role !== admin)
        usuario_1.Usuario.find({ nombre: regex, role: regex }, 'nombre role')
            .exec(function (err, usuarioEnc) {
            res.status(200).json({
                ok: true,
                resultados: usuarioEnc,
                total: usuarioEnc.length
            });
        });
});
//==================================
//buscar usario si eres admin   o por letra ?                 
//==================================
usuarioRoutes.post('/role', autentication_1.default, function (req, res) {
    var admin = req.body.usuario;
    console.log(admin);
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'no eres administrador'
        });
    }
    //peticion (req), lugar(body) y ubicacion(usuario)
    var usuario = req.body.usuario; //debemos de saber donde buscar si en el header o en el body
    var regex = new RegExp(usuario, 'i');
    usuario_1.Usuario.find({ $or: [{ nombre: regex }, { apellido: regex }, { email: regex }, { role: regex }] }, //busca coincidencias
    'id nombre apellido email role') //imprime lo encontrado en pantalla
        .exec(function (err, usuarioEnc) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos al buscar usario',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            resultados: usuarioEnc,
            total: usuarioEnc.length //length muestra el numero total de resultados
        });
    });
});
//==================================
//Modificar usuario
//==================================
usuarioRoutes.put('/:id', autentication_1.default, function (req, res) {
    var id = req.params.id;
    var body = req.body;
    var usrtkn = req.body.usario;
    if (id !== usrtkn._id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'estos no son tus datos'
        });
    }
    usuario_1.Usuario.findById(id, function (err, usuarioActualizado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos',
                err: err
            });
        }
        if (!usuarioActualizado) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El usuario no existe',
            });
        }
        usuarioActualizado.nombre = body.nombre;
        usuarioActualizado.apellido = body.apellido;
        usuarioActualizado.email = body.email;
        usuarioActualizado.password = body.password;
        usuarioActualizado.save(function (err, usuarioGuardado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar',
                    err: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                mensaje: 'usuario actualizado correctamente',
                usuario: usuarioGuardado
            });
        });
    });
});
//==================================
//Eliminar usuario
//==================================
usuarioRoutes.delete('/:id', function (req, res) {
    var id = req.params.id;
    usuario_1.Usuario.findByIdAndDelete(id, function (err, usuarioDel) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'no se puede borrar el usuario',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'usuario eliminado correctamente',
            usuarioDel: usuarioDel
        });
    });
});
exports.default = usuarioRoutes;
