import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreatePerfilProfesionalDto, UpdatePerfilProfesionalDto } from "../dtos/perfil-profesional.dto";

// Función helper para transformar la respuesta de Prisma
function transformarPerfilProfesional(perfil: any) {
    if (!perfil) return perfil;
    
    try {
        // Verificar que especialidades existe y es un array
        const especialidadesTransformadas = Array.isArray(perfil.especialidades)
            ? perfil.especialidades
                .filter((pe: any) => pe && pe.especialidad)
                .map((pe: any) => pe.especialidad)
            : [];

        return {
            ...perfil,
            especialidades: especialidadesTransformadas,
        };
    } catch (error) {
        console.error('Error transformando perfil:', error, perfil);
        // Si hay error, devolver el perfil sin transformar
        return {
            ...perfil,
            especialidades: [],
        };
    }
}

export const perfilProfesionalService = {
    // Utilidades
    async validateUsuario(usuarioId: number) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId },
        });

        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe");
        }

        if (usuario.rol !== "PROFESIONAL") {
            throw AppError.badRequest("Solo los usuarios con rol PROFESIONAL pueden tener un perfil profesional");
        }

        if (usuario.estado !== false) {
            throw AppError.badRequest("El usuario debe estar desactivado (estado = false) para registrar un perfil profesional");
        }

        return usuario;
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
        const perfil = await prisma.perfilProfesional.findUnique({
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

        if (!perfil) {
            throw AppError.notFound("Perfil profesional no encontrado");
        }

        return perfil;
    },

    async obtenerPorUsuarioId(usuarioId: number) {
        const perfil = await prisma.perfilProfesional.findUnique({
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

        if (!perfil) {
            throw AppError.notFound("Perfil profesional no encontrado");
        }

        return perfil;
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
        // Validar que el perfil exista
        let perfil = await prisma.perfilProfesional.findUnique({
            where: { id },
            include: { usuario: true },
        });

        if (!perfil) {
            throw AppError.notFound("Perfil profesional no encontrado");
        }

        // Validar especialidades si se actualizan
        if (data.especialidadIds) {
            if (data.especialidadIds.length > 0) {
                await this.validateEspecialidades(data.especialidadIds);
            }
        }

        // Si se actualizan datos de usuario, hacerlo primero
        if (data.nombre || data.apellidos || data.email || data.telefono) {
            const usuarioUpdateData: any = {};
            if (data.nombre) usuarioUpdateData.nombre = data.nombre;
            if (data.apellidos) usuarioUpdateData.apellidos = data.apellidos;
            if (data.email) usuarioUpdateData.email = data.email;
            if (data.telefono) usuarioUpdateData.telefono = data.telefono;

            await prisma.usuario.update({
                where: { id: perfil.usuarioId },
                data: usuarioUpdateData,
            });
        }

        // Construir objeto de actualización dinámicamente
        let updateData: any = {};
        if (data.titulo !== undefined) updateData.titulo = data.titulo;
        if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
        if (data.aniosExperiencia !== undefined) updateData.aniosExperiencia = data.aniosExperiencia;
        if (data.modalidad !== undefined) updateData.modalidad = data.modalidad;
        if (data.provincia !== undefined) updateData.provincia = data.provincia;
        if (data.canton !== undefined) updateData.canton = data.canton;
        if (data.distrito !== undefined) updateData.distrito = data.distrito;
        if (data.tarifaBase !== undefined) updateData.tarifaBase = data.tarifaBase;
        if (data.imagen !== undefined) updateData.imagen = data.imagen;
        if (data.disponible !== undefined) updateData.disponible = data.disponible;
        if (data.activo !== undefined) updateData.activo = data.activo;

        if (data.especialidadIds) {
            updateData.especialidades = {
                deleteMany: {},
                create: data.especialidadIds.map((id) => ({
                    especialidadId: id,
                })),
            };
        }

        await prisma.perfilProfesional.update({
            where: { id },
            data: updateData,
        });

        return { id };
    },

    async eliminar(id: number) {
        // Validar que el perfil exista
        const perfil = await prisma.perfilProfesional.findUnique({
            where: { id },
        });

        if (!perfil) {
            throw AppError.notFound("Perfil profesional no encontrado");
        }

        return await prisma.perfilProfesional.delete({
            where: { id },
        });
    },
};