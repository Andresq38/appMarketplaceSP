import { Request, Response, NextFunction } from "express";
import { ImageService } from "../services/image.service";

const imageService = new ImageService();

export class ImageController {
    upload = async (request: Request, response: Response, next: NextFunction) => {
        try {
            if (!request.file) {
                return response.status(400).json({
                    success: false,
                    message: "No se envió imagen",
                });
            }

            response.status(200).json({
                success: true,
                message: "Imagen subida correctamente",
                data: {
                    nombreArchivo: request.file.filename,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    getListFiles = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const files = await imageService.listImages();
            response.status(200).json(files);
        } catch (error) {
            next(error);
        }
    };

    download = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const fileNameParam = request.params["name"];
            if (typeof fileNameParam !== "string") {
                return response.status(400).json({
                    message: "Nombre de imagen inválido",
                });
            }
            const filePath = imageService.getImagePath(fileNameParam);
            return response.download(filePath, fileNameParam);
        } catch (error) {
            next(error);
        }
    };
}
