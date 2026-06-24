import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createResenaSchema, updateResenaSchema } from "../dtos/resena.dto";
import { ResenaController } from "../controllers/resena.controller";

export class ResenaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ResenaController();

        // localhost:3000/api/resena/
        router.get("/", asyncHandler(controller.listar));
        router.get("/cita/:citaId", asyncHandler(controller.obtenerPorCitaId));
        router.get("/profesional/:perfilProfesionalId", asyncHandler(controller.obtenerPorProfesionalId));
        router.get("/cliente/:clienteId", asyncHandler(controller.obtenerPorClienteId));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createResenaSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updateResenaSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
