import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { CitaForm } from '../../../shared/components/cita-form/cita-form'
import { CitaService } from '../../../core/services/cita.service'
import { CitaCreateDto, CitaUpdateDto } from '../../../core/models/cita.model'

@Component({
  selector: 'app-cita-create-page',
  standalone: true,
  imports: [CitaForm],
  templateUrl: './cita-create-page.html',
  styleUrl: './cita-create-page.css'
})
export class CitaCreatePage {
  private readonly router = inject(Router)
  private readonly citaService = inject(CitaService)

  loading = signal(true)
  saving = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this.cargarDatosFormulario()
  }

  cargarDatosFormulario() {
    this.loading.set(true)
    this.error.set(null)
    // forkJoin agrupa todo y devuelve todos los resultados juntos
    forkJoin({}).subscribe({
      next: () => {
        // No hay datos adicionales para cargar en citas
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del formulario')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: CitaCreateDto | CitaUpdateDto) {
    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)
    this.citaService.crear(data as CitaCreateDto).subscribe({
      next: () => {
        this.router.navigate(['/admin/citas'])
      },
      error: () => {
        this.error.set('No se pudo registrar la cita')
      },
      complete: () => {
        this.saving.set(false)
      }
    })
  }

  cancelar() {
    this.router.navigate(['/admin/citas'])
  }
}
