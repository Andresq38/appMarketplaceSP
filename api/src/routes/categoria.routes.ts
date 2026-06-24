import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";

export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new CategoriaController();

        // localhost:3000/api/categoria/
        router.get('/', controller.listar);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
