import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreatePerfilProfesionalDto, UpdatePerfilProfesionalDto } from "../dtos/perfil-profesional.dto";

export const profesionalService = {
    // Utilidades
    async validateUsuario(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe");
        }
    },

    async validateEspecialidades(especialidadIds: number[]) {
        const count = await prisma.especialidad.count({
            where: {
                id: {
                    in: especialidadIds,
                },
            },
        });

        if (count !== especialidadIds.length) {
            throw AppError.badRequest("Una o más especialidades no existen");
        }
    },

    async listar() {
        return await prisma.perfilProfesional.findMany({
            include: {
                usuario: true,
                servicios: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async obtenerPorId(id: number) {
        const profesional = await prisma.perfilProfesional.findUnique({
            where: { id },
            include: {
                usuario: true,
                servicios: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });

        if (!profesional) {
            throw AppError.notFound("Profesional no encontrado");
        }

        return profesional;
    },

    async obtenerPorUsuarioId(usuarioId: number) {
        const profesional = await prisma.perfilProfesional.findFirst({
            where: { usuarioId },
            include: {
                usuario: true,
                servicios: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });

        if (!profesional) {
            throw AppError.notFound("Profesional no encontrado");
        }

        return profesional;
    },

    async crear(data: CreatePerfilProfesionalDto) {
        // Validar relaciones
        await this.validateUsuario(data.usuarioId);

        if (data.especialidadIds && data.especialidadIds.length > 0) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        // Validar que el usuario no tenga ya un perfil
        const perfilExistente = await prisma.perfilProfesional.findUnique({
            where: { usuarioId: data.usuarioId },
        });

        if (perfilExistente) {
            throw AppError.conflict("El usuario ya tiene un perfil profesional");
        }

        return await prisma.perfilProfesional.create({
            data: {
                usuarioId: data.usuarioId,
                titulo: data.titulo,
                descripcion: data.descripcion,
                aniosExperiencia: data.aniosExperiencia,
                modalidad: data.modalidad,
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito,
                tarifaBase: data.tarifaBase,
                imagen: data.imagen,
                disponible: true,
                activo: true,
                especialidades: data.especialidadIds
                    ? {
                        create: data.especialidadIds.map((id) => ({
                            especialidadId: id,
                        })),
                    }
                    : undefined,
            },
            include: {
                usuario: true,
                servicios: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async actualizar(id: number, data: UpdatePerfilProfesionalDto) {
        // Validar que el profesional exista
        const profesional = await prisma.perfilProfesional.findUnique({
            where: { id },
        });

        if (!profesional) {
            throw AppError.notFound("Profesional no encontrado");
        }

        // Validar especialidades si se actualizan
        if (data.especialidadIds) {
            if (data.especialidadIds.length > 0) {
                await this.validateEspecialidades(data.especialidadIds);
            }
        }

        return await prisma.perfilProfesional.update({
            where: { id },
            data: {
                titulo: data.titulo,
                descripcion: data.descripcion,
                aniosExperiencia: data.aniosExperiencia,
                modalidad: data.modalidad,
                provincia: data.provincia,
                canton: data.canton,
                distrito: data.distrito,
                tarifaBase: data.tarifaBase,
                imagen: data.imagen,
                disponible: data.disponible,
                activo: data.activo,
                especialidades: data.especialidadIds
                    ? {
                        deleteMany: {},
                        create: data.especialidadIds.map((id) => ({
                            especialidadId: id,
                        })),
                    }
                    : undefined,
            },
            include: {
                usuario: true,
                servicios: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async eliminar(id: number) {
        // Validar que el profesional exista
        const profesional = await prisma.perfilProfesional.findUnique({
            where: { id },
        });

        if (!profesional) {
            throw AppError.notFound("Profesional no encontrado");
        }

        return await prisma.perfilProfesional.delete({
            where: { id },
            include: {
                usuario: true,
            },
        });
    },
};
