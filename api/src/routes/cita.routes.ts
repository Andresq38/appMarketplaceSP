import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";

export class CitaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new CitaController();

        // localhost:3000/api/cita/
        router.get('/', controller.listar);
        router.get('/cliente/:clienteId', controller.obtenerPorCliente);
        router.get('/profesional/:perfilProfesionalId', controller.obtenerPorProfesional);
        router.get('/:id', controller.obtenerPorId);
        router.post('/', controller.crear);
        router.put('/:id', controller.actualizar);
        router.delete('/:id', controller.eliminar);

        return router;
    }
}
