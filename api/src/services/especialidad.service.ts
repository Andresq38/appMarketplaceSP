import { prisma } from "../config/prisma";

export const especialidadService = {
    async listar() {
        return await prisma.especialidad.findMany();
    },

    async obtenerPorId(id: string) {
        return await prisma.especialidad.findUnique({
            where: { id },
        });
    },

    async crear(data: any) {
        return await prisma.especialidad.create({
            data,
        });
    },

    async actualizar(id: string, data: any) {
        return await prisma.especialidad.update({
            where: { id },
            data,
        });
    },

    async eliminar(id: string) {
        return await prisma.especialidad.delete({
            where: { id },
        });
    },
};