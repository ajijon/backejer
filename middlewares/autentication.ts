import { Request, Response } from 'express';
import {verify} from 'jsonwebtoken';
import {SEED} from '../global/environment';

function verificaToken(req: Request, res: Response, next:any){
    const token: any = req.headers.authorization;  //token inyecta informacion al header mediante la palabra clave autorizacion
                                                   //(peticion, lugar, palabra clave)
    console.log(req.headers.authorization);
    
    verify(token, SEED, (err:any, decoded: any) => {   //verify verifica que exista un token y una semilla 
        if (err){                                      //y si son correctos que muestre la informacion del usuario
            return res.status(401).json({
                ok:false,
                mensaje: 'token incorrecto'
            });
        }
        req.body.usuario = decoded.usuario;  //inyecta los datos en la peticion. Se pide informacion del usuario 
        next();                              //next que el programa pase a lo siguiente              //y se decodifica como un token

    });
}
export default verificaToken;               //se exporta para utilizarse en otra parte del programa