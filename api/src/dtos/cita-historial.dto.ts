import { z } from "zod";

export const createCitaHistorialSchema = z.object({
    citaId: z
        .number()
        .int()
        .positive("La cita es obligatoria"),
    estadoAnterior: z
        .enum(["PENDIENTE", "ACEPTADA", "RECHAZADA", "CANCELADA", "COMPLETADA"])
        .describe("Estado anterior de la cita"),
    estadoNuevo: z
        .enum(["PENDIENTE", "ACEPTADA", "RECHAZADA", "CANCELADA", "COMPLETADA"])
        .describe("Nuevo estado de la cita"),
    comentario: z
        .string()
        .trim()
        .max(255, "El comentario no puede superar 255 caracteres")
        .optional(),
});

export type CreateCitaHistorialDto = z.infer<typeof createCitaHistorialSchema>;
