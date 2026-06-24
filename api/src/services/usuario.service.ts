import { prisma } from "../config/prisma";

export const usuarioService = {
    async listar() {
        return await prisma.usuario.findMany();
    },

    async obtenerPorId(id: string) {
        return await prisma.usuario.findUnique({
            where: { id },
        });
    },

    async obtenerPorEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: { email },
        });
    },

    async crear(data: {
        nombre: string;
        apellidos: string;
        email: string;
        password: string;
        telefono: string;
        rol: string;
    }) {
        return await prisma.usuario.create({
            data,
        });
    },

    async actualizar(
        id: string,
        data: {
            nombre?: string;
            apellidos?: string;
            email?: string;
            password?: string;
            telefono?: string;
            rol?: string;
            estado?: boolean;
        }
    ) {
        return await prisma.usuario.update({
            where: { id },
            data,
        });
    },

    async eliminar(id: string) {
        return await prisma.usuario.delete({
            where: { id },
        });
    },
};
