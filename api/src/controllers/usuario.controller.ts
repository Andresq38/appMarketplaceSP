import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { usuarioService } from '../services/usuario.service';

export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const usuarios = await usuarioService.listar();
        return sendSuccess(response, usuarios, "Usuarios listados correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const usuario = await usuarioService.obtenerPorId(id);
        return sendSuccess(response, usuario, "Usuario obtenido correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const usuario = await usuarioService.crear(request.body);
        return sendSuccess(response, usuario, "Usuario creado correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const usuario = await usuarioService.actualizar(id, request.body);
        return sendSuccess(response, usuario, "Usuario actualizado correctamente", StatusCodes.OK);
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await usuarioService.eliminar(id);
        return sendSuccess(response, null, "Usuario eliminado correctamente", StatusCodes.OK);
    };
}
