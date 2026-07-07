import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { ServicioForm } from '../../../shared/components/servicio-form/servicio-form'
import { ServicioService } from '../../../core/services/servicio.service'
import { EspecialidadService } from '../../../core/services/especialidad.service'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { CategoriaService } from '../../../core/services/categoria.service'
import { Especialidad } from '../../../core/models/especialidad.model'
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model'
import { Categoria } from '../../../core/models/categoria.model'
import { ServicioCreateDto, ServicioUpdateDto } from '../../../core/models/servicio.model'

@Component({
  selector: 'app-servicio-create-page',
  standalone: true,
  imports: [ServicioForm],
  templateUrl: './servicio-create-page.html',
  styleUrl: './servicio-create-page.css'
})
export class ServicioCreatePage {
  private readonly router = inject(Router)
  private readonly servicioService = inject(ServicioService)
  private readonly especialidadService = inject(EspecialidadService)
  private readonly perfilService = inject(PerfilProfesionalService)
  private readonly categoriaService = inject(CategoriaService)

  especialidades = signal<Especialidad[]>([])
  perfiles = signal<PerfilProfesional[]>([])
  categorias = signal<Categoria[]>([])
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
      especialidades: this.especialidadService.listar(),
      perfiles: this.perfilService.listar(),
      categorias: this.categoriaService.listar()
    }).subscribe({
      next: ({ especialidades, perfiles, categorias }) => {
        this.especialidades.set(especialidades.data ?? [])
        this.perfiles.set(perfiles.data ?? [])
        this.categorias.set(categorias.data ?? [])
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos del formulario')
      },
      complete: () => {
        this.loading.set(false)
      }
    })
  }

  guardar(data: ServicioCreateDto | ServicioUpdateDto) {
    this.saving.set(true)
    this.error.set(null)
    console.log('Data: ', data)
    this.servicioService.crear(data as ServicioCreateDto).subscribe({
      next: () => {
        this.router.navigate(['/admin/servicios'])
      },
      error: () => {
        this.error.set('No se pudo registrar el servicio')
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
