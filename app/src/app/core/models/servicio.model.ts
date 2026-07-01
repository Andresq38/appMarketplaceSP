import { Categoria } from './categoria.model';
import { PerfilProfesional } from './perfil-profesional.model';
import { Especialidad } from './especialidad.model';

export enum ModalidadServicio {
    VIRTUAL = 'VIRTUAL',
    PRESENCIAL = 'PRESENCIAL',
    MIXTO = 'MIXTO',
}

export interface Servicio {
    id: number;
    perfilId: number;
    perfil?: PerfilProfesional;
    categoriaId: number;
    categoria?: Categoria;
    nombre: string;
    descripcion?: string;
    precio: number | string;
    duracionMinutos: number;
    modalidad: ModalidadServicio;
    estado: boolean;
    especialidades?: Especialidad[];
    createdAt: string;
    updatedAt: string;
}

export interface ServicioCreateDto {
    perfilId: number;
    categoriaId: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    duracionMinutos: number;
    modalidad: ModalidadServicio;
    estado?: boolean;
    especialidadIds?: number[];
}

export interface ServicioUpdateDto {
    nombre?: string;
    descripcion?: string;
    precio?: number;
    duracionMinutos?: number;
    modalidad?: ModalidadServicio;
    estado?: boolean;
    especialidadIds?: number[];
}
