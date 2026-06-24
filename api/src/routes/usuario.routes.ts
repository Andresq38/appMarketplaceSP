import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createUsuarioSchema, updateUsuarioSchema } from "../dtos/usuario.dto";
import { UsuarioController } from "../controllers/usuario.controller";

export class UsuarioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new UsuarioController();

        // localhost:3000/api/usuario/
        router.get("/", asyncHandler(controller.listar));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createUsuarioSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updateUsuarioSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
