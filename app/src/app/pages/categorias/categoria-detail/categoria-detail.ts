import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Categoria } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria.service';

@Component({
  selector: 'app-categoria-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './categoria-detail.html',
  styleUrl: './categoria-detail.css',
})
export class CategoriaDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriaService = inject(CategoriaService);
  categoria = signal<Categoria | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadCategoria(id);
  }

  loadCategoria(id: number): void {
    this.loading.set(true);
    this.categoriaService.obtenerPorId(id).subscribe({
      next: (response) => { this.categoria.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar categoría.'); this.loading.set(false); },
    });
  }
}
