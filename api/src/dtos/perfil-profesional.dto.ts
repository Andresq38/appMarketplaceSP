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
        .positive("La tarifa base debe ser mayor a 0"),
    imagen: z
        .string()
        .trim()
        .max(255, "La ruta de la imagen no puede superar 255 caracteres")
        .optional(),
    especialidadIds: z
        .array(z.number().int().positive())
        .optional(),
});

export const updatePerfilProfesionalSchema = createPerfilProfesionalSchema
    .omit({ usuarioId: true })
    .partial()
    .extend({
        disponible: z.boolean().optional(),
        activo: z.boolean().optional(),
        // Campos de Usuario para edición
        nombre: z
            .string()
            .trim()
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(100, "El nombre no puede superar 100 caracteres")
            .optional(),
        apellidos: z
            .string()
            .trim()
            .min(2, "Los apellidos deben tener al menos 2 caracteres")
            .max(100, "Los apellidos no pueden superar 100 caracteres")
            .optional(),
        email: z
            .string()
            .email("Email inválido")
            .optional(),
        telefono: z
            .string()
            .trim()
            .min(7, "El teléfono debe tener al menos 7 caracteres")
            .max(20, "El teléfono no puede superar 20 caracteres")
            .optional(),
    });

export type CreatePerfilProfesionalDto = z.infer<typeof createPerfilProfesionalSchema>;
export type UpdatePerfilProfesionalDto = z.infer<typeof updatePerfilProfesionalSchema>;
