import { Router } from "express";
import { PerfilProfesionalController } from "../controllers/perfilProfesional.controller";

export class PerfilProfesionalRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new PerfilProfesionalController();

        // localhost:3000/api/perfil-profesional/
        router.get('/', controller.listar);
        router.get('/usuario/:usuarioId', controller.obtenerPorUsuario);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
