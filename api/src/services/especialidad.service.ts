import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateEspecialidadDto, UpdateEspecialidadDto } from "../dtos/especialidad.dto";

export const especialidadService = {
    // Utilidades
    async validateEspecialidad(especialidadId: number) {
        const especialidad = await prisma.especialidad.findUnique({
            where: { id: especialidadId },
        });

        if (!especialidad) {
            throw AppError.badRequest("La especialidad indicada no existe");
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
        return await prisma.especialidad.findMany({
            include: {
                perfiles: true,
                servicios: true,
            },
        });
    },

    async obtenerPorId(id: number) {
        const especialidad = await prisma.especialidad.findUnique({
            where: { id },
            include: {
                perfiles: true,
                servicios: true,
            },
        });

        if (!especialidad) {
            throw AppError.notFound("Especialidad no encontrada");
        }

        return especialidad;
    },

    async crear(data: CreateEspecialidadDto) {
        // Validar que el nombre sea único
        const existente = await prisma.especialidad.findUnique({
            where: { nombre: data.nombre },
        });

        if (existente) {
            throw AppError.conflict("Ya existe una especialidad con ese nombre");
        }

        return await prisma.especialidad.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                estado: true,
            },
            include: {
                perfiles: true,
                servicios: true,
            },
        });
    },

    async actualizar(id: number, data: UpdateEspecialidadDto) {
        // Validar que la especialidad exista
        const especialidad = await prisma.especialidad.findUnique({
            where: { id },
        });

        if (!especialidad) {
            throw AppError.notFound("Especialidad no encontrada");
        }

        // Si se actualiza el nombre, validar que sea único
        if (data.nombre && data.nombre !== especialidad.nombre) {
            const existente = await prisma.especialidad.findUnique({
                where: { nombre: data.nombre },
            });

            if (existente) {
                throw AppError.conflict("Ya existe una especialidad con ese nombre");
            }
        }

        // Construir objeto de actualización solo con campos definidos
        const updateData: any = {};
        if (data.nombre !== undefined) updateData.nombre = String(data.nombre);
        if (data.descripcion !== undefined) updateData.descripcion = String(data.descripcion);
        if (data.estado !== undefined) updateData.estado = Boolean(data.estado);

        return await prisma.especialidad.update({
            where: { id },
            data: updateData,
            include: {
                perfiles: true,
                servicios: true,
            },
        });
    },

    async eliminar(id: number) {
        // Validar que la especialidad exista
        const especialidad = await prisma.especialidad.findUnique({
            where: { id },
        });

        if (!especialidad) {
            throw AppError.notFound("Especialidad no encontrada");
        }

        return await prisma.especialidad.delete({
            where: { id },
        });
    },
};