import { Usuario } from './usuario.model';
import { Especialidad } from './especialidad.model';
import { Servicio } from './servicio.model';
import { Cita } from './cita.model';
import { Resena } from './resena.model';

export enum ModalidadServicio {
    VIRTUAL = 'VIRTUAL',
    PRESENCIAL = 'PRESENCIAL',
    MIXTO = 'MIXTO',
}

export interface PerfilProfesional {
    id: number;
    usuarioId: number;
    usuario?: Usuario;
    titulo: string;
    descripcion?: string;
    aniosExperiencia: number;
    modalidad: ModalidadServicio;
    provincia: string;
    canton: string;
    distrito: string;
    tarifaBase: number | string;
    disponible: boolean;
    activo: boolean;
    imagen?: string;
    servicios?: Servicio[];
    citasComoProfesional?: Cita[];
    resenas?: Resena[];
    especialidades?: Especialidad[];
    createdAt: string;
    updatedAt: string;
}

export interface PerfilProfesionalCreateDto {
    usuarioId: number;
    titulo: string;
    descripcion?: string;
    aniosExperiencia: number;
    modalidad: ModalidadServicio;
    provincia: string;
    canton: string;
    distrito: string;
    tarifaBase: number;
    disponible?: boolean;
    activo?: boolean;
    imagen?: string;
    especialidadIds?: number[];
}

export interface PerfilProfesionalUpdateDto {
    titulo?: string;
    descripcion?: string;
    aniosExperiencia?: number;
    modalidad?: ModalidadServicio;
    provincia?: string;
    canton?: string;
    distrito?: string;
    tarifaBase?: number;
    disponible?: boolean;
    activo?: boolean;
    imagen?: string;
    especialidadIds?: number[];
}
