import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { PerfilProfesionalForm } from '../../../shared/components/perfil-profesional-form/perfil-profesional-form'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { EspecialidadService } from '../../../core/services/especialidad.service'
import { UsuarioService } from '../../../core/services/usuario.service'
import { Especialidad } from '../../../core/models/especialidad.model'
import { Usuario } from '../../../core/models/usuario.model'
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
  private readonly usuarioService = inject(UsuarioService)

  especialidades = signal<Especialidad[]>([])
  usuarios = signal<Usuario[]>([])
  loading = signal(true)
  saving = signal(false)
  error = signal<string | null>(null)

  constructor() {
    this.cargarDatosFormulario()
  }

  cargarDatosFormulario() {
    this.loading.set(true)
    this.error.set(null)
    forkJoin({
      especialidades: this.especialidadService.listar(),
      usuarios: this.usuarioService.listar()
    }).subscribe({
      next: ({ especialidades, usuarios }) => {
        this.especialidades.set(especialidades.data ?? [])
        // Filtrado de Usuarios: Solo se muestran usuarios con rol PROFESIONAL
        // que NO tengan un PerfilProfesional registrado aún
        // AND que tengan estado = false (desactivados/disponibles para registrar perfil)
        // Una vez que se registra el PerfilProfesional, el usuario desaparece del dropdown
        // Validación en Backend: Rechaza crear PerfilProfesional si usuario no tiene rol PROFESIONAL o estado !== false
        const usuariosProfesionales = (usuarios.data ?? []).filter(
          u => u.rol === 'PROFESIONAL' && !u.perfilProfesional && u.estado === false
        )
        this.usuarios.set(usuariosProfesionales)
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
