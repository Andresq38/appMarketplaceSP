import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cita } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-cita-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './cita-admin-list.html',
  styleUrl: './cita-admin-list.css',
})
export class CitaAdminList {
  private readonly citaService = inject(CitaService);
  private readonly router = inject(Router);
  citas = signal<Cita[]>([]);
  search = signal('');
  filtroEstado = signal<string | null>(null);
  filtroProfesional = signal<number | null>(null);
  filtroFechaDesde = signal<string | null>(null);
  filtroFechaHasta = signal<string | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['id', 'profesional', 'cliente', 'fecha', 'estado', 'acciones'];

  estados = ['PENDIENTE', 'COMPLETADA', 'CANCELADA'];
  profesionales = computed(() => {
    const profs = new Map<number, { id: number; nombre: string; apellidos: string }>();
    this.citas().forEach(c => {
      if (c.profesional?.id && c.profesional?.usuario) {
        profs.set(c.profesional.id, {
          id: c.profesional.id,
          nombre: c.profesional.usuario.nombre,
          apellidos: c.profesional.usuario.apellidos
        });
      }
    });
    return Array.from(profs.values());
  });

  citasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    const estado = this.filtroEstado();
    const profId = this.filtroProfesional();
    const fechaDesde = this.filtroFechaDesde();
    const fechaHasta = this.filtroFechaHasta();

    return this.citas().filter((c) => {
      const nombreProfesional = (c.profesional?.usuario?.nombre ?? '').toLowerCase();
      const apellidosProfesional = (c.profesional?.usuario?.apellidos ?? '').toLowerCase();
      const nombreCliente = (c.cliente?.nombre ?? '').toLowerCase();
      const apellidosCliente = (c.cliente?.apellidos ?? '').toLowerCase();

      const coincideTexto = 
        texto.length === 0 ||
        nombreProfesional.includes(texto) ||
        apellidosProfesional.includes(texto) ||
        nombreCliente.includes(texto) ||
        apellidosCliente.includes(texto);

      const coincideEstado = estado === null || c.estado === estado;
      const coincideProfesional = profId === null || c.profesional?.id === profId;

      const fechaCita = c.fechaCita ? new Date(c.fechaCita).toISOString().split('T')[0] : '';
      const coincideFecha = 
        (fechaDesde === null || !fechaDesde || fechaCita >= fechaDesde) &&
        (fechaHasta === null || !fechaHasta || fechaCita <= fechaHasta);

      return coincideTexto && coincideEstado && coincideProfesional && coincideFecha;
    });
  });

  totalCitas = computed(() => this.citasFiltradas().length);

  ngOnInit(): void { this.loadCitas(); }

  loadCitas(): void {
    this.loading.set(true);
    this.citaService.listar().subscribe({
      next: (response) => { this.citas.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar citas.'); this.loading.set(false); },
    });
  }

  clearSearch(): void {
    this.search.set('');
    this.filtroEstado.set(null);
    this.filtroProfesional.set(null);
    this.filtroFechaDesde.set(null);
    this.filtroFechaHasta.set(null);
  }

  crearCita(): void {
    this.router.navigate(['/admin/citas/crear']);
  }

  editarCita(id: number): void {
    this.router.navigate(['/admin/citas/editar', id]);
  }
}
