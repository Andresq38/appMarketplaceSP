import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { sendSuccess } from '../utils/http-response';
import { parseId } from '../utils/parse-id';
import { categoriaService } from '../services/categoria.service';

export class CategoriaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const categorias = await categoriaService.listar();
        return sendSuccess(response, categorias, "Categorías listadas correctamente", StatusCodes.OK);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const categoria = await categoriaService.obtenerPorId(id);
        return sendSuccess(response, categoria, "Categoría obtenida correctamente", StatusCodes.OK);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const categoria = await categoriaService.crear(request.body);
        return sendSuccess(response, categoria, "Categoría creada correctamente", StatusCodes.CREATED);
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const categoria = await categoriaService.actualizar(id, request.body);
        return sendSuccess(response, categoria, "Categoría actualizada correctamente", StatusCodes.OK);
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        await categoriaService.eliminar(id);
        return sendSuccess(response, null, "Categoría eliminada correctamente", StatusCodes.OK);
    };
}
