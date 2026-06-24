import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { especialidadService } from '../services/especialidad.service';

export class EspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const especialidades = await especialidadService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidades,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const especialidad = await especialidadService.obtenerPorId(id);

            if (!especialidad) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Especialidad no encontrada",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidad,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { nombre, descripcion } = request.body;

            const nuevoEspecialidad = await especialidadService.crear({
                nombre,
                descripcion,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevoEspecialidad,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { nombre, descripcion } = request.body;

            const especialidadActualizada = await especialidadService.actualizar(id, {
                nombre,
                descripcion,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: especialidadActualizada,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await especialidadService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Especialidad eliminada correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
