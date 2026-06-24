import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { citaService } from '../services/cita.service'; 

export class CitaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const citas = await citaService.listar();
        return sendSuccess(response, citas, "Citas listadas correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const cita = await citaService.obtenerPorId(id);
        return sendSuccess(response, cita, "Cita obtenida correctamente", StatusCodes.OK);
    };

    obtenerPorClienteId = async (request: Request, response: Response, next: NextFunction) => {
        const clienteId = parseId(request.params.clienteId);
        const citas = await citaService.obtenerPorCliente(clienteId);
        return sendSuccess(response, citas, "Citas del cliente obtenidas correctamente", StatusCodes.OK);
    };

    obtenerPorProfesionalId = async (request: Request, response: Response, next: NextFunction) => {
        const perfilProfesionalId = parseId(request.params.perfilProfesionalId);
        const citas = await citaService.obtenerPorProfesional(perfilProfesionalId);
        return sendSuccess(response, citas, "Citas del profesional obtenidas correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const cita = await citaService.crear(request.body);
        return sendSuccess(response, cita, "Cita creada correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const cita = await citaService.actualizar(id, request.body);
        return sendSuccess(response, cita, "Cita actualizada correctamente", StatusCodes.OK);
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await citaService.eliminar(id);
        return sendSuccess(response, null, "Cita eliminada correctamente", StatusCodes.OK);
    };
}
