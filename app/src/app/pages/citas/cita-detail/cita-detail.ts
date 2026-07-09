import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Cita } from '../../../core/models/cita.model';
import { CitaService } from '../../../core/services/cita.service';

@Component({
  selector: 'app-cita-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule, CommonModule],
  templateUrl: './cita-detail.html',
  styleUrl: './cita-detail.css',
})
export class CitaDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly citaService = inject(CitaService);
  cita = signal<Cita | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  fromAdmin = signal(false);
  backLink = computed(() => this.fromAdmin() ? '/admin/citas' : '/citas');

  ngOnInit(): void {
    this.fromAdmin.set(this.route.snapshot.queryParamMap.get('from') === 'admin');
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadCita(id);
  }

  loadCita(id: number): void {
    this.loading.set(true);
    this.citaService.obtenerPorId(id).subscribe({
      next: (response) => { this.cita.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar cita.'); this.loading.set(false); },
    });
  }
}
