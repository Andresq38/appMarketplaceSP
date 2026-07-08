import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model';
import { Especialidad } from '../../../core/models/especialidad.model';
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service';

@Component({
  selector: 'app-perfil-profesional-list',
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './perfil-profesional-list.html',
  styleUrl: './perfil-profesional-list.css',
})
export class PerfilProfesionalList {
  private readonly perfilProfesionalService = inject(PerfilProfesionalService);
  perfiles = signal<PerfilProfesional[]>([]);
  search = signal('');
  modalidadFilter = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  modalidades = ['VIRTUAL', 'PRESENCIAL', 'MIXTO'];

  especialidades = computed<Especialidad[]>(() => {
    const map = new Map<number, Especialidad>();
    this.perfiles().forEach((perfil) => {
      perfil.especialidades?.forEach((esp) => {
        if (esp) {
          map.set(esp.id, esp);
        }
      });
    });
    return Array.from(map.values());
  });

  perfilesFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const modalidad = this.modalidadFilter();

    return this.perfiles().filter((perfil) => {
      const nombre = perfil.usuario?.nombre?.toLowerCase() ?? '';
      const apellidos = perfil.usuario?.apellidos?.toLowerCase() ?? '';
      const titulo = perfil.titulo?.toLowerCase() ?? '';
      const descripcion = perfil.descripcion?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        apellidos.includes(texto) ||
        titulo.includes(texto) ||
        descripcion.includes(texto);

      const coincideModalidad = modalidad === null || perfil.modalidad === modalidad;

      return coincideTexto && coincideModalidad;
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
      },
      error: () => {
        this.error.set('No se pudieron cargar los profesionales.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.modalidadFilter.set(null);
  }

  getImageUrl(imageName: string | undefined): string | null {
    if (!imageName) return null;
    return this.perfilProfesionalService.getImageUrl(imageName);
  }

  getModalidadIcon(modalidad: string): string {
    switch (modalidad) {
      case 'VIRTUAL':
        return 'videocam';
      case 'PRESENCIAL':
        return 'location_on';
      case 'MIXTO':
        return 'apartment';
      default:
        return 'help';
    }
  }
}
