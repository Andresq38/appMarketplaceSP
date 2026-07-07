import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form'
import { ServicioService } from '../../../core/services/servicio.service'
import { EspecialidadService } from '../../../core/services/especialidad.service'
import { Servicio, ServicioCreateDto, ServicioUpdateDto } from '../../../core/models/servicio.model'
import { Especialidad } from '../../../core/models/especialidad.model'

@Component({
  selector: 'app-servicio-edit-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ServicioForm],
  templateUrl: './servicio-edit-page.html',
  styleUrl: './servicio-edit-page.css'
})
export class ServicioEditPage {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly servicioService = inject(ServicioService)
  private readonly especialidadService = inject(EspecialidadService)

  servicio = signal<Servicio | null>(null)
  especialidades = signal<Especialidad[]>([])
  loading = signal(true)
  saving = signal(false)
  error = signal<string | null>(null)

  private readonly id = Number(this.route.snapshot.paramMap.get('id'))

  constructor() {
    this.cargarDatosFormulario()
  }

  cargarDatosFormulario() {
    if (!this.id) {
      this.error.set('El identificador del servicio no es válido')
      this.loading.set(false)
      return
    }

    this.loading.set(true)
    this.error.set(null)

    forkJoin({
      servicio: this.servicioService.obtenerPorId(this.id),
      especialidades: this.especialidadService.listar()
    }).subscribe({
      next: ({ servicio, especialidades }) => {
        this.servicio.set(servicio.data)
        this.especialidades.set(especialidades.data ?? [])
      },
      error: () => {
        this.error.set('No se pudo cargar la información del servicio')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto) {
    if (!this.id) return

    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)

    this.servicioService
      .actualizar(this.id, data as ServicioUpdateDto)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/servicios'])
        },
        error: () => {
          this.error.set('No se pudo actualizar el servicio')
        },
        complete: () => {
          this.saving.set(false)
        }
      })
  }

  cancelar() {
    this.router.navigate(['/admin/servicios'])
  }
}
