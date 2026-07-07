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
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['profesional', 'cliente', 'fecha', 'estado', 'acciones'];

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

  clearSearch(): void { this.search.set(''); }

  crearCita(): void {
    this.router.navigate(['/admin/citas/crear']);
  }

  editarCita(id: number): void {
    this.router.navigate(['/admin/citas/editar', id]);
  }
}
