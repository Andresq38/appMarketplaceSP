import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { servicioService } from '../services/servicio.service';

export class ServicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const servicios = await servicioService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicios,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const servicio = await servicioService.obtenerPorId(id);

            if (!servicio) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Servicio no encontrado",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicio,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorPerfil = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { perfilId } = request.params;
            const servicios = await servicioService.obtenerPorPerfil(perfilId);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicios,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { perfilId, categoriaId, nombre, descripcion, precio, duracionMinutos, modalidad } = request.body;

            const nuevoServicio = await servicioService.crear({
                perfilId,
                categoriaId,
                nombre,
                descripcion,
                precio,
                duracionMinutos,
                modalidad,
                estado: true,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevoServicio,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { nombre, descripcion, precio, duracionMinutos, modalidad, estado } = request.body;

            const servicioActualizado = await servicioService.actualizar(id, {
                nombre,
                descripcion,
                precio,
                duracionMinutos,
                modalidad,
                estado,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: servicioActualizado,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await servicioService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Servicio eliminado correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
