import { PerfilProfesional } from './perfil-profesional.model';

export enum RolUsuario {
    ADMIN = 'ADMIN',
    PROFESIONAL = 'PROFESIONAL',
    CLIENTE = 'CLIENTE',
}

export interface Usuario {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    rol: RolUsuario;
    estado: boolean;
    perfilProfesional?: PerfilProfesional;
    createdAt: string;
    updatedAt: string;
}

export interface UsuarioCreateDto {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;
    telefono?: string;
    rol?: RolUsuario;
    estado?: boolean;
}

export interface UsuarioUpdateDto {
    nombre?: string;
    apellidos?: string;
    email?: string;
    telefono?: string;
    estado?: boolean;
}
