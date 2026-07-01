//import { RolUsuario } from "../generated/prisma"; 
import { RolUsuario, EstadoCita } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma"; 
 
async function main() { 
    console.log("Iniciando seed..."); 
    
    // 1. Limpieza de datos 
    const models = [
        prisma.resena,
        prisma.citaHistorial,
        prisma.cita,
        prisma.servicioEspecialidad,
        prisma.servicio,
        prisma.perfilEspecialidad,
        prisma.perfilProfesional,
        prisma.usuario,
        prisma.especialidad,
        prisma.categoria,
    ];
    for (const model of models) {
        await (model as any).deleteMany();
    }
    
    // 2. Creación de datos maestros (Independientes)
    // Crear Categorías de Salud
    await prisma.categoria.createMany({
        data: [
            { nombre: "Medicina General", descripcion: "Servicios de atención médica general" },
            { nombre: "Odontología", descripcion: "Servicios dentales y bucales" },
            { nombre: "Psicología", descripcion: "Servicios de salud mental y psicológicos" },
            { nombre: "Enfermería", descripcion: "Servicios de cuidado y enfermería" },
            { nombre: "Farmacéutica", descripcion: "Servicios farmacéuticos y asesoría" },
        ],
    });

    // Crear Especialidades
    await prisma.especialidad.createMany({
        data: [
            { nombre: "Cardiología", descripcion: "Especialista en enfermedades del corazón" },
            { nombre: "Odontología Estética", descripcion: "Especialista en estética dental" },
            { nombre: "Terapia Psicológica", descripcion: "Especialista en terapia psicológica" },
            { nombre: "Cuidado de Heridas", descripcion: "Especialista en cuidado de heridas" },
            { nombre: "Farmacoterapia", descripcion: "Especialista en farmacoterapia" },
            { nombre: "Pediatría", descripcion: "Médico especialista en niños" },
            { nombre: "Endodoncia", descripcion: "Especialista en tratamiento de conductos" },
            { nombre: "Psicología Clínica", descripcion: "Especialista en psicología clínica" },
        ],
    });

    // Crear Usuarios
    await prisma.usuario.createMany({
        data: [
            { 
                nombre: "Andres", 
                apellidos: "Quesada Molina", 
                email: "andresquesada@gmail.com", 
                password: "123456", 
                telefono: "2222-2222",
                rol: RolUsuario.ADMIN,
                estado: true
            },
            { 
                nombre: "Cecilia", 
                apellidos: "Molina Mena", 
                email: "cecialiamolina@gmail.com", 
                password: "123456", 
                telefono: "8765-4321",
                rol: RolUsuario.CLIENTE,
                estado: true
            },
            { 
                nombre: "Maya", 
                apellidos: "Quesada Soto", 
                email: "mayaquesada@gmail.com", 
                password: "123456", 
                telefono: "8765-4322",
                rol: RolUsuario.CLIENTE,
                estado: true
            },
            { 
                nombre: "Lia", 
                apellidos: "Quesada Molina", 
                email: "liaquesada@gmail.com", 
                password: "123456", 
                telefono: "8765-4327",
                rol: RolUsuario.CLIENTE,
                estado: true
            },
            { 
                nombre: "Patricia", 
                apellidos: "Molina", 
                email: "patriciamolina@gmail.com", 
                password: "123456", 
                telefono: "8765-4323",
                rol: RolUsuario.PROFESIONAL,
                estado: true
            },
            { 
                nombre: "Alejandro", 
                apellidos: "Quesada Molina", 
                email: "alejandroquesada@gmail.com", 
                password: "123456", 
                telefono: "8765-4324",
                rol: RolUsuario.PROFESIONAL,
                estado: true
            },
            { 
                nombre: "Jessie", 
                apellidos: "Quesada Molina", 
                email: "jessiequesada@gmail.com", 
                password: "123456", 
                telefono: "8765-4325",
                rol: RolUsuario.PROFESIONAL,
                estado: true
            },
            { 
                nombre: "Valeria", 
                apellidos: "Soto Aguilar", 
                email: "valeriasoto@gmail.com", 
                password: "123456", 
                telefono: "8765-4326",
                rol: RolUsuario.PROFESIONAL,
                estado: true
            },
            { 
                nombre: "Samantha", 
                apellidos: "Quesada Molina", 
                email: "samanthaquesada@gmail.com", 
                password: "123456", 
                telefono: "8765-4328",
                rol: RolUsuario.PROFESIONAL,
                estado: true
            },
        ],
    });

    // 3. Recuperar datos para mapeo (Uso de Maps para optimizar)
    const [categorias, especialidades, usuarios] = await Promise.all([
        prisma.categoria.findMany(),
        prisma.especialidad.findMany(),
        prisma.usuario.findMany(),
    ]);

    const catMap = Object.fromEntries(categorias.map((c) => [c.nombre, c.id]));
    const espMap = Object.fromEntries(especialidades.map((e) => [e.nombre, e.id]));
    const userMap = Object.fromEntries(usuarios.map((u) => [u.email, u.id]));

    // 4. Creación de PerfilProfesional con Servicios y Relaciones
    // Perfil 1: Patricia Molina - Médica General
    const perfilPatricia = await prisma.perfilProfesional.create({
        data: {
            usuarioId: userMap["patriciamolina@gmail.com"],
            titulo: "Dra. Medicina General",
            descripcion: "Médica especializada en medicina general con experiencia en salud familiar",
            aniosExperiencia: 12,
            modalidad: "MIXTO",
            provincia: "San José",
            canton: "San José",
            distrito: "Centro",
            tarifaBase: 120000,
            disponible: true,
            activo: true,
            imagen: "Medica1.png",
        },
    });

    await prisma.servicio.createMany({
        data: [
            {
                perfilId: perfilPatricia.id,
                categoriaId: catMap["Medicina General"],
                nombre: "Consulta Médica General",
                descripcion: "Consulta de medicina general para atención a pacientes",
                precio: 100000,
                duracionMinutos: 60,
                modalidad: "PRESENCIAL",
                estado: true,
            },
            {
                perfilId: perfilPatricia.id,
                categoriaId: catMap["Medicina General"],
                nombre: "Revisión de Salud Integral",
                descripcion: "Revisión completa de estado de salud del paciente",
                precio: 150000,
                duracionMinutos: 90,
                modalidad: "PRESENCIAL",
                estado: true,
            },
        ],
    });

    // Perfil 2: Alejandro Quesada - Odontólogo
    const perfilAlejandro = await prisma.perfilProfesional.create({
        data: {
            usuarioId: userMap["alejandroquesada@gmail.com"],
            titulo: "Dr. Odontólogo Especialista",
            descripcion: "Especialista en odontología estética, implantes y tratamientos dentales",
            aniosExperiencia: 10,
            modalidad: "PRESENCIAL",
            provincia: "San José",
            canton: "La Uruca",
            distrito: "Tibás",
            tarifaBase: 90000,
            disponible: true,
            activo: true,
            imagen: "Dentista1.png",
        },
    });

    await prisma.servicio.createMany({
        data: [
            {
                perfilId: perfilAlejandro.id,
                categoriaId: catMap["Odontología"],
                nombre: "Limpieza Dental Profunda",
                descripcion: "Limpieza profesional de dientes y encías",
                precio: 80000,
                duracionMinutos: 60,
                modalidad: "PRESENCIAL",
                estado: true,
            },
            {
                perfilId: perfilAlejandro.id,
                categoriaId: catMap["Odontología"],
                nombre: "Blanqueamiento Dental",
                descripcion: "Tratamiento de blanqueamiento dental profesional",
                precio: 120000,
                duracionMinutos: 90,
                modalidad: "PRESENCIAL",
                estado: true,
            },
        ],
    });

    // Perfil 3: Samantha Quesada - Psicóloga
    const perfilSamantha = await prisma.perfilProfesional.create({
        data: {
            usuarioId: userMap["samanthaquesada@gmail.com"],
            titulo: "Lic. Psicología Clínica",
            descripcion: "Especialista en psicología clínica y terapia psicológica cognitivo-conductual",
            aniosExperiencia: 8,
            modalidad: "VIRTUAL",
            provincia: "San José",
            canton: "San José",
            distrito: "Merced",
            tarifaBase: 85000,
            disponible: true,
            activo: true,
            imagen: "Psicologa1.png",
        },
    });

    await prisma.servicio.createMany({
        data: [
            {
                perfilId: perfilSamantha.id,
                categoriaId: catMap["Psicología"],
                nombre: "Sesión de Psicoterapia",
                descripcion: "Sesión individual de psicoterapia cognitivo-conductual",
                precio: 90000,
                duracionMinutos: 60,
                modalidad: "VIRTUAL",
                estado: true,
            },
            {
                perfilId: perfilSamantha.id,
                categoriaId: catMap["Psicología"],
                nombre: "Evaluación Psicológica",
                descripcion: "Evaluación y diagnóstico psicológico completo",
                precio: 120000,
                duracionMinutos: 90,
                modalidad: "VIRTUAL",
                estado: true,
            },
        ],
    });

    // Perfil 4: Jessie Quesada - Enfermera
    const perfilJessie = await prisma.perfilProfesional.create({
        data: {
            usuarioId: userMap["jessiequesada@gmail.com"],
            titulo: "Lic. Enfermería Especializada",
            descripcion: "Especialista en cuidado de pacientes, atención domiciliaria y procedimientos",
            aniosExperiencia: 9,
            modalidad: "PRESENCIAL",
            provincia: "Cartago",
            canton: "Cartago",
            distrito: "Centro",
            tarifaBase: 75000,
            disponible: true,
            activo: true,
            imagen: "Enfermera1.png",
        },
    });

    await prisma.servicio.createMany({
        data: [
            {
                perfilId: perfilJessie.id,
                categoriaId: catMap["Enfermería"],
                nombre: "Cuidado Domiciliario",
                descripcion: "Atención de enfermería en el hogar del paciente",
                precio: 100000,
                duracionMinutos: 120,
                modalidad: "PRESENCIAL",
                estado: true,
            },
            {
                perfilId: perfilJessie.id,
                categoriaId: catMap["Enfermería"],
                nombre: "Aplicación de Inyecciones",
                descripcion: "Servicio de aplicación de inyecciones y medicinas",
                precio: 50000,
                duracionMinutos: 30,
                modalidad: "PRESENCIAL",
                estado: true,
            },
        ],
    });

    // Perfil 5: Valeria Soto - Farmacéutica
    const perfilValeria = await prisma.perfilProfesional.create({
        data: {
            usuarioId: userMap["valeriasoto@gmail.com"],
            titulo: "Farm. Consultora de Medicamentos",
            descripcion: "Especialista en farmacoterapia, asesoría farmacéutica y gestión de medicinas",
            aniosExperiencia: 7,
            modalidad: "VIRTUAL",
            provincia: "Heredia",
            canton: "Santo Domingo",
            distrito: "Centro",
            tarifaBase: 65000,
            disponible: true,
            activo: true,
            imagen: "Farmaceutica1.png",
        },
    });

    await prisma.servicio.createMany({
        data: [
            {
                perfilId: perfilValeria.id,
                categoriaId: catMap["Farmacéutica"],
                nombre: "Consulta Farmacéutica",
                descripcion: "Asesoría sobre medicamentos, posología y efectos secundarios",
                precio: 70000,
                duracionMinutos: 45,
                modalidad: "VIRTUAL",
                estado: true,
            },
            {
                perfilId: perfilValeria.id,
                categoriaId: catMap["Farmacéutica"],
                nombre: "Revisión de Medicamentos",
                descripcion: "Revisión completa de medicamentos prescritos y optimización",
                precio: 85000,
                duracionMinutos: 60,
                modalidad: "VIRTUAL",
                estado: true,
            },
        ],
    });

    // 5. Relaciones Muchos a Muchos (Especialidades)
    await prisma.perfilEspecialidad.createMany({
        data: [
            { perfilId: perfilPatricia.id, especialidadId: espMap["Cardiología"] },
            { perfilId: perfilAlejandro.id, especialidadId: espMap["Odontología Estética"] },
            { perfilId: perfilAlejandro.id, especialidadId: espMap["Endodoncia"] },
            { perfilId: perfilSamantha.id, especialidadId: espMap["Terapia Psicológica"] },
            { perfilId: perfilSamantha.id, especialidadId: espMap["Psicología Clínica"] },
            { perfilId: perfilJessie.id, especialidadId: espMap["Cuidado de Heridas"] },
            { perfilId: perfilValeria.id, especialidadId: espMap["Farmacoterapia"] },
        ],
    });

    const servicios = await prisma.servicio.findMany();
    await prisma.servicioEspecialidad.createMany({
        data: [
            { servicioId: servicios[0].id, especialidadId: espMap["Cardiología"] },
            { servicioId: servicios[1].id, especialidadId: espMap["Cardiología"] },
            { servicioId: servicios[2].id, especialidadId: espMap["Odontología Estética"] },
            { servicioId: servicios[3].id, especialidadId: espMap["Endodoncia"] },
            { servicioId: servicios[4].id, especialidadId: espMap["Terapia Psicológica"] },
            { servicioId: servicios[5].id, especialidadId: espMap["Psicología Clínica"] },
            { servicioId: servicios[6].id, especialidadId: espMap["Cuidado de Heridas"] },
            { servicioId: servicios[7].id, especialidadId: espMap["Cuidado de Heridas"] },
            { servicioId: servicios[8].id, especialidadId: espMap["Farmacoterapia"] },
            { servicioId: servicios[9].id, especialidadId: espMap["Farmacoterapia"] },
        ],
    });

    // 6. Creación de Citas
    const ahora = new Date();
    const mañana = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);
    const pasado = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);

    await prisma.cita.createMany({
        data: [
            {
                clienteId: userMap["cecialiamolina@gmail.com"],
                perfilProfesionalId: perfilPatricia.id,
                servicioId: servicios[0].id,
                fechaSolicitada: ahora,
                fechaCita: mañana,
                horaInicio: "10:00",
                horaFin: "11:00",
                modalidad: "PRESENCIAL",
                estado: EstadoCita.PENDIENTE,
                descripcion: "Necesito revisión médica completa",
                monto: 100000,
            },
            {
                clienteId: userMap["mayaquesada@gmail.com"],
                perfilProfesionalId: perfilAlejandro.id,
                servicioId: servicios[2].id,
                fechaSolicitada: pasado,
                fechaCita: new Date(pasado.getTime() + 2 * 24 * 60 * 60 * 1000),
                horaInicio: "14:00",
                horaFin: "15:00",
                modalidad: "PRESENCIAL",
                estado: EstadoCita.COMPLETADA,
                descripcion: "Limpieza dental profunda realizada",
                monto: 80000,
            },
            {
                clienteId: userMap["liaquesada@gmail.com"],
                perfilProfesionalId: perfilSamantha.id,
                servicioId: servicios[4].id,
                fechaSolicitada: ahora,
                fechaCita: new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000),
                horaInicio: "09:00",
                horaFin: "10:00",
                modalidad: "VIRTUAL",
                estado: EstadoCita.ACEPTADA,
                descripcion: "Sesión de psicoterapia",
                monto: 90000,
            },
            {
                clienteId: userMap["cecialiamolina@gmail.com"],
                perfilProfesionalId: perfilJessie.id,
                servicioId: servicios[6].id,
                fechaSolicitada: ahora,
                fechaCita: new Date(ahora.getTime() + 2 * 24 * 60 * 60 * 1000),
                horaInicio: "18:00",
                horaFin: "19:00",
                modalidad: "PRESENCIAL",
                estado: EstadoCita.RECHAZADA,
                descripcion: "Cuidado domiciliario",
                motivoCancelacion: "Profesional no disponible en ese horario",
                monto: 100000,
            },
        ],
    });

    // 7. Crear historial de citas para auditoría
    const citas = await prisma.cita.findMany();
    await prisma.citaHistorial.createMany({
        data: [
            {
                citaId: citas[1].id,
                estadoAnterior: EstadoCita.PENDIENTE,
                estadoNuevo: EstadoCita.ACEPTADA,
                comentario: "Profesional aceptó la cita",
                fechaCambio: new Date(pasado.getTime() + 1 * 60 * 60 * 1000),
            },
            {
                citaId: citas[1].id,
                estadoAnterior: EstadoCita.ACEPTADA,
                estadoNuevo: EstadoCita.COMPLETADA,
                comentario: "Cita completada exitosamente",
                fechaCambio: new Date(pasado.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
        ],
    });

    console.log("Seed completado con éxito."); 
} 
 
main() 
    .catch((e) => { 
        console.error("Error en seed:", e); 
        process.exit(1); 
    }) 
    .finally(async () => { 
        await prisma.$disconnect(); 
    }); 