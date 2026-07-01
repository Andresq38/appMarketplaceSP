import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Resena } from '../../../core/models/resena.model';
import { ResenaService } from '../../../core/services/resena.service';

@Component({
  selector: 'app-resena-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './resena-admin-list.html',
  styleUrl: './resena-admin-list.css',
})
export class ResenaAdminList {
  private readonly resenaService = inject(ResenaService);
  resenas = signal<Resena[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['profesional', 'calificacion', 'comentario', 'acciones'];

  resenasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.resenas();
    return this.resenas().filter((r) => r.comentario?.toLowerCase().includes(texto));
  });

  totalResenas = computed(() => this.resenasFiltradas().length);

  ngOnInit(): void { this.loadResenas(); }

  loadResenas(): void {
    this.loading.set(true);
    this.resenaService.listar().subscribe({
      next: (response) => { this.resenas.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar reseñas.'); this.loading.set(false); },
    });
  }

  clearSearch(): void { this.search.set(''); }
}
