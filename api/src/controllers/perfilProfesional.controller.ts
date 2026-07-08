import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { perfilProfesionalService } from '../services/perfilProfesional.service';

export class PerfilProfesionalController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const perfiles = await perfilProfesionalService.listar();
        return sendSuccess(response, perfiles, "Perfiles profesionales listados correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const perfil = await perfilProfesionalService.obtenerPorId(id);
        return sendSuccess(response, perfil, "Perfil profesional obtenido correctamente", StatusCodes.OK);
    };

    obtenerPorUsuarioId = async (request: Request, response: Response, next: NextFunction) => {
        const usuarioId = parseId(request.params.usuarioId);
        const perfil = await perfilProfesionalService.obtenerPorUsuarioId(usuarioId);
        return sendSuccess(response, perfil, "Perfil profesional del usuario obtenido correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const perfil = await perfilProfesionalService.crear(request.body);
        return sendSuccess(response, perfil, "Perfil profesional creado correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = parseId(request.params.id);
            console.log("🔵 Iniciando actualizar perfil:", id, request.body);
            const perfil = await perfilProfesionalService.actualizar(id, request.body);
            console.log("🟢 Actualización exitosa, retornando:", perfil);
            return sendSuccess(response, perfil, "Perfil profesional actualizado correctamente", StatusCodes.OK);
        } catch (error) {
            console.error("❌ Error en actualizar:", error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await perfilProfesionalService.eliminar(id);
        return sendSuccess(response, null, "Perfil profesional eliminado correctamente", StatusCodes.OK);
    };
}
