import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { servicioService } from '../services/servicio.service';

export class ServicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const servicios = await servicioService.listar();
        return sendSuccess(response, servicios, "Servicios listados correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.obtenerPorId(id);
        return sendSuccess(response, servicio, "Servicio obtenido correctamente", StatusCodes.OK);
    };

    obtenerPorPerfilId = async (request: Request, response: Response, next: NextFunction) => {
        const perfilId = parseId(request.params.perfilId);
        const servicios = await servicioService.obtenerPorPerfilId(perfilId);
        return sendSuccess(response, servicios, "Servicios del perfil obtenidos correctamente", StatusCodes.OK);
    };

    obtenerPorCategoriaId = async (request: Request, response: Response, next: NextFunction) => {
        const categoriaId = parseId(request.params.categoriaId);
        const servicios = await servicioService.obtenerPorCategoriaId(categoriaId);
        return sendSuccess(response, servicios, "Servicios de la categoría obtenidos correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const servicio = await servicioService.crear(request.body);
        return sendSuccess(response, servicio, "Servicio creado correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = parseId(request.params.id);
            console.log("🔵 Iniciando actualizar servicio:", id, request.body);
            const servicio = await servicioService.actualizar(id, request.body);
            console.log("🟢 Actualización exitosa, retornando:", servicio);
            return sendSuccess(response, servicio, "Servicio actualizado correctamente", StatusCodes.OK);
        } catch (error) {
            console.error("❌ Error en actualizar:", error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await servicioService.eliminar(id);
        return sendSuccess(response, null, "Servicio eliminado correctamente", StatusCodes.OK);
    };
}
