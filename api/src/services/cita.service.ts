import { prisma } from "../config/prisma";

export const citaService = {
    async listar() {
        return await prisma.cita.findMany({
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async obtenerPorId(id: string) {
        return await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async obtenerPorCliente(clienteId: string) {
        return await prisma.cita.findMany({
            where: { clienteId },
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async obtenerPorProfesional(perfilProfesionalId: string) {
        return await prisma.cita.findMany({
            where: { perfilProfesionalId },
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async crear(data: any) {
        return await prisma.cita.create({
            data,
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async actualizar(id: string, data: any) {
        return await prisma.cita.update({
            where: { id },
            data,
            include: {
                cliente: true,
                perfilProfesional: true,
                servicio: true,
                historial: true,
            },
        });
    },

    async eliminar(id: string) {
        return await prisma.cita.delete({
            where: { id },
        });
    },
};