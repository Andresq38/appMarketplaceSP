import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';

// Perfiles Profesionales
import { PerfilProfesionalList } from './pages/perfiles-profesionales/perfil-profesional-list/perfil-profesional-list';
import { PerfilProfesionalDetailPage } from './pages/perfiles-profesionales/perfil-profesional-detail/perfil-profesional-detail';
import { PerfilProfesionalAdminList } from './pages/perfiles-profesionales/perfil-profesional-admin-list/perfil-profesional-admin-list';
import { PerfilProfesionalCreatePage } from './pages/perfiles-profesionales/perfil-profesional-create-page/perfil-profesional-create-page';
import { PerfilProfesionalEditPage } from './pages/perfiles-profesionales/perfil-profesional-edit-page/perfil-profesional-edit-page';

// Especialidades
import { EspecialidadList } from './pages/especialidades/especialidad-list/especialidad-list';
import { EspecialidadDetailPage } from './pages/especialidades/especialidad-detail/especialidad-detail';
import { EspecialidadAdminList } from './pages/especialidades/especialidad-admin-list/especialidad-admin-list';

// Servicios
import { ServicioList } from './pages/servicios/servicio-list/servicio-list';
import { ServicioDetailPage } from './pages/servicios/servicio-detail/servicio-detail';
import { ServicioAdminList } from './pages/servicios/servicio-admin-list/servicio-admin-list';
import { ServicioCreatePage } from './pages/servicios/servicio-create-page/servicio-create-page';
import { ServicioEditPage } from './pages/servicios/servicio-edit-page/servicio-edit-page';

// Categorías
import { CategoriaList } from './pages/categorias/categoria-list/categoria-list';
import { CategoriaDetailPage } from './pages/categorias/categoria-detail/categoria-detail';
import { CategoriaAdminList } from './pages/categorias/categoria-admin-list/categoria-admin-list';

// Citas
import { CitaList } from './pages/citas/cita-list/cita-list';
import { CitaDetailPage } from './pages/citas/cita-detail/cita-detail';
import { CitaAdminList } from './pages/citas/cita-admin-list/cita-admin-list';
import { CitaCreatePage } from './pages/citas/cita-create-page/cita-create-page';
import { CitaEditPage } from './pages/citas/cita-edit-page/cita-edit-page';

// Reseñas
import { ResenaList } from './pages/resenas/resena-list/resena-list';
import { ResenaDetailPage } from './pages/resenas/resena-detail/resena-detail';
import { ResenaAdminList } from './pages/resenas/resena-admin-list/resena-admin-list';

// Usuarios
import { UsuarioList } from './pages/usuarios/usuario-list/usuario-list';
import { UsuarioDetailPage } from './pages/usuarios/usuario-detail/usuario-detail';
import { UsuarioAdminList } from './pages/usuarios/usuario-admin-list/usuario-admin-list';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            // Home
            { 
                path: '', 
                component: Home, 
                title: 'Inicio' 
            },

            // Perfiles Profesionales - Cliente
            { 
                path: 'perfiles-profesionales', 
                component: PerfilProfesionalList, 
                title: 'Catálogo de Profesionales' 
            },
            { 
                path: 'perfiles-profesionales/:id', 
                component: PerfilProfesionalDetailPage, 
                title: 'Detalle del Profesional' 
            },

            // Especialidades
            { 
                path: 'especialidades', 
                component: EspecialidadList, 
                title: 'Especialidades' 
            },
            { 
                path: 'especialidades/:id', 
                component: EspecialidadDetailPage, 
                title: 'Detalle de Especialidad' 
            },

            // Servicios
            { 
                path: 'servicios', 
                component: ServicioList, 
                title: 'Servicios' 
            },
            { 
                path: 'servicios/:id', 
                component: ServicioDetailPage, 
                title: 'Detalle del Servicio' 
            },

            // Categorías
            { 
                path: 'categorias', 
                component: CategoriaList, 
                title: 'Categorías' 
            },
            { 
                path: 'categorias/:id', 
                component: CategoriaDetailPage, 
                title: 'Detalle de Categoría' 
            },

            // Citas
            { 
                path: 'citas', 
                component: CitaList, 
                title: 'Mis Citas' 
            },
            { 
                path: 'citas/:id', 
                component: CitaDetailPage, 
                title: 'Detalle de Cita' 
            },

            // Reseñas
            { 
                path: 'resenas', 
                component: ResenaList, 
                title: 'Reseñas' 
            },
            { 
                path: 'resenas/:id', 
                component: ResenaDetailPage, 
                title: 'Detalle de Reseña' 
            },

            // Usuarios
            { 
                path: 'usuarios', 
                component: UsuarioList, 
                title: 'Usuarios' 
            },
            { 
                path: 'usuarios/:id', 
                component: UsuarioDetailPage, 
                title: 'Detalle de Usuario' 
            },

            // Admin Routes
            {
                path: 'admin/perfiles-profesionales',
                component: PerfilProfesionalAdminList,
                title: 'Gestión de Profesionales'
            },
            {
                path: 'admin/perfiles-profesionales/crear',
                component: PerfilProfesionalCreatePage,
                title: 'Registrar Perfil Profesional'
            },
            {
                path: 'admin/perfiles-profesionales/editar/:id',
                component: PerfilProfesionalEditPage,
                title: 'Actualizar Perfil Profesional'
            },
            {
                path: 'admin/especialidades',
                component: EspecialidadAdminList,
                title: 'Gestión de Especialidades'
            },
            {
                path: 'admin/servicios',
                component: ServicioAdminList,
                title: 'Gestión de Servicios'
            },
            {
                path: 'admin/servicios/crear',
                component: ServicioCreatePage,
                title: 'Registrar Servicio'
            },
            {
                path: 'admin/servicios/editar/:id',
                component: ServicioEditPage,
                title: 'Actualizar Servicio'
            },
            {
                path: 'admin/categorias',
                component: CategoriaAdminList,
                title: 'Gestión de Categorías'
            },
            {
                path: 'admin/citas',
                component: CitaAdminList,
                title: 'Gestión de Citas'
            },
            {
                path: 'admin/citas/crear',
                component: CitaCreatePage,
                title: 'Registrar Cita'
            },
            {
                path: 'admin/citas/editar/:id',
                component: CitaEditPage,
                title: 'Actualizar Cita'
            },
            {
                path: 'admin/resenas',
                component: ResenaAdminList,
                title: 'Gestión de Reseñas'
            },
            {
                path: 'admin/usuarios',
                component: UsuarioAdminList,
                title: 'Gestión de Usuarios'
            },
        ]
    },
    
    {
        path: '**',
        redirectTo: ''
    }
];
