import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

const uploadDir = path.join(process.cwd(), "assets", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const uniqueName = `perfil${Date.now()}-${crypto.randomUUID()}${extension}`;

        cb(null, uniqueName);
    },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    const extension = path.extname(file.originalname).toLowerCase();
    
    // Permitir más MIME types que los navegadores pueden reportar
    const mimeTypesMap: Record<string, string[]> = {
        '.jpg': ['image/jpeg', 'image/jpg'],
        '.jpeg': ['image/jpeg', 'image/jpg'],
        '.png': ['image/png'],
        '.webp': ['image/webp']
    };

    const validMimes = mimeTypesMap[extension] || [];
    const isValidExtension = Object.keys(mimeTypesMap).includes(extension);
    const isValidMime = validMimes.includes(file.mimetype);

    if (!isValidExtension || !isValidMime) {
        return cb(new Error(`Tipo de archivo no permitido. Extensión: ${extension}, MIME: ${file.mimetype}`));
    }

    cb(null, true);
};

const multerUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
}).single("image");

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
    multerUpload(req, res, (err: unknown) => {
        if (err instanceof multer.MulterError) {
            const error = new Error(
                err.code === "LIMIT_FILE_SIZE" 
                    ? "La imagen no debe superar los 2 MB" 
                    : err.message
            );
            (error as any).statusCode = 400;
            return next(error);
        }
        if (err instanceof Error) {
            (err as any).statusCode = 400;
            return next(err);
        }
        next();
    });
};
