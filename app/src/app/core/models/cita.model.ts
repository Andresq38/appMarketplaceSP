import { Usuario } from './usuario.model';
import { PerfilProfesional } from './perfil-profesional.model';
import { CitaHistorial } from './cita-historial.model';

export enum EstadoCita {
    PENDIENTE = 'PENDIENTE',
    ACEPTADA = 'ACEPTADA',
    RECHAZADA = 'RECHAZADA',
    CANCELADA = 'CANCELADA',
    COMPLETADA = 'COMPLETADA',
}

export enum ModalidadCita {
    VIRTUAL = 'VIRTUAL',
    PRESENCIAL = 'PRESENCIAL',
}

export interface Cita {
    id: number;
    clienteId: number;
    cliente?: Usuario;
    profesionalId: number;
    profesional?: PerfilProfesional;
    fechaCita: string;
    hora: string;
    estado: EstadoCita;
    modalidad: ModalidadCita;
    descripcion?: string;
    notas?: string;
    historial?: CitaHistorial[];
    createdAt: string;
    updatedAt: string;
}

export interface CitaCreateDto {
    clienteId: number;
    profesionalId: number;
    fechaCita: string;
    hora: string;
    estado?: EstadoCita;
    modalidad: ModalidadCita;
    descripcion?: string;
}

export interface CitaUpdateDto {
    estado?: EstadoCita;
    descripcion?: string;
    notas?: string;
    modalidad?: ModalidadCita;
    hora?: string;
    fechaCita?: string;
}
