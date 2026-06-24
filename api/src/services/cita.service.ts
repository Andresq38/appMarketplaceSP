import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateCitaDto, UpdateCitaDto } from "../dtos/cita.dto";

export const citaService = {
    // Utilidades
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

    async validateServicio(servicioId: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId },
        });

        if (!servicio) {
            throw AppError.badRequest("El servicio indicado no existe");
        }
    },

    async listar() {
        return await prisma.cita.findMany({
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
    },

    async obtenerPorId(id: number) {
        const cita = await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        return cita;
    },

    async obtenerPorCliente(clienteId: number) {
        await this.validateCliente(clienteId);

        return await prisma.cita.findMany({
            where: { clienteId },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
    },

    async obtenerPorProfesional(perfilProfesionalId: number) {
        await this.validateProfesional(perfilProfesionalId);

        return await prisma.cita.findMany({
            where: { perfilProfesionalId },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
    },

    async crear(data: CreateCitaDto) {
        // Validar relaciones
        await this.validateCliente(data.clienteId);
        await this.validateProfesional(data.perfilProfesionalId);
        await this.validateServicio(data.servicioId);

        return await prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                perfilProfesionalId: data.perfilProfesionalId,
                servicioId: data.servicioId,
                fechaSolicitada: new Date(data.fechaSolicitada),
                fechaCita: new Date(data.fechaCita),
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                modalidad: data.modalidad,
                descripcion: data.descripcion,
                monto: data.monto,
                estado: "PENDIENTE",
            },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
    },

    async actualizar(id: number, data: UpdateCitaDto) {
        // Validar que la cita exista
        const cita = await prisma.cita.findUnique({
            where: { id },
        });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        // Validar relaciones si se actualizan
        if (data.perfilProfesionalId) {
            await this.validateProfesional(data.perfilProfesionalId);
        }

        return await prisma.cita.update({
            where: { id },
            data: {
                perfilProfesionalId: data.perfilProfesionalId,
                fechaCita: data.fechaCita ? new Date(data.fechaCita) : undefined,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                modalidad: data.modalidad,
                descripcion: data.descripcion,
                estado: data.estado,
                comentarioProfesional: data.comentarioProfesional,
                motivoCancelacion: data.motivoCancelacion,
            },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
    },

    async eliminar(id: number) {
        // Validar que la cita exista
        const cita = await prisma.cita.findUnique({
            where: { id },
        });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        return await prisma.cita.delete({
            where: { id },
        });
    },
};