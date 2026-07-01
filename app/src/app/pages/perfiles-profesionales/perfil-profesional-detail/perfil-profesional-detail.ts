import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model';
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service';

@Component({
  selector: 'app-perfil-profesional-detail',
  imports: [
    RouterLink,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './perfil-profesional-detail.html',
  styleUrl: './perfil-profesional-detail.css',
})
export class PerfilProfesionalDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly perfilProfesionalService = inject(PerfilProfesionalService);

  perfil = signal<PerfilProfesional | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('El identificador del profesional no es válido.');
      return;
    }

    this.loadPerfil(id);
  }

  loadPerfil(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.perfilProfesionalService.obtenerPorId(id).subscribe({
      next: (response) => {
        this.perfil.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el detalle del profesional.');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(imageName: string | undefined): string {
    if (!imageName) return 'assets/default-profile.png';
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
