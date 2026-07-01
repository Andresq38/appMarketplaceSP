import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { uploadImage } from "../middlewares/image-config.middleware";

export class ImageRoutes {
    static get routes() {
        const router = Router();
        const imageController = new ImageController();

        router.post("/upload", uploadImage, imageController.upload);
        router.get("/files", imageController.getListFiles);
        router.get("/download/:name", imageController.download);
        return router;
    }
}
