import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/usuario.dto";

export const usuarioService = {
    // Utilidades
    async validateUsuario(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe");
        }
    },

    async validateEmail(email: string, usuarioIdExcluir?: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { email },
        });

        if (usuario && (!usuarioIdExcluir || usuario.id !== usuarioIdExcluir)) {
            throw AppError.conflict("El email ya está registrado");
        }
    },

    async listar() {
        return await prisma.usuario.findMany({
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                rol: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                perfilProfesional: true,
                password: false,
            },
        });
    },

    async obtenerPorId(id: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                rol: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                perfilProfesional: true,
                password: false,
            },
        });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        return usuario;
    },

    async obtenerPorEmail(email: string) {
        return await prisma.usuario.findUnique({
            where: { email },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                rol: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                perfilProfesional: true,
                password: false,
            },
        });
    },

    async crear(data: CreateUsuarioDto) {
        // Validar que el email sea único
        await this.validateEmail(data.email);

        return await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellidos: data.apellidos,
                email: data.email,
                password: data.password,
                telefono: data.telefono,
                rol: data.rol,
                estado: true,
            },
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                rol: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                perfilProfesional: true,
                password: false,
            },
        });
    },

    async actualizar(id: number, data: UpdateUsuarioDto) {
        // Validar que el usuario exista
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        // Validar email único si se actualiza
        if (data.email && data.email !== usuario.email) {
            await this.validateEmail(data.email, id);
        }

        // Construir objeto de actualización solo con campos definidos
        const updateData: any = {};
        if (data.nombre !== undefined) updateData.nombre = String(data.nombre);
        if (data.apellidos !== undefined) updateData.apellidos = String(data.apellidos);
        if (data.email !== undefined) updateData.email = String(data.email);
        if (data.password !== undefined) updateData.password = String(data.password);
        if (data.telefono !== undefined) updateData.telefono = String(data.telefono);
        if (data.rol !== undefined) updateData.rol = String(data.rol);
        if (data.estado !== undefined) updateData.estado = Boolean(data.estado);

        return await prisma.usuario.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                nombre: true,
                apellidos: true,
                email: true,
                telefono: true,
                rol: true,
                estado: true,
                createdAt: true,
                updatedAt: true,
                perfilProfesional: true,
                password: false,
            },
        });
    },

    async eliminar(id: number) {
        // Validar que el usuario exista
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            throw AppError.notFound("Usuario no encontrado");
        }

        return await prisma.usuario.delete({
            where: { id },
        });
    },
};
