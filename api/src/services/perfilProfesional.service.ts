import { prisma } from "../config/prisma";

export const perfilProfesionalService = {
    async listar() {
        return await prisma.perfilProfesional.findMany({
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async obtenerPorId(id: string) {
        return await prisma.perfilProfesional.findUnique({
            where: { id },
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async obtenerPorUsuarioId(usuarioId: string) {
        return await prisma.perfilProfesional.findUnique({
            where: { usuarioId },
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async crear(data: any) {
        return await prisma.perfilProfesional.create({
            data,
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async actualizar(id: string, data: any) {
        return await prisma.perfilProfesional.update({
            where: { id },
            data,
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async eliminar(id: string) {
        return await prisma.perfilProfesional.delete({
            where: { id },
        });
    },
};