import { Router } from "express";
import { ServicioController } from "../controllers/servicio.controller";

export class ServicioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ServicioController();

        // localhost:3000/api/servicio/
        router.get('/', controller.listar);
        router.get('/perfil/:perfilId', controller.obtenerPorPerfil);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
