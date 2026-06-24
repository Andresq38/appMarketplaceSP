import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createCategoriaSchema, updateCategoriaSchema } from "../dtos/categoria.dto";
import { CategoriaController } from "../controllers/categoria.controller";

export class CategoriaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new CategoriaController();

        // localhost:3000/api/categoria/
        router.get("/", asyncHandler(controller.listar));
        router.get("/:id", asyncHandler(controller.obtenerPorId));
        router.post(
            "/",
            validateRequest(createCategoriaSchema),
            asyncHandler(controller.crear)
        );
        router.put(
            "/:id",
            validateRequest(updateCategoriaSchema),
            asyncHandler(controller.actualizar)
        );
        router.delete("/:id", asyncHandler(controller.eliminar));

        return router;
    }
}
