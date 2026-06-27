import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: Home,
                title: 'Inicio'
            },

            {
                path: 'servicios',
                component: Home, // TODO: Reemplazar con ServiciosList
                title: 'Catálogo de Servicios'
            },

            {
                path: 'especialidades',
                component: Home, // TODO: Reemplazar con EspecialidadesList
                title: 'Especialidades'
            },

            {
                path: 'profesionales',
                component: Home, // TODO: Reemplazar con ProfesionalesList
                title: 'Profesionales'
            },

            // Rutas Cliente
            {
                path: 'cliente/citas',
                component: Home, // TODO: Reemplazar con CitasClienteList
                title: 'Mis Citas'
            },

            {
                path: 'cliente/resenas',
                component: Home, // TODO: Reemplazar con ResenasList
                title: 'Mis Reseñas'
            },

            {
                path: 'cliente/perfil',
                component: Home, // TODO: Reemplazar con ClientePerfil
                title: 'Mi Perfil'
            },

            // Rutas Profesional
            {
                path: 'profesional/servicios',
                component: Home, // TODO: Reemplazar con MisServiciosList
                title: 'Mis Servicios'
            },

            {
                path: 'profesional/citas',
                component: Home, // TODO: Reemplazar con CitasProfesionalList
                title: 'Mis Citas'
            },

            {
                path: 'profesional/resenas',
                component: Home, // TODO: Reemplazar con ResenasRecibidas
                title: 'Reseñas Recibidas'
            },

            {
                path: 'profesional/perfil',
                component: Home, // TODO: Reemplazar con ProfesionalPerfil
                title: 'Mi Perfil'
            },

            // Rutas Admin
            {
                path: 'admin/usuarios',
                component: Home, // TODO: Reemplazar con UsuariosList
                title: 'Gestión de Usuarios'
            },

            {
                path: 'admin/categorias',
                component: Home, // TODO: Reemplazar con CategoriasList
                title: 'Gestión de Categorías'
            },

            {
                path: 'admin/especialidades',
                component: Home, // TODO: Reemplazar con EspecialidadesAdminList
                title: 'Gestión de Especialidades'
            },

            {
                path: 'admin/servicios',
                component: Home, // TODO: Reemplazar con ServiciosAdminList
                title: 'Gestión de Servicios'
            },

            {
                path: 'admin/citas',
                component: Home, // TODO: Reemplazar con CitasAdminList
                title: 'Gestión de Citas'
            },

            {
                path: 'admin/reportes',
                component: Home, // TODO: Reemplazar con ReportesList
                title: 'Reportes'
            }
        ]
    },
    
    {
        path: '**',
        redirectTo: ''
    }
];
