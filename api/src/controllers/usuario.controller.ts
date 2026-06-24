import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from "http-status-codes";
import { usuarioService } from '../services/usuario.service';

export class UsuarioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const usuarios = await usuarioService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuarios,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const usuario = await usuarioService.obtenerPorId(id);

            if (!usuario) {
                return response.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuario,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { nombre, apellidos, email, password, telefono, rol } = request.body;
            
            const nuevoUsuario = await usuarioService.crear({
                nombre,
                apellidos,
                email,
                password,
                telefono,
                rol,
                estado: true,
            });

            return response.status(StatusCodes.CREATED).json({
                success: true,
                data: nuevoUsuario,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const { nombre, apellidos, email, telefono, rol, estado } = request.body;

            const usuarioActualizado = await usuarioService.actualizar(id, {
                nombre,
                apellidos,
                email,
                telefono,
                rol,
                estado,
            });

            return response.status(StatusCodes.OK).json({
                success: true,
                data: usuarioActualizado,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    eliminar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            await usuarioService.eliminar(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                message: "Usuario eliminado correctamente",
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}
