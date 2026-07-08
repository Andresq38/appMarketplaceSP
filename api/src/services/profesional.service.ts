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
        // Validar especialidades ANTES de la transacción
        if (data.especialidadIds && data.especialidadIds.length > 0) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        await prisma.$transaction(async (tx) => {
            const profesional = await tx.perfilProfesional.findUnique({
                where: { id },
            });

            if (!profesional) {
                throw AppError.notFound("Profesional no encontrado");
            }

            // Manejar especialidades por separado
            if (data.especialidadIds !== undefined) {
                await tx.perfilEspecialidad.deleteMany({
                    where: { perfilId: id },
                });

                if (data.especialidadIds.length > 0) {
                    await tx.perfilEspecialidad.createMany({
                        data: data.especialidadIds.map((especialidadId) => ({
                            perfilId: id,
                            especialidadId,
                        })),
                    });
                }
            }

            // Construir objeto de actualización solo con campos definidos
            let updateData: any = {};
            
            if (data.titulo !== undefined) updateData.titulo = data.titulo;
            if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
            if (data.aniosExperiencia !== undefined) updateData.aniosExperiencia = Number(data.aniosExperiencia);
            if (data.modalidad !== undefined) updateData.modalidad = data.modalidad;
            if (data.provincia !== undefined) updateData.provincia = data.provincia;
            if (data.canton !== undefined) updateData.canton = data.canton;
            if (data.distrito !== undefined) updateData.distrito = data.distrito;
            if (data.tarifaBase !== undefined) updateData.tarifaBase = Number(data.tarifaBase);
            if (data.imagen !== undefined) updateData.imagen = data.imagen;
            if (data.disponible !== undefined) updateData.disponible = Boolean(data.disponible);
            if (data.activo !== undefined) updateData.activo = Boolean(data.activo);

            await tx.perfilProfesional.update({
                where: { id },
                data: updateData,
            });
        });

        return { id };
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
