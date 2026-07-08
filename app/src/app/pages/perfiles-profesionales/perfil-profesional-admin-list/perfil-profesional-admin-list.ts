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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model';
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

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
    MatDialogModule,
  ],
  templateUrl: './perfil-profesional-admin-list.html',
  styleUrl: './perfil-profesional-admin-list.css',
})
export class PerfilProfesionalAdminList {
  private readonly perfilProfesionalService = inject(PerfilProfesionalService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  perfiles = signal<PerfilProfesional[]>([]);
  search = signal('');
  filtroModalidad = signal<string | null>(null);
  filtroDisponibilidad = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = [
    'id',
    'imagen',
    'nombre',
    'titulo',
    'modalidad',
    'tarifa',
    'disponibilidad',
    'acciones',
  ];

  modalidades = ['VIRTUAL', 'PRESENCIAL', 'MIXTO'];
  disponibilidades = [true, false];

  perfilesFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const modalidad = this.filtroModalidad();
    const disponibilidad = this.filtroDisponibilidad();

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
      const coincideDisponibilidad = disponibilidad === null || perfil.disponible === disponibilidad;

      return coincideTexto && coincideModalidad && coincideDisponibilidad;
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
        this.error.set('No se pudo cargar el mantenimiento de profesionales.');
        this.loading.set(false);
      },
    });
  }

  clearSearch(): void {
    this.search.set('');
    this.filtroModalidad.set(null);
    this.filtroDisponibilidad.set(null);
  }

  crearProfesional(): void {
    this.router.navigate(['/admin/perfiles-profesionales/crear']);
  }

  editarProfesional(id: number): void {
    this.router.navigate(['/admin/perfiles-profesionales/editar', id]);
  }

  getImageUrl(imageName: string | undefined): string | null {
    if (!imageName) return null;
    return this.perfilProfesionalService.getImageUrl(imageName);
  }

  getDisponibilidadLabel(disponible: boolean): string {
    return disponible ? 'Disponible' : 'No disponible';
  }

  toggleDisponible(perfil: PerfilProfesional): void {
    const nuevoEstado = !perfil.disponible;
    const accion = nuevoEstado ? 'disponible' : 'no disponible';
    const nombre = `${perfil.usuario?.nombre ?? ''} ${perfil.usuario?.apellidos ?? ''}`;
    const mensajeConfirmacion = `¿Está seguro de marcar a ${nombre} como ${accion}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: 'Cambiar Disponibilidad', mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        perfil.disponible = nuevoEstado;
        this.perfilProfesionalService.actualizar(perfil.id, { disponible: perfil.disponible }).subscribe({
          next: () => {
            this.loadPerfiles();
            this.notificationService.success('Disponibilidad actualizada correctamente', 'Profesional');
          },
          error: () => {
            perfil.disponible = !nuevoEstado;
            console.error('Error al cambiar disponibilidad');
          },
        });
      }
    });
  }
}
