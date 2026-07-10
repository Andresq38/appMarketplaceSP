import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Especialidad } from '../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../core/services/especialidad.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-especialidad-admin-list',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './especialidad-admin-list.html',
  styleUrl: './especialidad-admin-list.css',
})
export class EspecialidadAdminList {
  private readonly especialidadService = inject(EspecialidadService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  especialidades = signal<Especialidad[]>([]);
  search = signal('');
  filtroEstado = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'nombre', 'descripcion', 'estado', 'acciones'];

  estados = [true, false];
  estadoLabels = { true: 'Activo', false: 'Inactivo' };

  especialidadesFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.especialidades().filter((esp) => {
      const nombre = esp.nombre?.toLowerCase() ?? '';
      const descripcion = esp.descripcion?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto);

      const coincideEstado = estado === null || esp.estado === estado;

      return coincideTexto && coincideEstado;
    });
  });

  totalEspecialidades = computed(() => this.especialidadesFiltradas().length);

  ngOnInit(): void {
    this.loadEspecialidades();
  }

  loadEspecialidades(): void {
    this.loading.set(true);
    this.error.set(null);
    this.especialidadService.listar().subscribe({
      next: (response) => {
        this.especialidades.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar las especialidades.');
        this.loading.set(false);
      },
    });
  }

  clearFilters(): void {
    this.search.set('');
    this.filtroEstado.set(null);
  }

  clearSearch(): void {
    this.search.set('');
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  toggleEstado(especialidad: Especialidad): void {
    const nuevoEstado = !especialidad.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    const mensajeConfirmacion = `¿Está seguro de ${accion} la especialidad ${especialidad.nombre}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Especialidad`, mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        especialidad.estado = nuevoEstado;
        this.especialidadService.actualizar(especialidad.id, { estado: especialidad.estado }).subscribe({
          next: () => {
            this.notificationService.success('Estado actualizado correctamente', 'Especialidad');
            this.loadEspecialidades();
          },
          error: () => {
            especialidad.estado = !nuevoEstado;
            console.error('Error al cambiar estado');
          },
        });
      }
    });
  }
}
