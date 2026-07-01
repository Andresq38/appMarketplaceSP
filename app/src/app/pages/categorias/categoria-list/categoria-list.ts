import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Categoria } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.css',
})
export class CategoriaList {
  private readonly categoriaService = inject(CategoriaService);
  categorias = signal<Categoria[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  categoriasFiltradas = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.categorias();
    return this.categorias().filter((c) => c.nombre?.toLowerCase().includes(texto));
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

  clearFilters(): void { this.search.set(''); }
}
