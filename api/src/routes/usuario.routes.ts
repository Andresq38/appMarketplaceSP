import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();

        // localhost:3000/api/usuario/
        router.get('/', controller.listar);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
