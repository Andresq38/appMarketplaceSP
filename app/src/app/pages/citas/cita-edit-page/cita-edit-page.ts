import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CitaForm } from '../../../shared/components/cita-form/cita-form'
import { CitaService } from '../../../core/services/cita.service'
import { Cita, CitaCreateDto, CitaUpdateDto } from '../../../core/models/cita.model'

@Component({
  selector: 'app-cita-edit-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, CitaForm],
  templateUrl: './cita-edit-page.html',
  styleUrl: './cita-edit-page.css'
})
export class CitaEditPage {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly citaService = inject(CitaService)

  cita = signal<Cita | null>(null)
  loading = signal(true)
  saving = signal(false)
  error = signal<string | null>(null)

  private readonly id = Number(this.route.snapshot.paramMap.get('id'))

  constructor() {
    this.cargarDatosFormulario()
  }

  cargarDatosFormulario() {
    if (!this.id) {
      this.error.set('El identificador de la cita no es válido')
      this.loading.set(false)
      return
    }

    this.loading.set(true)
    this.error.set(null)

    forkJoin({
      cita: this.citaService.obtenerPorId(this.id)
    }).subscribe({
      next: ({ cita }) => {
        this.cita.set(cita.data)
      },
      error: () => {
        this.error.set('No se pudo cargar la información de la cita')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: CitaCreateDto | CitaUpdateDto) {
    if (!this.id) return

    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)

    this.citaService
      .actualizar(this.id, data as CitaUpdateDto)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/citas'])
        },
        error: () => {
          this.error.set('No se pudo actualizar la cita')
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
