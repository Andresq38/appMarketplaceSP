import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { PerfilProfesionalForm } from '../../../shared/components/perfil-profesional-form/perfil-profesional-form'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { EspecialidadService } from '../../../core/services/especialidad.service'
import { Especialidad } from '../../../core/models/especialidad.model'
import { PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../../../core/models/perfil-profesional.model'

@Component({
  selector: 'app-perfil-profesional-create-page',
  standalone: true,
  imports: [PerfilProfesionalForm],
  templateUrl: './perfil-profesional-create-page.html',
  styleUrl: './perfil-profesional-create-page.css'
})
export class PerfilProfesionalCreatePage {
  private readonly router = inject(Router)
  private readonly perfilProfesionalService = inject(PerfilProfesionalService)
  private readonly especialidadService = inject(EspecialidadService)

  especialidades = signal<Especialidad[]>([])
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
    forkJoin({
      especialidades: this.especialidadService.listar()
    }).subscribe({
      next: ({ especialidades }) => {
        this.especialidades.set(especialidades.data ?? [])
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del formulario')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto) {
    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)
    this.perfilProfesionalService.crear(data as PerfilProfesionalCreateDto).subscribe({
      next: () => {
        this.router.navigate(['/admin/perfiles-profesionales'])
      },
      error: () => {
        this.error.set('No se pudo registrar el perfil profesional')
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
