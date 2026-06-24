import { prisma } from "../config/prisma";

export const servicioService = {
    async listar() {
        return await prisma.servicio.findMany({
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async obtenerPorId(id: string) {
        return await prisma.servicio.findUnique({
            where: { id },
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async obtenerPorPerfilId(perfilId: string) {
        return await prisma.servicio.findMany({
            where: { perfilId },
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async obtenerPorCategoriaId(categoriaId: string) {
        return await prisma.servicio.findMany({
            where: { categoriaId },
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async crear(data: {
        perfilId: string;
        categoriaId: string;
        nombre: string;
        descripcion: string;
        precio: number;
        duracionMinutos: number;
        modalidad: string;
        estado?: boolean;
    }) {
        return await prisma.servicio.create({
            data,
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async actualizar(
        id: string,
        data: {
            nombre?: string;
            descripcion?: string;
            precio?: number;
            duracionMinutos?: number;
            modalidad?: string;
            estado?: boolean;
        }
    ) {
        return await prisma.servicio.update({
            where: { id },
            data,
            include: {
                perfil: true,
                categoria: true,
                especialidades: true,
            },
        });
    },

    async eliminar(id: string) {
        return await prisma.servicio.delete({
            where: { id },
        });
    },
};
