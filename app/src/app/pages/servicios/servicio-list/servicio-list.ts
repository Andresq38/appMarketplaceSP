import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicio-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './servicio-list.html',
  styleUrl: './servicio-list.css',
})
export class ServicioList {
  private readonly servicioService = inject(ServicioService);
  servicios = signal<Servicio[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  serviciosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.servicios();
    return this.servicios().filter((s) => {
      const nombre = s.nombre?.toLowerCase() ?? '';
      return nombre.includes(texto);
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

  clearFilters(): void { this.search.set(''); }
}
