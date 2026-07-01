export enum EstadoCita {
    PENDIENTE = 'PENDIENTE',
    ACEPTADA = 'ACEPTADA',
    RECHAZADA = 'RECHAZADA',
    CANCELADA = 'CANCELADA',
    COMPLETADA = 'COMPLETADA',
}

export interface CitaHistorial {
    id: number;
    citaId: number;
    estadoAnterior: EstadoCita;
    estadoNuevo: EstadoCita;
    motivo?: string;
    createdAt: string;
}

export interface CitaHistorialCreateDto {
    citaId: number;
    estadoAnterior: EstadoCita;
    estadoNuevo: EstadoCita;
    motivo?: string;
}
