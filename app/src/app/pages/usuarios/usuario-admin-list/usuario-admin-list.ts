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
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-usuario-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './usuario-admin-list.html',
  styleUrl: './usuario-admin-list.css',
})
export class UsuarioAdminList {
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  usuarios = signal<Usuario[]>([]);
  search = signal('');
  filtroRol = signal<string | null>(null);
  filtroEstado = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'nombre', 'email', 'rol', 'telefono', 'estado', 'acciones'];

  roles = ['ADMIN', 'PROFESIONAL', 'CLIENTE'];
  estados = [true, false];
  estadoLabels = { true: 'Activo', false: 'Inactivo' };

  usuariosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const rol = this.filtroRol();
    const estado = this.filtroEstado();

    return this.usuarios().filter((u) => {
      const nombre = u.nombre?.toLowerCase() ?? '';
      const email = u.email?.toLowerCase() ?? '';
      const apellidos = u.apellidos?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        email.includes(texto) ||
        apellidos.includes(texto);

      const coincideRol = rol === null || u.rol === rol;
      const coincideEstado = estado === null || u.estado === estado;

      return coincideTexto && coincideRol && coincideEstado;
    });
  });

  totalUsuarios = computed(() => this.usuariosFiltrados().length);

  ngOnInit(): void { this.loadUsuarios(); }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (response) => { this.usuarios.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar usuarios.'); this.loading.set(false); },
    });
  }

  clearSearch(): void { this.search.set(''); }

  clearFilters(): void {
    this.search.set('');
    this.filtroRol.set(null);
    this.filtroEstado.set(null);
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  toggleEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    const mensajeConfirmacion = `¿Está seguro de ${accion} a ${usuario.nombre}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Usuario`, mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        usuario.estado = nuevoEstado;
        this.usuarioService.actualizar(usuario.id, { estado: usuario.estado }).subscribe({
          next: () => {
            this.loadUsuarios();
            this.notificationService.success('Estado actualizado correctamente', 'Usuario');
          },
          error: () => {
            usuario.estado = !nuevoEstado;
            console.error('Error al cambiar estado');
          },
        });
      }
    });
  }
}
