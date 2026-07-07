import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

type Role = 'CLIENTE' | 'PROFESIONAL' | 'ADMIN';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: Role[];
}

interface User {
  nombre: string;
  apellidos: string;
  email: string;
  role: Role;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentUser = signal<User | null>(null);

  publicMenu = signal<MenuItem[]>([
    { label: 'Inicio', path: '/', icon: 'home' },
    { label: 'Servicios', path: '/servicios', icon: 'medical_services' },
    { label: 'Especialidades', path: '/especialidades', icon: 'local_hospital' },
    { label: 'Profesionales', path: '/profesionales', icon: 'person_white', roles: ['CLIENTE', 'ADMIN'] },
  ]);

  clientMenu = signal<MenuItem[]>([
    { label: 'Mis Citas', path: '/cliente/citas', icon: 'event' },
    { label: 'Mis Reseñas', path: '/cliente/resenas', icon: 'star' },
    { label: 'Perfil', path: '/cliente/perfil', icon: 'person' },
  ]);

  profesionalMenu = signal<MenuItem[]>([
    { label: 'Mis Servicios', path: '/profesional/servicios', icon: 'work' },
    { label: 'Mis Citas', path: '/profesional/citas', icon: 'event' },
    { label: 'Mis Reseñas', path: '/profesional/resenas', icon: 'star' },
    { label: 'Mi Perfil', path: '/profesional/perfil', icon: 'person' },
  ]);

  adminMenu = signal<MenuItem[]>([
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'group' },
    { label: 'Categorías', path: '/admin/categorias', icon: 'category' },
    { label: 'Especialidades', path: '/admin/especialidades', icon: 'local_hospital' },
    { label: 'Profesionales', path: '/admin/perfiles-profesionales', icon: 'person' },
    { label: 'Servicios', path: '/admin/servicios', icon: 'medical_services' },
    { label: 'Citas', path: '/admin/citas', icon: 'event' },
    { label: 'Reportes', path: '/admin/reportes', icon: 'bar_chart' },
  ]);

  isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

  canShowItem(item: MenuItem): boolean {
    if (!item.roles) return true;
    const user = this.currentUser();
    return !!user && item.roles.includes(user.role);
  }

  loginAsCliente(): void {
    this.currentUser.set({
      nombre: 'Juan',
      apellidos: 'García López',
      email: 'cliente@demo.com',
      role: 'CLIENTE',
    });
  }

  loginAsProfesional(): void {
    this.currentUser.set({
      nombre: 'Dra. María',
      apellidos: 'Rodríguez Pérez',
      email: 'profesional@demo.com',
      role: 'PROFESIONAL',
    });
  }

  loginAsAdmin(): void {
    this.currentUser.set({
      nombre: 'Admin',
      apellidos: 'Sistema',
      email: 'admin@demo.com',
      role: 'ADMIN',
    });
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
