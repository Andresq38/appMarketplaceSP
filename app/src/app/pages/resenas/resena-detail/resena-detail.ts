import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Resena } from '../../../core/models/resena.model';
import { ResenaService } from '../../../core/services/resena.service';

@Component({
  selector: 'app-resena-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './resena-detail.html',
  styleUrl: './resena-detail.css',
})
export class ResenaDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly resenaService = inject(ResenaService);
  resena = signal<Resena | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadResena(id);
  }

  loadResena(id: number): void {
    this.loading.set(true);
    this.resenaService.obtenerPorId(id).subscribe({
      next: (response) => { this.resena.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar reseña.'); this.loading.set(false); },
    });
  }
}
