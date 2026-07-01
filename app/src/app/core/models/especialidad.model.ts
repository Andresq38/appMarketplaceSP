export interface Especialidad {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EspecialidadCreateDto {
    nombre: string;
    descripcion?: string;
    estado?: boolean;
}

export interface EspecialidadUpdateDto {
    nombre?: string;
    descripcion?: string;
    estado?: boolean;
}
