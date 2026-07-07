import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { forkJoin } from 'rxjs'
import { CitaForm } from '../../../shared/components/cita-form/cita-form'
import { CitaService } from '../../../core/services/cita.service'
import { UsuarioService } from '../../../core/services/usuario.service'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { ServicioService } from '../../../core/services/servicio.service'
import { Usuario } from '../../../core/models/usuario.model'
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model'
import { Servicio } from '../../../core/models/servicio.model'
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
  private readonly usuarioService = inject(UsuarioService)
  private readonly perfilService = inject(PerfilProfesionalService)
  private readonly servicioService = inject(ServicioService)

  usuarios = signal<Usuario[]>([])
  perfiles = signal<PerfilProfesional[]>([])
  servicios = signal<Servicio[]>([])

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
      usuarios: this.usuarioService.listar(),
      perfiles: this.perfilService.listar(),
      servicios: this.servicioService.listar()
    }).subscribe({
      next: ({ usuarios, perfiles, servicios }) => {
        // Filtrar solo usuarios con rol CLIENTE
        const usuariosClientes = (usuarios.data ?? []).filter(u => u.rol === 'CLIENTE')
        this.usuarios.set(usuariosClientes)
        this.perfiles.set(perfiles.data ?? [])
        this.servicios.set(servicios.data ?? [])
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
