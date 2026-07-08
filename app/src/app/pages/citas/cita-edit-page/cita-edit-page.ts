import { Component, inject, signal } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { CitaForm } from '../../../shared/components/cita-form/cita-form'
import { CitaService } from '../../../core/services/cita.service'
import { UsuarioService } from '../../../core/services/usuario.service'
import { PerfilProfesionalService } from '../../../core/services/perfil-profesional.service'
import { ServicioService } from '../../../core/services/servicio.service'
import { Cita, CitaCreateDto, CitaUpdateDto } from '../../../core/models/cita.model'
import { Usuario } from '../../../core/models/usuario.model'
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model'
import { Servicio } from '../../../core/models/servicio.model'

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
  private readonly usuarioService = inject(UsuarioService)
  private readonly perfilService = inject(PerfilProfesionalService)
  private readonly servicioService = inject(ServicioService)

  cita = signal<Cita | null>(null)
  usuarios = signal<Usuario[]>([])
  perfiles = signal<PerfilProfesional[]>([])
  servicios = signal<Servicio[]>([])
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
      cita: this.citaService.obtenerPorId(this.id),
      usuarios: this.usuarioService.listar(),
      perfiles: this.perfilService.listar(),
      servicios: this.servicioService.listar()
    }).subscribe({
      next: ({ cita, usuarios, perfiles, servicios }) => {
        this.cita.set(cita.data)
        // Filtrar solo usuarios con rol CLIENTE
        const usuariosClientes = (usuarios.data ?? []).filter(u => u.rol === 'CLIENTE')
        this.usuarios.set(usuariosClientes)
        this.perfiles.set(perfiles.data ?? [])
        this.servicios.set(servicios.data ?? [])
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
