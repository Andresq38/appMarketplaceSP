import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateResenaDto, UpdateResenaDto } from "../dtos/resena.dto";

export const resenaService = {
    // Utilidades
    async validateCita(citaId: number) {
        const cita = await prisma.cita.findUnique({
            where: { id: citaId },
        });

        if (!cita) {
            throw AppError.badRequest("La cita indicada no existe");
        }

        if (cita.estado !== "COMPLETADA") {
            throw AppError.badRequest("Solo se pueden reseñar citas completadas");
        }
    },

    async validateCliente(clienteId: number) {
        const cliente = await prisma.usuario.findUnique({
            where: { id: clienteId },
        });

        if (!cliente) {
            throw AppError.badRequest("El cliente indicado no existe");
        }
    },

    async validateProfesional(perfilProfesionalId: number) {
        const profesional = await prisma.perfilProfesional.findUnique({
            where: { id: perfilProfesionalId },
        });

        if (!profesional) {
            throw AppError.badRequest("El profesional indicado no existe");
        }
    },

    async listar() {
        return await prisma.resena.findMany({
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async obtenerPorId(id: number) {
        const resena = await prisma.resena.findUnique({
            where: { id },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });

        if (!resena) {
            throw AppError.notFound("Reseña no encontrada");
        }

        return resena;
    },

    async obtenerPorCita(citaId: number) {
        return await prisma.resena.findUnique({
            where: { citaId },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async obtenerPorProfesional(perfilProfesionalId: number) {
        return await prisma.resena.findMany({
            where: { perfilProfesionalId },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async obtenerPorCliente(clienteId: number) {
        return await prisma.resena.findMany({
            where: { clienteId },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async crear(data: CreateResenaDto) {
        // Validar relaciones
        await this.validateCita(data.citaId);
        await this.validateCliente(data.clienteId);
        await this.validateProfesional(data.perfilProfesionalId);

        // Validar que no exista una reseña para esa cita
        const resenaExistente = await prisma.resena.findUnique({
            where: { citaId: data.citaId },
        });

        if (resenaExistente) {
            throw AppError.conflict("Ya existe una reseña para esa cita");
        }

        return await prisma.resena.create({
            data: {
                citaId: data.citaId,
                clienteId: data.clienteId,
                perfilProfesionalId: data.perfilProfesionalId,
                puntuacion: data.puntuacion,
                comentario: data.comentario,
            },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async actualizar(id: number, data: UpdateResenaDto) {
        // Validar que la reseña exista
        const resena = await prisma.resena.findUnique({
            where: { id },
        });

        if (!resena) {
            throw AppError.notFound("Reseña no encontrada");
        }

        return await prisma.resena.update({
            where: { id },
            data: {
                puntuacion: data.puntuacion,
                comentario: data.comentario,
            },
            include: {
                cita: true,
                cliente: true,
                profesional: true,
            },
        });
    },

    async eliminar(id: number) {
        // Validar que la reseña exista
        const resena = await prisma.resena.findUnique({
            where: { id },
        });

        if (!resena) {
            throw AppError.notFound("Reseña no encontrada");
        }

        return await prisma.resena.delete({
            where: { id },
        });
    },
};
