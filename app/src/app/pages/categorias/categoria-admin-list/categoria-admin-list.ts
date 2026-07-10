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
import { Categoria } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-categoria-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './categoria-admin-list.html',
  styleUrl: './categoria-admin-list.css',
})
export class CategoriaAdminList {
  private readonly categoriaService = inject(CategoriaService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  categorias = signal<Categoria[]>([]);
  search = signal('');
  filtroEstado = signal<boolean | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'nombre', 'descripcion', 'estado', 'acciones'];

  estados = [true, false];
  estadoLabels = { true: 'Activo', false: 'Inactivo' };

  categoriasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();

    return this.categorias().filter((c) => {
      const nombre = c.nombre?.toLowerCase() ?? '';
      const descripcion = c.descripcion?.toLowerCase() ?? '';

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto);

      const coincideEstado = estado === null || c.estado === estado;

      return coincideTexto && coincideEstado;
    });
  });

  totalCategorias = computed(() => this.categoriasFiltradas().length);

  ngOnInit(): void { this.loadCategorias(); }

  loadCategorias(): void {
    this.loading.set(true);
    this.categoriaService.listar().subscribe({
      next: (response) => { this.categorias.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar categorías.'); this.loading.set(false); },
    });
  }

  clearSearch(): void { this.search.set(''); }

  clearFilters(): void {
    this.search.set('');
    this.filtroEstado.set(null);
  }

  getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  toggleEstado(categoria: Categoria): void {
    const nuevoEstado = !categoria.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    const mensajeConfirmacion = `¿Está seguro de ${accion} la categoría ${categoria.nombre}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Categoría`, mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        categoria.estado = nuevoEstado;
        this.categoriaService.actualizar(categoria.id, { estado: categoria.estado }).subscribe({
          next: () => {
            this.notificationService.success('Estado actualizado correctamente', 'Categoría');
            this.loadCategorias();
          },
          error: () => {
            categoria.estado = !nuevoEstado;
            console.error('Error al cambiar estado');
          },
        });
      }
    });
  }
}
