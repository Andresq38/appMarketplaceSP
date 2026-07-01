export interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoriaCreateDto {
    nombre: string;
    descripcion?: string;
    estado?: boolean;
}

export interface CategoriaUpdateDto {
    nombre?: string;
    descripcion?: string;
    estado?: boolean;
}
