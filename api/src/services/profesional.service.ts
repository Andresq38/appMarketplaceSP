import { prisma } from "../config/prisma";

export const profesionalService = {
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
        return await prisma.perfilProfesional.findFirst({
            where: { usuarioId },
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async crear(data: {
        usuarioId: string;
        titulo: string;
        descripcion: string;
        aniosExperiencia: number;
        modalidad: string;
        provincia: string;
        canton: string;
        distrito: string;
        tarifaBase: number;
        disponible?: boolean;
        activo?: boolean;
        imagen?: string;
    }) {
        return await prisma.perfilProfesional.create({
            data,
            include: {
                usuario: true,
                servicios: true,
                especialidades: true,
            },
        });
    },

    async actualizar(
        id: string,
        data: {
            titulo?: string;
            descripcion?: string;
            aniosExperiencia?: number;
            modalidad?: string;
            provincia?: string;
            canton?: string;
            distrito?: string;
            tarifaBase?: number;
            disponible?: boolean;
            activo?: boolean;
            imagen?: string;
        }
    ) {
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
            include: {
                usuario: true,
            },
        });
    },
};
