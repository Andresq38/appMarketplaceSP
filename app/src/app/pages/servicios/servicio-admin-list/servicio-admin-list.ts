import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-servicio-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  templateUrl: './servicio-admin-list.html',
  styleUrl: './servicio-admin-list.css',
})
export class ServicioAdminList {
  private readonly servicioService = inject(ServicioService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  servicios = signal<Servicio[]>([]);
  search = signal('');
  filtroCategoria = signal<number | null>(null);
  filtroModalidad = signal<string | null>(null);
  preciominimo = signal<number | null>(null);
  preciomaximo = signal<number | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'nombre', 'profesional', 'categoria', 'precio', 'modalidad', 'estado', 'acciones'];

  modalidades = ['VIRTUAL', 'PRESENCIAL', 'MIXTO'];
  categorias = computed(() => {
    const cats = new Set<{id: number, nombre: string}>();
    this.servicios().forEach(s => {
      if (s.categoria) {
        cats.add(s.categoria);
      }
    });
    return Array.from(cats);
  });

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const categoria = this.filtroCategoria();
    const modalidad = this.filtroModalidad();
    const precioMin = this.preciominimo();
    const precioMax = this.preciomaximo();

    return this.servicios().filter((s) => {
      const nombre = s.nombre?.toLowerCase() ?? '';
      const descripcion = s.descripcion?.toLowerCase() ?? '';
      const precio = parseFloat(s.precio?.toString() ?? '0');

      const coincideTexto =
        texto.length === 0 ||
        nombre.includes(texto) ||
        descripcion.includes(texto);

      const coincideCategoria = categoria === null || s.categoria?.id === categoria;
      const coincideModalidad = modalidad === null || s.modalidad === modalidad;
      const coincidePrecio =
        (precioMin === null || precio >= precioMin) &&
        (precioMax === null || precio <= precioMax);

      return coincideTexto && coincideCategoria && coincideModalidad && coincidePrecio;
    });
  });

  totalServicios = computed(() => this.serviciosFiltrados().length);

  ngOnInit(): void { this.loadServicios(); }

  loadServicios(): void {
    this.loading.set(true);
    this.servicioService.listar().subscribe({
      next: (response) => { this.servicios.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar servicios.'); this.loading.set(false); },
    });
  }

  clearSearch(): void {
    this.search.set('');
    this.filtroCategoria.set(null);
    this.filtroModalidad.set(null);
    this.preciominimo.set(null);
    this.preciomaximo.set(null);
  }

  crearServicio(): void {
    this.router.navigate(['/admin/servicios/crear']);
  }

  editarServicio(id: number): void {
    this.router.navigate(['/admin/servicios/editar', id]);
  }

  toggleEstado(servicio: Servicio): void {
    const nuevoEstado = !servicio.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    const mensajeConfirmacion = `¿Está seguro de ${accion} el servicio ${servicio.nombre}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Servicio`, mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        servicio.estado = nuevoEstado;
        this.servicioService.actualizar(servicio.id, { estado: servicio.estado }).subscribe({
          next: () => {
            this.loadServicios();
          },
          error: () => {
            servicio.estado = !nuevoEstado;
            console.error('Error al cambiar estado');
          },
        });
      }
    });
  }
}
