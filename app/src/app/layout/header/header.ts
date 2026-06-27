import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

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
  role: Role;
  email: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  // Menú público (sin autenticar)
  publicMenu = input.required<MenuItem[]>();
  
  // Menús por rol
  clientMenu = input.required<MenuItem[]>();
  profesionalMenu = input.required<MenuItem[]>();
  adminMenu = input.required<MenuItem[]>();
  
  // Usuario actual
  currentUser = input<User | null>(null);
  
  // Control de visibilidad
  canShowItem = input.required<(item: MenuItem) => boolean>();
  
  // Outputs
  loginCliente = output<void>();
  loginProfesional = output<void>();
  loginAdmin = output<void>();
  logoutUser = output<void>();
}