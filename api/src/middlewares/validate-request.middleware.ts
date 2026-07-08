import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/app-error";

export function validateRequest(schema: ZodSchema) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const validationErrors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
                received: issue.path.length > 0 ? req.body?.[issue.path[0]] : req.body,
                code: issue.code,
            }));

            console.error('Validation errors:', {
                path: req.path,
                method: req.method,
                body: req.body,
                errors: validationErrors
            });

            throw AppError.badRequest("Datos de entrada inválidos", validationErrors);
        }

        req.body = result.data;
        next();
    };
}