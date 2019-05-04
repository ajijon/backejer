import { Router, Request, Response } from 'express';
import { Usuario } from '../modelos/usuario';
import bcrypt from 'bcrypt';
import jwd from 'jsonwebtoken';
import {SEED} from '../global/environment';
import verificatoken from '../middlewares/autentication';

const loginRoutes = Router();

loginRoutes.post('/', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (error, usuarioDB) => {
        
        if (error){
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usario',
                mess_err: error
            });
        }

        if (!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -email',
                mess_err: error
            });
        }

        //compara la contraseña enriptada
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){ //compara el pass ingresado con el de la BDg
            return res.status(400).json({
                ok: false,
                mensaje: 'credenciales incorrectas -password',
                mess_err: error
            });
        }

        const token = jwd.sign({usuario: usuarioDB}, SEED, { expiresIn:14400 });

        usuarioDB.password = ';)';

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB.id,
            token: token
        });
    });
});

export default loginRoutes;