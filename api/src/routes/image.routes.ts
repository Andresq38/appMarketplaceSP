import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { uploadImage } from "../middlewares/image-config.middleware";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class ImageRoutes {
    static get routes() {
        const router = Router();
        const imageController = new ImageController();

        router.post("/", uploadImage, asyncHandler(imageController.upload));
        router.get("/files", asyncHandler(imageController.getListFiles));
        router.get("/download/:name", asyncHandler(imageController.download));
        return router;
    }
}
