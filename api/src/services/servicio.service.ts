import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";

export const servicioService = {
    // Utilidades
    async validatePerfil(perfilId: number) {
        const perfil = await prisma.perfilProfesional.findUnique({
            where: { id: perfilId },
        });

        if (!perfil) {
            throw AppError.badRequest("El perfil profesional indicado no existe");
        }
    },

    async validateCategoria(categoriaId: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id: categoriaId },
        });

        if (!categoria) {
            throw AppError.badRequest("La categoría indicada no existe");
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
        return await prisma.servicio.findMany({
            include: {
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async obtenerPorId(id: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id },
            include: {
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });

        if (!servicio) {
            throw AppError.notFound("Servicio no encontrado");
        }

        return servicio;
    },

    async obtenerPorPerfilId(perfilId: number) {
        return await prisma.servicio.findMany({
            where: { perfilId },
            include: {
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async obtenerPorCategoriaId(categoriaId: number) {
        return await prisma.servicio.findMany({
            where: { categoriaId },
            include: {
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async crear(data: CreateServicioDto) {
        // Validar relaciones
        await this.validatePerfil(data.perfilId);
        await this.validateCategoria(data.categoriaId);
        
        if (data.especialidadIds && data.especialidadIds.length > 0) {
            await this.validateEspecialidades(data.especialidadIds);
        }

        return await prisma.servicio.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracionMinutos: data.duracionMinutos,
                modalidad: data.modalidad,
                estado: true,
                perfilId: data.perfilId,
                categoriaId: data.categoriaId,
                especialidades: data.especialidadIds
                    ? {
                        create: data.especialidadIds.map((id) => ({
                            especialidadId: id,
                        })),
                    }
                    : undefined,
            },
            include: {
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async actualizar(id: number, data: UpdateServicioDto) {
        // Validar que el servicio exista
        const servicio = await prisma.servicio.findUnique({
            where: { id },
        });

        if (!servicio) {
            throw AppError.notFound("Servicio no encontrado");
        }

        // Validar relaciones si se actualizan
        if (data.perfilId) {
            await this.validatePerfil(data.perfilId);
        }

        if (data.categoriaId) {
            await this.validateCategoria(data.categoriaId);
        }

        if (data.especialidadIds) {
            if (data.especialidadIds.length > 0) {
                await this.validateEspecialidades(data.especialidadIds);
            }
        }

        return await prisma.servicio.update({
            where: { id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                duracionMinutos: data.duracionMinutos,
                modalidad: data.modalidad,
                estado: data.estado,
                perfilId: data.perfilId,
                categoriaId: data.categoriaId,
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
                perfil: true,
                categoria: true,
                especialidades: {
                    include: {
                        especialidad: true,
                    },
                },
            },
        });
    },

    async eliminar(id: number) {
        // Validar que el servicio exista
        const servicio = await prisma.servicio.findUnique({
            where: { id },
        });

        if (!servicio) {
            throw AppError.notFound("Servicio no encontrado");
        }

        // Validar que no tenga citas asociadas
        const citasCount = await prisma.cita.count({
            where: { servicioId: id },
        });

        if (citasCount > 0) {
            throw AppError.conflict(
                "No se puede eliminar un servicio que tiene citas asociadas"
            );
        }

        return await prisma.servicio.delete({
            where: { id },
        });
    },
};
