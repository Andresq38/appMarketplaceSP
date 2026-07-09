import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Servicio } from '../../../core/models/servicio.model';
import { ServicioService } from '../../../core/services/servicio.service';

@Component({
  selector: 'app-servicio-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css',
})
export class ServicioDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly servicioService = inject(ServicioService);
  servicio = signal<Servicio | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  fromAdmin = signal(false);
  backLink = computed(() => this.fromAdmin() ? '/admin/servicios' : '/servicios');

  ngOnInit(): void {
    this.fromAdmin.set(this.route.snapshot.queryParamMap.get('from') === 'admin');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadServicio(id);
  }

  loadServicio(id: number): void {
    this.loading.set(true);
    this.servicioService.obtenerPorId(id).subscribe({
      next: (response) => { this.servicio.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar servicio.'); this.loading.set(false); },
    });
  }
}
