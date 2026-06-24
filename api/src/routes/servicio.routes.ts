import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createServicioSchema, updateServicioSchema } from "../dtos/servicio.dto";
import { ServicioController } from "../controllers/servicio.controller";

export class ServicioRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ServicioController();

        // localhost:3000/api/servicio/
        router.get("/", asyncHandler(controller.listar));
        router.get("/perfil/:perfilId", asyncHandler(controller.obtenerPorPerfilId));
        router.get("/categoria/:categoriaId", asyncHandler(controller.obtenerPorCategoriaId));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createServicioSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updateServicioSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
