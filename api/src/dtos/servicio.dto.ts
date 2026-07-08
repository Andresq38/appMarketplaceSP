import { z } from "zod";

export const createServicioSchema = z.object({
    perfilId: z
        .number()
        .int()
        .positive("El perfil profesional es obligatorio"),
    categoriaId: z
        .number()
        .int()
        .positive("La categoría es obligatoria"),
    nombre: z
        .string()
        .trim()
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(150, "El nombre no puede superar 150 caracteres"),
    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no puede superar 500 caracteres")
        .optional(),
    precio: z
        .number({
            message: "El precio debe ser numérico",
        })
        .positive("El precio debe ser mayor a 0"),
    duracionMinutos: z
        .number()
        .int()
        .min(15, "La duración mínima es 15 minutos")
        .max(480, "La duración máxima es 480 minutos (8 horas)"),
    modalidad: z
        .enum(["VIRTUAL", "PRESENCIAL", "MIXTO"])
        .default("MIXTO"),
    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updateServicioSchema = z.object({
    categoriaId: z.number().int().optional(),
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number().optional(),
    duracionMinutos: z.number().int().optional(),
    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTO"]).optional(),
    estado: z.boolean().optional(),
    especialidadIds: z.array(z.number().int().positive()).optional(),
}).passthrough();

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;
