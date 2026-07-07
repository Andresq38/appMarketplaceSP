import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { PerfilProfesionalForm } from '../../../shared/components/perfil-profesional-form/perfil-profesional-form'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { EspecialidadService } from '../../../core/services/especialidad.service'
import { PerfilProfesional, PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../../../core/models/perfil-profesional.model'
import { Especialidad } from '../../../core/models/especialidad.model'

@Component({
  selector: 'app-perfil-profesional-edit-page',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, PerfilProfesionalForm],
  templateUrl: './perfil-profesional-edit-page.html',
  styleUrl: './perfil-profesional-edit-page.css'
})
export class PerfilProfesionalEditPage {
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly perfilProfesionalService = inject(PerfilProfesionalService)
  private readonly especialidadService = inject(EspecialidadService)

  perfil = signal<PerfilProfesional | null>(null)
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
      this.error.set('El identificador del perfil profesional no es válido')
      this.loading.set(false)
      return
    }

    this.loading.set(true)
    this.error.set(null)

    forkJoin({
      perfil: this.perfilProfesionalService.obtenerPorId(this.id),
      especialidades: this.especialidadService.listar()
    }).subscribe({
      next: ({ perfil, especialidades }) => {
        this.perfil.set(perfil.data)
        this.especialidades.set(especialidades.data ?? [])
      },
      error: () => {
        this.error.set('No se pudo cargar la información del perfil profesional')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto) {
    if (!this.id) return

    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)

    this.perfilProfesionalService
      .actualizar(this.id, data as PerfilProfesionalUpdateDto)
      .subscribe({
        next: () => {
          this.router.navigate(['/admin/perfiles-profesionales'])
        },
        error: () => {
          this.error.set('No se pudo actualizar el perfil profesional')
        },
        complete: () => {
          this.saving.set(false)
        }
      })
  }

  cancelar() {
    this.router.navigate(['/admin/perfiles-profesionales'])
  }
}
