import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { perfilProfesionalService } from '../services/perfilProfesional.service';

export class PerfilProfesionalController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const perfiles = await perfilProfesionalService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: perfiles,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const perfil = await perfilProfesionalService.obtenerPorId(id);

            if (!perfil) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Perfil profesional no encontrado",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: perfil,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorUsuario = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { usuarioId } = request.params;
            const perfil = await perfilProfesionalService.obtenerPorUsuarioId(usuarioId);

            if (!perfil) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Perfil profesional no encontrado para este usuario",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: perfil,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { usuarioId, titulo, descripcion, aniosExperiencia, modalidad, provincia, canton, distrito, tarifaBase } = request.body;

            const nuevoPerfil = await perfilProfesionalService.crear({
                usuarioId,
                titulo,
                descripcion,
                aniosExperiencia,
                modalidad,
                provincia,
                canton,
                distrito,
                tarifaBase,
                disponible: true,
                activo: true,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevoPerfil,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { titulo, descripcion, aniosExperiencia, modalidad, provincia, canton, distrito, tarifaBase, disponible, activo } = request.body;

            const perfilActualizado = await perfilProfesionalService.actualizar(id, {
                titulo,
                descripcion,
                aniosExperiencia,
                modalidad,
                provincia,
                canton,
                distrito,
                tarifaBase,
                disponible,
                activo,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: perfilActualizado,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await perfilProfesionalService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Perfil profesional eliminado correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
