import { Usuario } from './usuario.model';
import { PerfilProfesional } from './perfil-profesional.model';

export interface Resena {
    id: number;
    clienteId: number;
    cliente?: Usuario;
    profesionalId: number;
    profesional?: PerfilProfesional;
    calificacion: number;
    comentario?: string;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ResenaCreateDto {
    clienteId: number;
    profesionalId: number;
    calificacion: number;
    comentario?: string;
    estado?: boolean;
}

export interface ResenaUpdateDto {
    calificacion?: number;
    comentario?: string;
    estado?: boolean;
}
