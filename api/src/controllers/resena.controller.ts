import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { resenaService } from '../services/resena.service';

export class ResenaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const resenas = await resenaService.listar();
        return sendSuccess(response, resenas, "Reseñas listadas correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const resena = await resenaService.obtenerPorId(id);
        return sendSuccess(response, resena, "Reseña obtenida correctamente", StatusCodes.OK);
    };

    obtenerPorCitaId = async (request: Request, response: Response, next: NextFunction) => {
        const citaId = parseId(request.params.citaId);
        const resena = await resenaService.obtenerPorCita(citaId);
        return sendSuccess(response, resena, "Reseña de la cita obtenida correctamente", StatusCodes.OK);
    };

    obtenerPorProfesionalId = async (request: Request, response: Response, next: NextFunction) => {
        const perfilProfesionalId = parseId(request.params.perfilProfesionalId);
        const resenas = await resenaService.obtenerPorProfesional(perfilProfesionalId);
        return sendSuccess(response, resenas, "Reseñas del profesional obtenidas correctamente", StatusCodes.OK);
    };

    obtenerPorClienteId = async (request: Request, response: Response, next: NextFunction) => {
        const clienteId = parseId(request.params.clienteId);
        const resenas = await resenaService.obtenerPorCliente(clienteId);
        return sendSuccess(response, resenas, "Reseñas del cliente obtenidas correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const resena = await resenaService.crear(request.body);
        return sendSuccess(response, resena, "Reseña creada correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const resena = await resenaService.actualizar(id, request.body);
        return sendSuccess(response, resena, "Reseña actualizada correctamente", StatusCodes.OK);
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await resenaService.eliminar(id);
        return sendSuccess(response, null, "Reseña eliminada correctamente", StatusCodes.OK);
    };
}
