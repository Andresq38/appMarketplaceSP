import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { especialidadService } from '../services/especialidad.service';

export class EspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const especialidades = await especialidadService.listar();
        return sendSuccess(response, especialidades, "Especialidades listadas correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const especialidad = await especialidadService.obtenerPorId(id);
        return sendSuccess(response, especialidad, "Especialidad obtenida correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const especialidad = await especialidadService.crear(request.body);
        return sendSuccess(response, especialidad, "Especialidad creada correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const especialidad = await especialidadService.actualizar(id, request.body);
        return sendSuccess(response, especialidad, "Especialidad actualizada correctamente", StatusCodes.OK);
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await especialidadService.eliminar(id);
        return sendSuccess(response, null, "Especialidad eliminada correctamente", StatusCodes.OK);
    };
}
