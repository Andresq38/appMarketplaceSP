import { z } from "zod";

export const createCategoriaSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede superar 100 caracteres"),
    descripcion: z
        .string()
        .trim()
        .max(255, "La descripción no puede superar 255 caracteres")
        .optional(),
});

export const updateCategoriaSchema = z.object({
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    estado: z.boolean().optional(),
}).passthrough();

export type CreateCategoriaDto = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoriaDto = z.infer<typeof updateCategoriaSchema>;
