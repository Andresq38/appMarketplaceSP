import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Cita } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-cita-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css',
})
export class CitaList {
  private readonly citaService = inject(CitaService);
  citas = signal<Cita[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  citasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.citas();
    return this.citas().filter((c) => c.estado?.toLowerCase().includes(texto));
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

  clearFilters(): void { this.search.set(''); }
}
