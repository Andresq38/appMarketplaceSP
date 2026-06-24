import { z } from "zod";

export const createEspecialidadSchema = z.object({
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

export const updateEspecialidadSchema = createEspecialidadSchema.partial().extend({
    estado: z.boolean().optional(),
});

export type CreateEspecialidadDto = z.infer<typeof createEspecialidadSchema>;
export type UpdateEspecialidadDto = z.infer<typeof updateEspecialidadSchema>;
