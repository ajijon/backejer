import { Router, Request, Response } from 'express';
import Server from '../clases/server';
import { Usuario}  from '../modelos/usuario';
import bcrypt from 'bcrypt';
import bodyparser = require('body-parser');
import { IUsuario } from '../interfaces/usuario';
import { request } from 'https'; 
import verificaToken from '../middlewares/autentication';

const usuarioRoutes = Router();

//==================================
//Crear usuario
//==================================
usuarioRoutes.post('/', verificaToken, (req: Request, res: Response) => {  //usuarioRoutes es nuestra ruta
    const body: IUsuario = req.body;   //body de tipo interfaz IUsuario, (req: es una peticion) que es igual a una peticion alojada en el body
    const usuario = new Usuario({      // const usuario crea una instancia del modelo usuario (new) instancia
        
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        role: body.role,
        password: bcrypt.hashSync(body.password, 10)

    });

    usuario.save((err:any, usuarioGuardado) => { 
        if (err){                                //el if es una funcion de condicion
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                err: err

            });
            
        }
        usuarioGuardado.password = ':)'

        res.status(200).json({
            ok: true,
            mensaje: 'usuario guardado'
        
        });

    });

});

//==================================
//Enlistar usuarios
//==================================
usuarioRoutes.get('/'), verificaToken, (req: Request, res: Response) => {
    Usuario.find((err: any, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                message: 'Error en la base de datos',
                err: err
            });
        }

        res.status(200).json({
            ok:true,
            usuario:usuarioDB
        });
    });
};

//==================================
//Enlistar usuarios con paginacion
//================================== // get('/:desde?/:limit? se especifica la ruta y que requiere el valor de var desde y limit
usuarioRoutes.get('/:desde?/:limit?', verificaToken, (req: Request, res: Response) => {
    const admin = req.body.usuario;

    if (admin.role !== 'ADMIN_ROLE'){                                      //( !== ) diferente de
        return res.status(401).json({                                      //toda la informacion esta en el token
            ok: false,
            mensaje: 'se require permisos de administrador'
        });
    }

    var desde = req.params.desde || 0;  //indica que es la 1er pagina a mostrar, var que recibe parametros x url x medio de params      
    desde = Number(desde);

    var limit = req.params.limit || 7; //permite elegir cuantos registros mostrar en cada consulta
    limit = Number (limit);


    Usuario.find({ }, 'nombre apellido email password role')
        .skip(desde)                  //funcion de mongoose que omite registros, su variable indica que es la 1er pagina a mostrar
        .limit(limit)                                       //permite elegir cuantos registros mostrar en cada consulta
        .exec((err: any, usuarios) => {                     //excecute ejecuta la consulta

            if (err){
                res.status(500).json({
                   ok: false,
                   mensaje: 'error en la base de datos',
                   err: err
                });
            }
            Usuario.countDocuments({ }, (err, conteo) => { //contabiliza todos tus registros de la consulta realizada

                if(err){
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
usuarioRoutes.post('/buscar', verificaToken, (req: Request, res: Response) => {  

    const admin = req.body.usuario;   //debemos de saber donde buscar si en el header o en el body
    let regex = new RegExp( admin, 'i')

    if(admin.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            mensaje: 'no eres adminsitrador'

        });
    }

    Usuario.find(
        { $or: [{nombre: regex}, {apellido: regex}, {email: regex}, {role: regex}]},
        'nombre apellido email role')

        .exec((err: any, usuarioEnc) => {

            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error en la base de datos al buscar usuario',
                    err: err
                });
            }

            if(admin.role == 'ADMIN_ROLE'){
                res.status(200).json({
                    ok: true,
                    resultados: usuarioEnc,
                    total: usuarioEnc.length     //length muestra el numero total de resultados
                });
            }
                
        });

});

//==================================
//buscar usario por filtro de ROLES admin o user TAREA X CONCLUIR grab 5 min 40
//==================================
usuarioRoutes.post('/aduse', verificaToken, (req: Request, res: Response) => {

    const admin = req.body.usuario;
    let regex = new RegExp(admin, 'i') // 'i' que ignore si es mayuscula o minuscula

    if (admin.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            message: 'No eres administrador'
        });
    }

    Usuario.find({nombre:regex}, 'nombre')
       .exec((err: any, usuarioEnc) => { //no dejar espacios .find({W:regex} porque no muestra nada

            if(err){
                return res.status(500).json({
                    ok: false,
                    message: 'error en la base de datos',
                    err:err
                });
            }

           if(err){
                return res.status(404).json({
                    ok: false,
                    message: 'no existe usuario con letra N'

                });
            }

            res.status(200).json({
               ok: true,
               resultados: usuarioEnc,            //evitar ponerle el length por que no los enlista
               total: usuarioEnc.length
            });
       });
});

//==================================
//buscar usario por rol admin           
//==================================
usuarioRoutes.post('/role', verificaToken, (req: Request, res: Response) => {

    const admin = req.body.usuario;

    console.log(admin);

    if (admin.role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            ok: false,
            mensaje: 'no eres administrador'
        });
    }
                    //peticion (req), lugar(body) y ubicacion(usuario)
const usuario: any = req.body.usuario;                       //debemos de saber donde buscar si en el header o en el body
    let regex = new RegExp( usuario, 'i')

    Usuario.find({ $or: [{nombre: regex}, {apellido: regex}, {email: regex}, {role: regex}]},  //busca coincidencias
        'nombre apellido email role')                                              //imprime lo encontrado en pantalla

        .exec((err: any, usuarioEnc) => {

            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error en la base de datos al buscar usario',
                    err: err
                });
            }

            res.status(200).json({
                ok: true,
                resultados: usuarioEnc,
                total: usuarioEnc.length     //length muestra el numero total de resultados
            });
        });

});


//==================================
//Modificar usuario
//==================================
usuarioRoutes.put('/:id',verificaToken, (req: Request, res: Response) => { 
    const id = req.params.id;
    const body = req.body;
    const usrtkn = req.body.usuario;

    if (id !== usrtkn._id){                                   ///????????
        return res.status(400).json({
            ok: false,
            mensaje: 'estos no son tus datos'
        });
    }


    Usuario.findById(id, (err, usuarioActualizado) => {
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'error en la base de datos',
                err: err
            });
        }

        if (!usuarioActualizado){
            return res.status(404).json({
                ok: false,
                mensaje: 'El usuario no existe',
            });
        }
        usuarioActualizado.nombre = body.nombre;
        usuarioActualizado.apellido = body.apellido;
        usuarioActualizado.email = body.email;
        usuarioActualizado.password = body.password;
        usuarioActualizado.role = body.role;

        usuarioActualizado.save((err, usuarioGuardado) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al actualizar',
                    err: err
                });
            }
            usuarioGuardado.password = ':)'

            res.status(200).json({
                ok:true,
                mensaje: 'usuario actualizado correctamente',
                usuario: usuarioGuardado
            });

        });

    });
});


//==================================
//Eliminar usuario
//==================================
usuarioRoutes.delete('/:id', (req: Request, res: Response) => {
    const id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioDel) => {
        if (err){
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




export default usuarioRoutes;