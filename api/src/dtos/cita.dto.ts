import { z } from "zod";

const horaRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const createCitaSchema = z.object({
    clienteId: z
        .number()
        .int()
        .positive("El cliente es obligatorio"),
    perfilProfesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio"),
    servicioId: z
        .number()
        .int()
        .positive("El servicio es obligatorio"),
    fechaSolicitada: z
        .string()
        .datetime("La fecha solicitada debe ser válida"),
    fechaCita: z
        .string()
        .datetime("La fecha de la cita debe ser válida"),
    horaInicio: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm"),
    horaFin: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm"),
    modalidad: z
        .enum(["VIRTUAL", "PRESENCIAL"])
        .default("VIRTUAL"),
    descripcion: z
        .string()
        .trim()
        .max(500, "La descripción no puede superar 500 caracteres")
        .optional(),
    monto: z
        .number()
        .positive("El monto debe ser mayor a 0"),
}).refine(
    (data) => new Date(data.fechaCita) > new Date(data.fechaSolicitada),
    {
        message: "La fecha de la cita debe ser posterior a la fecha solicitada",
        path: ["fechaCita"],
    }
);

export const updateCitaSchema = z.object({
    perfilProfesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio")
        .optional(),
    fechaSolicitada: z
        .string()
        .datetime("La fecha solicitada debe ser válida")
        .optional(),
    fechaCita: z
        .string()
        .datetime("La fecha de la cita debe ser válida")
        .optional(),
    horaInicio: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm")
        .optional(),
    horaFin: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm")
        .optional(),
    modalidad: z
        .enum(["VIRTUAL", "PRESENCIAL"])
        .optional(),
    descripcion: z
        .string()
        .trim()
        .max(500, "La descripción no puede superar 500 caracteres")
        .optional(),
    monto: z
        .number()
        .positive("El monto debe ser mayor a 0")
        .optional(),
    estado: z
        .enum(["PENDIENTE", "ACEPTADA", "RECHAZADA", "CANCELADA", "COMPLETADA"])
        .optional(),
    comentarioProfesional: z
        .string()
        .trim()
        .max(500, "El comentario no puede superar 500 caracteres")
        .optional(),
    motivoCancelacion: z
        .string()
        .trim()
        .max(500, "El motivo no puede superar 500 caracteres")
        .optional(),
});

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;
