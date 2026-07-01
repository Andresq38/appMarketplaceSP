import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Especialidad } from '../../../core/models/especialidad.model';
import { EspecialidadService } from '../../../core/services/especialidad.service';

@Component({
  selector: 'app-especialidad-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './especialidad-detail.html',
  styleUrl: './especialidad-detail.css',
})
export class EspecialidadDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly especialidadService = inject(EspecialidadService);
  especialidad = signal<Especialidad | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadEspecialidad(id);
  }

  loadEspecialidad(id: number): void {
    this.loading.set(true);
    this.especialidadService.obtenerPorId(id).subscribe({
      next: (response) => { this.especialidad.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('No se pudo cargar la especialidad.'); this.loading.set(false); },
    });
  }
}
