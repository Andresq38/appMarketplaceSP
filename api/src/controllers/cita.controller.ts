import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { citaService } from '../services/cita.service';

export class CitaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const citas = await citaService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: citas,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const cita = await citaService.obtenerPorId(id);

            if (!cita) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Cita no encontrada",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: cita,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorCliente = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { clienteId } = request.params;
            const citas = await citaService.obtenerPorCliente(clienteId);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: citas,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorProfesional = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { perfilProfesionalId } = request.params;
            const citas = await citaService.obtenerPorProfesional(perfilProfesionalId);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: citas,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { clienteId, perfilProfesionalId, servicioId, fechaSolicitada, fechaCita, horaInicio, horaFin, modalidad, descripcion, monto } = request.body;

            const nuevaCita = await citaService.crear({
                clienteId,
                perfilProfesionalId,
                servicioId,
                fechaSolicitada,
                fechaCita,
                horaInicio,
                horaFin,
                modalidad,
                estado: "PENDIENTE",
                descripcion,
                monto,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevaCita,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { fechaCita, horaInicio, horaFin, modalidad, estado, descripcion, motivoCancelacion } = request.body;

            const citaActualizada = await citaService.actualizar(id, {
                fechaCita,
                horaInicio,
                horaFin,
                modalidad,
                estado,
                descripcion,
                motivoCancelacion,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: citaActualizada,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await citaService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Cita eliminada correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
