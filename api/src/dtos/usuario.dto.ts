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

export const updateUsuarioSchema = z.object({
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    telefono: z.string().optional(),
    rol: z.enum(["ADMIN", "PROFESIONAL", "CLIENTE"]).optional(),
    estado: z.boolean().optional(),
}).passthrough();

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;
