-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellidos` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `rol` ENUM('ADMIN', 'PROFESIONAL', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_profesional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `titulo` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `aniosExperiencia` INTEGER NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTO') NOT NULL,
    `provincia` VARCHAR(100) NOT NULL,
    `canton` VARCHAR(100) NOT NULL,
    `distrito` VARCHAR(100) NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL,
    `disponible` BOOLEAN NOT NULL DEFAULT true,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `imagen` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `perfil_profesional_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categoria_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `especialidad` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `especialidad_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_especialidad` (
    `perfilId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`perfilId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `perfilId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `nombre` VARCHAR(150) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracionMinutos` INTEGER NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL', 'MIXTO') NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicio_especialidad` (
    `servicioId` INTEGER NOT NULL,
    `especialidadId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`servicioId`, `especialidadId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` INTEGER NOT NULL,
    `perfilProfesionalId` INTEGER NOT NULL,
    `servicioId` INTEGER NOT NULL,
    `fechaSolicitada` DATETIME(3) NOT NULL,
    `fechaCita` DATETIME(3) NOT NULL,
    `horaInicio` VARCHAR(5) NOT NULL,
    `horaFin` VARCHAR(5) NOT NULL,
    `modalidad` ENUM('VIRTUAL', 'PRESENCIAL') NOT NULL,
    `estado` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    `descripcion` TEXT NULL,
    `comentarioProfesional` TEXT NULL,
    `motivoCancelacion` TEXT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cita_historial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citaId` INTEGER NOT NULL,
    `estadoAnterior` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL,
    `estadoNuevo` ENUM('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'COMPLETADA') NOT NULL,
    `comentario` VARCHAR(255) NULL,
    `fechaCambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resena` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `citaId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `perfilProfesionalId` INTEGER NOT NULL,
    `puntuacion` INTEGER NOT NULL,
    `comentario` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `resena_citaId_key`(`citaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `perfil_profesional` ADD CONSTRAINT `perfil_profesional_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_especialidad` ADD CONSTRAINT `perfil_especialidad_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfil_profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `perfil_especialidad` ADD CONSTRAINT `perfil_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_perfilId_fkey` FOREIGN KEY (`perfilId`) REFERENCES `perfil_profesional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio` ADD CONSTRAINT `servicio_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicio_especialidad` ADD CONSTRAINT `servicio_especialidad_especialidadId_fkey` FOREIGN KEY (`especialidadId`) REFERENCES `especialidad`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_perfilProfesionalId_fkey` FOREIGN KEY (`perfilProfesionalId`) REFERENCES `perfil_profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita` ADD CONSTRAINT `cita_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cita_historial` ADD CONSTRAINT `cita_historial_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `cita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resena` ADD CONSTRAINT `resena_citaId_fkey` FOREIGN KEY (`citaId`) REFERENCES `cita`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resena` ADD CONSTRAINT `resena_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resena` ADD CONSTRAINT `resena_perfilProfesionalId_fkey` FOREIGN KEY (`perfilProfesionalId`) REFERENCES `perfil_profesional`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
