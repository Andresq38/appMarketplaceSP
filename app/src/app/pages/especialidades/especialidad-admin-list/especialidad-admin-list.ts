import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Especialidad } from '../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../core/services/especialidad.service';

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
  ],
  templateUrl: './especialidad-admin-list.html',
  styleUrl: './especialidad-admin-list.css',
})
export class EspecialidadAdminList {
  private readonly especialidadService = inject(EspecialidadService);
  especialidades = signal<Especialidad[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['nombre', 'descripcion', 'acciones'];

  especialidadesFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.especialidades();
    return this.especialidades().filter((esp) => {
      const nombre = esp.nombre?.toLowerCase() ?? '';
      const descripcion = esp.descripcion?.toLowerCase() ?? '';
      return nombre.includes(texto) || descripcion.includes(texto);
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

  clearSearch(): void {
    this.search.set('');
  }
}
