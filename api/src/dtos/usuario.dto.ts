import { z } from "zod";

export const createUsuarioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede superar 100 caracteres"),
    apellidos: z
        .string()
        .trim()
        .min(2, "Los apellidos deben tener al menos 2 caracteres")
        .max(100, "Los apellidos no pueden superar 100 caracteres"),
    email: z
        .string()
        .trim()
        .email("El email debe ser válido")
        .max(150, "El email no puede superar 150 caracteres"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(255, "La contraseña no puede superar 255 caracteres"),
    telefono: z
        .string()
        .trim()
        .max(20, "El teléfono no puede superar 20 caracteres")
        .optional(),
    rol: z
        .enum(["ADMIN", "PROFESIONAL", "CLIENTE"])
        .default("CLIENTE"),
});

export const updateUsuarioSchema = createUsuarioSchema
    .omit({ email: true, password: true })
    .partial()
    .extend({
        email: z
            .string()
            .trim()
            .email("El email debe ser válido")
            .max(150, "El email no puede superar 150 caracteres")
            .optional(),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .max(255, "La contraseña no puede superar 255 caracteres")
            .optional(),
        estado: z.boolean().optional(),
    });

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;
