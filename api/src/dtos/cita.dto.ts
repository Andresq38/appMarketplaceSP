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
        .positive("El profesional es obligatorio")
        .optional(),
    profesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio")
        .optional(),
    servicioId: z
        .number()
        .int()
        .optional(),
    fechaSolicitada: z
        .string()
        .optional(),
    fechaCita: z
        .string(),
    horaInicio: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm")
        .optional(),
    hora: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm")
        .optional(),
    horaFin: z
        .string()
        .regex(horaRegex, "La hora debe estar en formato HH:mm")
        .optional(),
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
        .positive("El monto debe ser mayor a 0")
        .optional(),
}).refine(
    (data) => {
        // Validar que al menos uno de los profesionales sea provisto
        if (!data.perfilProfesionalId && !data.profesionalId) {
            return false;
        }
        return true;
    },
    {
        message: "El profesional es obligatorio",
        path: ["profesionalId"],
    }
).refine(
    (data) => {
        // Si ambas fechas son provistas, validar que fechaCita > fechaSolicitada
        if (data.fechaSolicitada && data.fechaCita) {
            return new Date(data.fechaCita) > new Date(data.fechaSolicitada);
        }
        return true;
    },
    {
        message: "La fecha de la cita debe ser posterior a la fecha solicitada",
        path: ["fechaCita"],
    }
);

export const updateCitaSchema = z.object({
    clienteId: z
        .number()
        .int()
        .positive("El cliente es obligatorio")
        .optional(),
    perfilProfesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio")
        .optional(),
    profesionalId: z
        .number()
        .int()
        .positive("El profesional es obligatorio")
        .optional(),
    fechaSolicitada: z
        .string()
        .optional(),
    fechaCita: z
        .string()
        .optional(),
    horaInicio: z
        .string()
        .optional(),
    horaFin: z
        .string()
        .optional(),
    hora: z
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
