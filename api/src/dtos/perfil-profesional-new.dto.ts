import { z } from "zod";

export const createPerfilProfesionalSchema = z.object({
    usuarioId: z
        .number()
        .int()
        .positive("El usuario es obligatorio"),
    titulo: z
        .string()
        .trim()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(150, "El título no puede superar 150 caracteres"),
    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no puede superar 500 caracteres")
        .optional(),
    aniosExperiencia: z
        .number()
        .int()
        .min(0, "Los años de experiencia no pueden ser negativos")
        .max(70, "Los años de experiencia no pueden superar 70"),
    modalidad: z
        .enum(["VIRTUAL", "PRESENCIAL", "MIXTO"])
        .default("MIXTO"),
    provincia: z
        .string()
        .trim()
        .min(2, "La provincia debe tener al menos 2 caracteres")
        .max(100, "La provincia no puede superar 100 caracteres"),
    canton: z
        .string()
        .trim()
        .min(2, "El cantón debe tener al menos 2 caracteres")
        .max(100, "El cantón no puede superar 100 caracteres"),
    distrito: z
        .string()
        .trim()
        .min(2, "El distrito debe tener al menos 2 caracteres")
        .max(100, "El distrito no puede superar 100 caracteres"),
    tarifaBase: z
        .number()
        .min(1, "La tarifa base debe ser mayor a 0"),
    imagen: z
        .string()
        .trim()
        .max(255, "La ruta de la imagen no puede superar 255 caracteres")
        .optional(),
    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updatePerfilProfesionalSchema = z.object({
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    email: z.string().email("Email inválido").optional(),
    telefono: z.string().optional(),
    titulo: z.string().optional(),
    descripcion: z.string().optional(),
    aniosExperiencia: z.number().int().optional(),
    modalidad: z.enum(["VIRTUAL", "PRESENCIAL", "MIXTO"]).optional(),
    provincia: z.string().optional(),
    canton: z.string().optional(),
    distrito: z.string().optional(),
    tarifaBase: z.number().optional(),
    imagen: z.string().nullable().optional(),
    disponible: z.boolean().optional(),
    activo: z.boolean().optional(),
    especialidadIds: z.array(z.number().int().positive()).optional(),
}).passthrough();

export type CreatePerfilProfesionalDto = z.infer<typeof createPerfilProfesionalSchema>;
export type UpdatePerfilProfesionalDto = z.infer<typeof updatePerfilProfesionalSchema>;
