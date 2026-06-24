import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createEspecialidadSchema, updateEspecialidadSchema } from "../dtos/especialidad.dto";
import { EspecialidadController } from "../controllers/especialidad.controller";

export class EspecialidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EspecialidadController();

        // localhost:3000/api/especialidad/
        router.get("/", asyncHandler(controller.listar));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createEspecialidadSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updateEspecialidadSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
