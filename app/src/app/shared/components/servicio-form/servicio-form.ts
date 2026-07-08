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
  maxLength,
  min,
  validate
} from '@angular/forms/signals'

import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'

import {
  Servicio,
  ServicioCreateDto,
  ServicioFormModel,
  ServicioUpdateDto,
  ModalidadServicio
} from '../../../core/models/servicio.model'
import { Especialidad } from '../../../core/models/especialidad.model'
import { PerfilProfesional } from '../../../core/models/perfil-profesional.model'
import { Categoria } from '../../../core/models/categoria.model'

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [
    CommonModule,
    FormField,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css'
})
export class ServicioForm {
  servicio = input<Servicio | null>(null);
  saving = input<boolean>(false);
  especialidades = input<Especialidad[]>([]);
  perfiles = input<PerfilProfesional[]>([]);
  categorias = input<Categoria[]>([]);

  guardar = output<ServicioCreateDto | ServicioUpdateDto>();
  cancelar = output<void>();

  servicioModel = signal<ServicioFormModel>({
    perfilId: null,
    categoriaId: null,
    nombre: '',
    descripcion: '',
    precio: 0,
    duracionMinutos: 0,
    modalidad: '',
    estado: true,
    especialidadIds: []
  });

  constructor() {
    effect(() => {
      const servicio = this.servicio();
      if (!servicio) {
        this.resetForm();
        return;
      }

      this.servicioModel.set({
        perfilId: servicio.perfilId ?? null,
        categoriaId: servicio.categoriaId ?? null,
        nombre: servicio.nombre ?? '',
        descripcion: servicio.descripcion ?? '',
        precio: Number(servicio.precio ?? 0),
        duracionMinutos: servicio.duracionMinutos ?? 0,
        modalidad: servicio.modalidad ?? '',
        estado: servicio.estado ?? true,
        especialidadIds: servicio.especialidades?.map((item) => item.id) ?? []
      });
    });
  }

  servicioForm = form(this.servicioModel, (path) => {
    required(path.perfilId, {
      message: 'Selecciona un profesional'
    })

    required(path.categoriaId, {
      message: 'Selecciona una categoría'
    })

    required(path.nombre, {
      message: 'El nombre del servicio es obligatorio'
    })
    minLength(path.nombre, 3, {
      message: 'Mínimo 3 caracteres'
    })
    maxLength(path.nombre, 120, {
      message: 'Máximo 120 caracteres'
    })

    required(path.descripcion, {
      message: 'La descripción es obligatoria'
    })
    minLength(path.descripcion, 20, {
      message: 'La descripción debe tener mínimo 20 caracteres'
    })
    maxLength(path.descripcion, 500, {
      message: 'Máximo 500 caracteres'
    })

    required(path.precio, {
      message: 'El precio es obligatorio'
    })
    min(path.precio, 1, {
      message: 'El precio debe ser mayor a 0'
    })

    required(path.duracionMinutos, {
      message: 'La duración es obligatoria'
    })
    min(path.duracionMinutos, 15, {
      message: 'La duración mínima es 15 minutos'
    })

    required(path.modalidad, {
      message: 'Seleccione una modalidad'
    })
  });

  isEdit = computed(() => this.servicio() !== null);
  isSubmitting = computed(() => this.saving())
  modalidades = Object.values(ModalidadServicio);

  toggleEspecialidad(id: number, checked: boolean) {
    this.servicioModel.update((value) => ({
      ...value,
      especialidadIds: checked
        ? Array.from(new Set([...value.especialidadIds, id]))
        : value.especialidadIds.filter((item) => item !== id)
    }));
  }

  isEspecialidadSelected(id: number): boolean {
    return this.servicioModel().especialidadIds.includes(id);
  }

  private marcarCamposComoTocados() {
    this.servicioForm.perfilId().markAsTouched();
    this.servicioForm.categoriaId().markAsTouched();
    this.servicioForm.nombre().markAsTouched();
    this.servicioForm.descripcion().markAsTouched();
    this.servicioForm.precio().markAsTouched();
    this.servicioForm.duracionMinutos().markAsTouched();
    this.servicioForm.modalidad().markAsTouched();
  }

  private formularioInvalido(): boolean {
    return (
      this.servicioForm.perfilId().invalid() ||
      this.servicioForm.categoriaId().invalid() ||
      this.servicioForm.nombre().invalid() ||
      this.servicioForm.descripcion().invalid() ||
      this.servicioForm.precio().invalid() ||
      this.servicioForm.duracionMinutos().invalid() ||
      this.servicioForm.modalidad().invalid()
    );
  }

  private resetForm() {
    this.servicioModel.set({
      perfilId: null,
      categoriaId: null,
      nombre: '',
      descripcion: '',
      precio: 0,
      duracionMinutos: 0,
      modalidad: '',
      estado: true,
      especialidadIds: []
    });
  }

  private buildDto(): ServicioCreateDto | ServicioUpdateDto {
    const value = this.servicioModel();
    return {
      nombre: value.nombre.trim(),
      descripcion: value.descripcion.trim(),
      precio: Number(value.precio),
      duracionMinutos: Number(value.duracionMinutos),
      modalidad: value.modalidad as ModalidadServicio,
      estado: value.estado,
      especialidadIds: value.especialidadIds
    };
  }

  submit() {
    if (this.isSubmitting()) return;
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;
    const dto = this.buildDto();
    this.guardar.emit(dto);
  }
}
