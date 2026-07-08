import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { CreateCitaDto, UpdateCitaDto } from "../dtos/cita.dto";

// Transformer para mapear campos de base de datos al formato del frontend
const transformCita = (cita: any) => {
    return {
        ...cita,
        profesionalId: cita.perfilProfesionalId,
        hora: cita.horaInicio,
    };
};

const transformCitas = (citas: any[]) => {
    return citas.map(transformCita);
};

export const citaService = {
    // Utilidades
    async validateCliente(clienteId: number) {
        const cliente = await prisma.usuario.findUnique({
            where: { id: clienteId },
        });

        if (!cliente) {
            throw AppError.badRequest("El cliente indicado no existe");
        }
    },

    async validateProfesional(perfilProfesionalId: number) {
        const profesional = await prisma.perfilProfesional.findUnique({
            where: { id: perfilProfesionalId },
        });

        if (!profesional) {
            throw AppError.badRequest("El profesional indicado no existe");
        }
    },

    async validateServicio(servicioId: number) {
        const servicio = await prisma.servicio.findUnique({
            where: { id: servicioId },
        });

        if (!servicio) {
            throw AppError.badRequest("El servicio indicado no existe");
        }
    },

    async listar() {
        const citas = await prisma.cita.findMany({
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true,
                    },
                },
                servicio: {
                    include: {
                        categoria: true,
                    },
                },
                historial: true,
                resena: true,
            },
        });
        return transformCitas(citas);
    },

    async obtenerPorId(id: number) {
        const cita = await prisma.cita.findUnique({
            where: { id },
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true,
                    },
                },
                servicio: {
                    include: {
                        categoria: true,
                    },
                },
                historial: true,
                resena: true,
            },
        });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        return transformCita(cita);
    },

    async obtenerPorCliente(clienteId: number) {
        await this.validateCliente(clienteId);

        const citas = await prisma.cita.findMany({
            where: { clienteId },
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true,
                    },
                },
                servicio: {
                    include: {
                        categoria: true,
                    },
                },
                historial: true,
                resena: true,
            },
        });
        return transformCitas(citas);
    },

    async obtenerPorProfesional(perfilProfesionalId: number) {
        await this.validateProfesional(perfilProfesionalId);

        const citas = await prisma.cita.findMany({
            where: { perfilProfesionalId },
            include: {
                cliente: true,
                profesional: {
                    include: {
                        usuario: true,
                    },
                },
                servicio: {
                    include: {
                        categoria: true,
                    },
                },
                historial: true,
                resena: true,
            },
        });
        return transformCitas(citas);
    },

    async crear(data: CreateCitaDto) {
        // Mapear profesionalId a perfilProfesionalId si es necesario
        const perfilProfesionalId = (data as any).profesionalId || (data as any).perfilProfesionalId;
        const horaInicio = data.horaInicio || (data as any).hora;
        const servicioId = (data as any).servicioId;

        // Validar que los campos obligatorios estén presentes
        if (!data.clienteId) {
            throw AppError.badRequest("El cliente es obligatorio");
        }
        if (!perfilProfesionalId) {
            throw AppError.badRequest("El profesional es obligatorio");
        }
        if (!horaInicio) {
            throw AppError.badRequest("La hora es obligatoria");
        }
        if (!data.fechaCita) {
            throw AppError.badRequest("La fecha es obligatoria");
        }

        // Validar relaciones
        await this.validateCliente(data.clienteId);
        await this.validateProfesional(perfilProfesionalId);

        // Si se proporciona servicioId, validarlo
        if (servicioId) {
            await this.validateServicio(servicioId);
        }

        const cita = await prisma.cita.create({
            data: {
                clienteId: data.clienteId,
                perfilProfesionalId,
                servicioId: servicioId || null,
                fechaSolicitada: (data as any).fechaSolicitada ? new Date((data as any).fechaSolicitada) : new Date(),
                fechaCita: data.fechaCita.includes('T') ? new Date(data.fechaCita) : new Date(data.fechaCita + 'T00:00:00'),
                horaInicio,
                horaFin: (data as any).horaFin || horaInicio,
                modalidad: data.modalidad || "VIRTUAL",
                descripcion: data.descripcion,
                monto: (data as any).monto || 0,
                estado: "PENDIENTE",
            },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
        return transformCita(cita);
    },

    async actualizar(id: number, data: UpdateCitaDto) {
        // Validar que la cita exista
        const citaExiste = await prisma.cita.findUnique({
            where: { id },
        });

        if (!citaExiste) {
            throw AppError.notFound("Cita no encontrada");
        }

        // Mapear profesionalId a perfilProfesionalId si es necesario
        const perfilProfesionalId = (data as any).profesionalId || data.perfilProfesionalId;

        // Validar relaciones si se actualizan
        if (data.clienteId) {
            await this.validateCliente(data.clienteId);
        }

        if (perfilProfesionalId) {
            await this.validateProfesional(perfilProfesionalId);
        }

        const cita = await prisma.cita.update({
            where: { id },
            data: {
                ...(data.clienteId && { clienteId: data.clienteId }),
                ...(perfilProfesionalId && { perfilProfesionalId }),
                ...(data.fechaCita && { fechaCita: new Date(data.fechaCita) }),
                ...(data.hora !== undefined && { horaInicio: data.hora }),
                ...(data.horaInicio !== undefined && { horaInicio: data.horaInicio }),
                ...(data.horaFin !== undefined && { horaFin: data.horaFin }),
                ...(data.modalidad !== undefined && { modalidad: data.modalidad }),
                ...(data.descripcion !== undefined && { descripcion: data.descripcion }),
                ...(data.estado !== undefined && { estado: data.estado }),
                ...(data.comentarioProfesional !== undefined && { comentarioProfesional: data.comentarioProfesional }),
                ...(data.motivoCancelacion !== undefined && { motivoCancelacion: data.motivoCancelacion }),
            },
            include: {
                cliente: true,
                profesional: true,
                servicio: true,
                historial: true,
                resena: true,
            },
        });
        return transformCita(cita);
    },

    async eliminar(id: number) {
        // Validar que la cita exista
        const cita = await prisma.cita.findUnique({
            where: { id },
        });

        if (!cita) {
            throw AppError.notFound("Cita no encontrada");
        }

        return await prisma.cita.delete({
            where: { id },
        });
    },
};