import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateCategoriaDto, UpdateCategoriaDto } from "../dtos/categoria.dto";

export const categoriaService = {
    // Utilidades
    async validateCategoria(categoriaId: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id: categoriaId },
        });

        if (!categoria) {
            throw AppError.badRequest("La categoría indicada no existe");
        }
    },

    async listar() {
        return await prisma.categoria.findMany({
            include: {
                servicios: true,
            },
        });
    },

    async obtenerPorId(id: number) {
        const categoria = await prisma.categoria.findUnique({
            where: { id },
            include: {
                servicios: true,
            },
        });

        if (!categoria) {
            throw AppError.notFound("Categoría no encontrada");
        }

        return categoria;
    },

    async crear(data: CreateCategoriaDto) {
        // Validar que el nombre sea único
        const existente = await prisma.categoria.findUnique({
            where: { nombre: data.nombre },
        });

        if (existente) {
            throw AppError.conflict("Ya existe una categoría con ese nombre");
        }

        return await prisma.categoria.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                estado: true,
            },
            include: {
                servicios: true,
            },
        });
    },

    async actualizar(id: number, data: UpdateCategoriaDto) {
        // Validar que la categoría exista
        const categoria = await prisma.categoria.findUnique({
            where: { id },
        });

        if (!categoria) {
            throw AppError.notFound("Categoría no encontrada");
        }

        // Si se actualiza el nombre, validar que sea único
        if (data.nombre && data.nombre !== categoria.nombre) {
            const existente = await prisma.categoria.findUnique({
                where: { nombre: data.nombre },
            });

            if (existente) {
                throw AppError.conflict("Ya existe una categoría con ese nombre");
            }
        }

        // Construir objeto de actualización solo con campos definidos
        const updateData: any = {};
        if (data.nombre !== undefined) updateData.nombre = String(data.nombre);
        if (data.descripcion !== undefined) updateData.descripcion = String(data.descripcion);
        if (data.estado !== undefined) updateData.estado = Boolean(data.estado);

        return await prisma.categoria.update({
            where: { id },
            data: updateData,
            include: {
                servicios: true,
            },
        });
    },

    async eliminar(id: number) {
        // Validar que la categoría exista
        const categoria = await prisma.categoria.findUnique({
            where: { id },
        });

        if (!categoria) {
            throw AppError.notFound("Categoría no encontrada");
        }

        // Validar que no tenga servicios asociados
        const serviciosCount = await prisma.servicio.count({
            where: { categoriaId: id },
        });

        if (serviciosCount > 0) {
            throw AppError.conflict(
                "No se puede eliminar una categoría que tiene servicios asociados"
            );
        }

        return await prisma.categoria.delete({
            where: { id },
        });
    },
};