import { prisma } from "../config/prisma";

export const categoriaService = {
    async listar() {
        return await prisma.categoria.findMany();
    },

    async obtenerPorId(id: string) {
        return await prisma.categoria.findUnique({
            where: { id },
        });
    },

    async crear(data: any) {
        return await prisma.categoria.create({
            data,
        });
    },

    async actualizar(id: string, data: any) {
        return await prisma.categoria.update({
            where: { id },
            data,
        });
    },

    async eliminar(id: string) {
        return await prisma.categoria.delete({
            where: { id },
        });
    },
};