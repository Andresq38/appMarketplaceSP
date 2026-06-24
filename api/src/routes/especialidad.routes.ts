import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";

export class EspecialidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EspecialidadController();

        // localhost:3000/api/especialidad/
        router.get('/', controller.listar);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
