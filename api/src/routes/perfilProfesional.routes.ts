import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createPerfilProfesionalSchema, updatePerfilProfesionalSchema } from "../dtos/perfil-profesional.dto";
import { PerfilProfesionalController } from "../controllers/perfilProfesional.controller";

export class PerfilProfesionalRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new PerfilProfesionalController();

        // localhost:3000/api/perfil-profesional/
        router.get("/", asyncHandler(controller.listar));
        router.get("/usuario/:usuarioId", asyncHandler(controller.obtenerPorUsuarioId));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createPerfilProfesionalSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updatePerfilProfesionalSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
