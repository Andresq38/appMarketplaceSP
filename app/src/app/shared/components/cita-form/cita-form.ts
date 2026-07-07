import {
  Component,
  computed,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common'
import {
  FormField,
  form,
  required,
  minLength,
  maxLength
} from '@angular/forms/signals'

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'

import {
  Cita,
  CitaCreateDto,
  CitaFormModel,
  CitaUpdateDto,
  ModalidadCita
} from '../../../core/models/cita.model'
import { Usuario } from '../../../core/models/usuario.model'
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model'
import { Servicio } from '../../../core/models/servicio.model'

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css'
})
export class CitaForm {
  cita = input<Cita | null>(null);
  saving = input<boolean>(false);
  usuarios = input<Usuario[]>([]);
  perfiles = input<PerfilProfesional[]>([]);
  servicios = input<Servicio[]>([]);

  guardar = output<CitaCreateDto | CitaUpdateDto>();
  cancelar = output<void>();

  citaModel = signal<CitaFormModel>({
    clienteId: null,
    profesionalId: null,
    fechaCita: '',
    hora: '',
    modalidad: '',
    descripcion: ''
  });

  isEdit = computed(() => this.cita() !== null);
  isSubmitting = computed(() => this.saving())
  
  // Modalidades disponibles según el profesional seleccionado
  modalidadesFiltradas = signal<string[]>([]);

  constructor() {
    // Effect para cargar cita cuando se edita
    effect(() => {
      const cita = this.cita();
      if (!cita) {
        this.resetForm();
        return;
      }

      this.citaModel.set({
        clienteId: cita.clienteId ?? null,
        profesionalId: cita.profesionalId ?? null,
        fechaCita: cita.fechaCita ? new Date(cita.fechaCita).toISOString().split('T')[0] : '',
        hora: cita.hora ?? '',
        modalidad: cita.modalidad ?? '',
        descripcion: cita.descripcion ?? ''
      });
    });

    // Effect para filtrar modalidades cuando se selecciona un profesional
    effect(() => {
      const profesionalId = this.citaModel().profesionalId;
      if (!profesionalId) {
        this.modalidadesFiltradas.set([]);
        return;
      }
      
      const perfil = this.perfiles().find(p => p.id === profesionalId);
      if (!perfil) {
        this.modalidadesFiltradas.set([]);
        return;
      }
      
      // Filtrar modalidades según la modalidad del profesional
      let modalidades: string[] = [];
      if (perfil.modalidad === 'MIXTO') {
        modalidades = ['VIRTUAL', 'PRESENCIAL'];
      } else if (perfil.modalidad === 'VIRTUAL') {
        modalidades = ['VIRTUAL'];
      } else if (perfil.modalidad === 'PRESENCIAL') {
        modalidades = ['PRESENCIAL'];
      }
      
      this.modalidadesFiltradas.set(modalidades);
      
      // Limpiar modalidad seleccionada si no es válida
      const modalidadActual = this.citaModel().modalidad;
      if (modalidadActual && !modalidades.includes(modalidadActual)) {
        this.citaModel.update(m => ({ ...m, modalidad: '' }));
      }
    });
  }

  citaForm = form(this.citaModel, (path) => {
    required(path.clienteId, {
      message: 'Selecciona un cliente'
    })

    required(path.profesionalId, {
      message: 'Selecciona un profesional'
    })

    required(path.fechaCita, {
      message: 'La fecha es obligatoria'
    })

    required(path.hora, {
      message: 'La hora es obligatoria'
    })

    required(path.modalidad, {
      message: 'Seleccione una modalidad'
    })

    required(path.descripcion, {
      message: 'La descripción es obligatoria'
    })
    minLength(path.descripcion, 10, {
      message: 'La descripción debe tener mínimo 10 caracteres'
    })
    maxLength(path.descripcion, 500, {
      message: 'Máximo 500 caracteres'
    })
  });

  private resetForm() {
    this.citaModel.set({
      clienteId: null,
      profesionalId: null,
      fechaCita: '',
      hora: '',
      modalidad: '',
      descripcion: ''
    });
  }

  private marcarCamposComoTocados() {
    this.citaForm.clienteId().markAsTouched();
    this.citaForm.profesionalId().markAsTouched();
    this.citaForm.fechaCita().markAsTouched();
    this.citaForm.hora().markAsTouched();
    this.citaForm.modalidad().markAsTouched();
    this.citaForm.descripcion().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.citaForm.clienteId().invalid() ||
      this.citaForm.profesionalId().invalid() ||
      this.citaForm.fechaCita().invalid() ||
      this.citaForm.hora().invalid() ||
      this.citaForm.modalidad().invalid() ||
      this.citaForm.descripcion().invalid()
    );
  }

  private buildDto(): CitaCreateDto | CitaUpdateDto {
    const value = this.citaModel();
    return {
      clienteId: value.clienteId as number,
      profesionalId: value.profesionalId as number,
      fechaCita: value.fechaCita,
      hora: value.hora,
      modalidad: value.modalidad as ModalidadCita,
      descripcion: value.descripcion.trim()
    };
  }

  submit() {
    if (this.isSubmitting()) return;
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;
    const dto = this.buildDto();
    console.log('JSON enviado al API:', dto);
    this.guardar.emit(dto);
  }
}
