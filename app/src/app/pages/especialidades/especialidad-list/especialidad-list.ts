import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Especialidad } from '../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../core/services/especialidad.service';

@Component({
  selector: 'app-especialidad-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './especialidad-list.html',
  styleUrl: './especialidad-list.css',
})
export class EspecialidadList {
  private readonly especialidadService = inject(EspecialidadService);
  especialidades = signal<Especialidad[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

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

  ngOnInit(): void { this.loadEspecialidades(); }

  loadEspecialidades(): void {
    this.loading.set(true);
    this.especialidadService.listar().subscribe({
      next: (response) => { this.especialidades.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('No se pudieron cargar las especialidades.'); this.loading.set(false); },
    });
  }

  clearFilters(): void { this.search.set(''); }
}
