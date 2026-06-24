import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { categoriaService } from '../services/categoria.service';

export class CategoriaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const categorias = await categoriaService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: categorias,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const categoria = await categoriaService.obtenerPorId(id);

            if (!categoria) { 
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Categoría no encontrada",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: categoria,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { nombre, descripcion } = request.body;

            const nuevoCategoria = await categoriaService.crear({
                nombre,
                descripcion,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevoCategoria,
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

            const categoriaActualizada = await categoriaService.actualizar(id, {
                nombre,
                descripcion,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: categoriaActualizada,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await categoriaService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Categoría eliminada correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
