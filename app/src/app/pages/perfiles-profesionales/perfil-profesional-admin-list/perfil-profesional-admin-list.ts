import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model';
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service';

@Component({
  selector: 'app-perfil-profesional-admin-list',
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './perfil-profesional-admin-list.html',
  styleUrl: './perfil-profesional-admin-list.css',
})
export class PerfilProfesionalAdminList {
  private readonly perfilProfesionalService = inject(PerfilProfesionalService);
  private readonly router = inject(Router);
  perfiles = signal<PerfilProfesional[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = [
    'imagen',
    'nombre',
    'titulo',
    'modalidad',
    'tarifa',
    'acciones',
  ];

  perfilesFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) {
      return this.perfiles();
    }
    return this.perfiles().filter((perfil) => {
      const nombre = perfil.usuario?.nombre?.toLowerCase() ?? '';
      const apellidos = perfil.usuario?.apellidos?.toLowerCase() ?? '';
      const titulo = perfil.titulo?.toLowerCase() ?? '';
      const descripcion = perfil.descripcion?.toLowerCase() ?? '';

      return (
        nombre.includes(texto) ||
        apellidos.includes(texto) ||
        titulo.includes(texto) ||
        descripcion.includes(texto)
      );
    });
  });

  totalPerfiles = computed(() => this.perfilesFiltrados().length);

  ngOnInit(): void {
    this.loadPerfiles();
  }

  loadPerfiles(): void {
    this.loading.set(true);
    this.error.set(null);
    this.perfilProfesionalService.listar().subscribe({
      next: (response) => {
        this.perfiles.set(response.data);
        this.loading.set(false);
        console.log('Perfiles cargados:', response.data);
      },
      error: () => {
        this.error.set('No se pudo cargar el mantenimiento de profesionales.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.search.set('');
  }

  crearProfesional(): void {
    this.router.navigate(['/admin/perfiles-profesionales/crear']);
  }

  editarProfesional(id: number): void {
    this.router.navigate(['/admin/perfiles-profesionales/editar', id]);
  }

  getImageUrl(imageName: string | undefined): string {
    if (!imageName) return 'assets/default-profile.png';
    return this.perfilProfesionalService.getImageUrl(imageName);
  }
}
