import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  inject
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import {
  PerfilProfesional,
  PerfilProfesionalCreateDto,
  PerfilProfesionalFormModel,
  PerfilProfesionalUpdateDto,
  ModalidadServicio
} from '../../../core/models/perfil-profesional.model'
import { Especialidad } from '../../../core/models/especialidad.model'
import { Usuario } from '../../../core/models/usuario.model'
import { ImageService } from '../../../core/services/image.service'

@Component({
  selector: 'app-perfil-profesional-form',
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
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './perfil-profesional-form.html',
  styleUrl: './perfil-profesional-form.css'
})
export class PerfilProfesionalForm {
  private readonly imageService = inject(ImageService);

  perfil = input<PerfilProfesional | null>(null);
  saving = input<boolean>(false);
  especialidades = input<Especialidad[]>([]);
  usuarios = input<Usuario[]>([]);

  guardar = output<PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto>();
  cancelar = output<void>();

  perfilModel = signal<PerfilProfesionalFormModel>({
    usuarioId: null,
    nombre: '',
    apellidos: '',
    correo: '',
    telefono: '',
    titulo: '',
    descripcion: '',
    aniosExperiencia: 0,
    modalidad: '',
    provincia: '',
    canton: '',
    distrito: '',
    tarifaBase: 0,
    disponible: true,
    imagen: '',
    especialidadIds: []
  });

  uploadingImage = signal(false);
  imagePreview = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);

  constructor() {
    effect(() => {
      const perfil = this.perfil();
      if (!perfil) {
        this.resetForm();
        return;
      }

      this.perfilModel.set({
        usuarioId: perfil.usuarioId ?? null,
        nombre: perfil.usuario?.nombre ?? '',
        apellidos: perfil.usuario?.apellidos ?? '',
        correo: perfil.usuario?.email ?? '',
        telefono: perfil.usuario?.telefono ?? '',
        titulo: perfil.titulo ?? '',
        descripcion: perfil.descripcion ?? '',
        aniosExperiencia: perfil.aniosExperiencia ?? 0,
        modalidad: perfil.modalidad ?? '',
        provincia: perfil.provincia ?? '',
        canton: perfil.canton ?? '',
        distrito: perfil.distrito ?? '',
        tarifaBase: Number(perfil.tarifaBase ?? 0),
        disponible: perfil.disponible ?? true,
        imagen: perfil.imagen ?? '',
        especialidadIds: perfil.especialidades?.map((item: any) => item.id) ?? []
      });
      this.selectedImageFile.set(null);
      this.imagePreview.set(
        perfil.imagen ? this.imageService.getImageUrl(perfil.imagen) : null
      );
    });
  }

  perfilForm = form(this.perfilModel, (path) => {
    required(path.usuarioId, {
      message: 'Debes seleccionar un usuario profesional'
    })

    required(path.nombre, {
      message: 'El nombre es obligatorio'
    })
    minLength(path.nombre, 2, {
      message: 'Mínimo 2 caracteres'
    })
    maxLength(path.nombre, 60, {
      message: 'Máximo 60 caracteres'
    })

    required(path.apellidos, {
      message: 'Los apellidos son obligatorios'
    })
    minLength(path.apellidos, 2, {
      message: 'Mínimo 2 caracteres'
    })
    maxLength(path.apellidos, 60, {
      message: 'Máximo 60 caracteres'
    })

    required(path.correo, {
      message: 'El correo es obligatorio'
    })
    validate(path.correo, (ctx) => {
      const correo = String(ctx.value()).trim()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(correo) ? null : { kind: 'email', message: 'Correo inválido' }
    })

    required(path.telefono, {
      message: 'El teléfono es obligatorio'
    })
    minLength(path.telefono, 7, {
      message: 'Mínimo 7 dígitos'
    })
    maxLength(path.telefono, 15, {
      message: 'Máximo 15 dígitos'
    })

    required(path.titulo, {
      message: 'El título es obligatorio'
    })
    minLength(path.titulo, 3, {
      message: 'Mínimo 3 caracteres'
    })
    maxLength(path.titulo, 120, {
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

    required(path.aniosExperiencia, {
      message: 'Los años de experiencia son obligatorios'
    })
    min(path.aniosExperiencia, 0, {
      message: 'Los años no pueden ser negativos'
    })

    required(path.tarifaBase, {
      message: 'La tarifa base es obligatoria'
    })
    min(path.tarifaBase, 1, {
      message: 'La tarifa debe ser mayor a 0'
    })

    required(path.modalidad, {
      message: 'Seleccione una modalidad'
    })

    required(path.provincia, {
      message: 'La provincia es obligatoria'
    })

    required(path.canton, {
      message: 'El cantón es obligatorio'
    })

    required(path.distrito, {
      message: 'El distrito es obligatorio'
    })
  });

  isEdit = computed(() => this.perfil() !== null);
  isSubmitting = computed(() => this.saving())
  modalidades = Object.values(ModalidadServicio);

  toggleEspecialidad(id: number, checked: boolean) {
    this.perfilModel.update((value) => ({
      ...value,
      especialidadIds: checked
        ? Array.from(new Set([...value.especialidadIds, id]))
        : value.especialidadIds.filter((item) => item !== id)
    }));
  }

  isEspecialidadSelected(id: number): boolean {
    return this.perfilModel().especialidadIds.includes(id);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    this.selectedImageFile.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  private marcarCamposComoTocados() {
    // En CREATE: marcar usuarioId, en EDIT: no (porque no es editable)
    if (!this.isEdit()) {
      this.perfilForm.usuarioId().markAsTouched();
    }
    
    this.perfilForm.nombre().markAsTouched();
    this.perfilForm.apellidos().markAsTouched();
    this.perfilForm.correo().markAsTouched();
    this.perfilForm.telefono().markAsTouched();
    this.perfilForm.titulo().markAsTouched();
    this.perfilForm.descripcion().markAsTouched();
    this.perfilForm.aniosExperiencia().markAsTouched();
    this.perfilForm.tarifaBase().markAsTouched();
    this.perfilForm.modalidad().markAsTouched();
    this.perfilForm.provincia().markAsTouched();
    this.perfilForm.canton().markAsTouched();
    this.perfilForm.distrito().markAsTouched();
  }

  private formularioInvalido(): boolean {
    const usuarioIdValido = this.isEdit() ? true : !this.perfilForm.usuarioId().invalid();
    
    return (
      !usuarioIdValido ||
      this.perfilForm.nombre().invalid() ||
      this.perfilForm.apellidos().invalid() ||
      this.perfilForm.correo().invalid() ||
      this.perfilForm.telefono().invalid() ||
      this.perfilForm.titulo().invalid() ||
      this.perfilForm.descripcion().invalid() ||
      this.perfilForm.aniosExperiencia().invalid() ||
      this.perfilForm.tarifaBase().invalid() ||
      this.perfilForm.modalidad().invalid() ||
      this.perfilForm.provincia().invalid() ||
      this.perfilForm.canton().invalid() ||
      this.perfilForm.distrito().invalid()
    );
  }

  private resetForm() {
    this.perfilModel.set({
      usuarioId: null,
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      titulo: '',
      descripcion: '',
      aniosExperiencia: 0,
      modalidad: '',
      provincia: '',
      canton: '',
      distrito: '',
      tarifaBase: 0,
      disponible: true,
      imagen: '',
      especialidadIds: []
    });
    this.selectedImageFile.set(null);
    this.imagePreview.set(null);
  }

  private buildDto(): PerfilProfesionalCreateDto | PerfilProfesionalUpdateDto {
    const value = this.perfilModel();
    
    // En CREATE mode: no incluir datos de usuario (solo profesional)
    // En EDIT mode: incluir datos de usuario para actualización
    if (this.isEdit()) {
      return {
        nombre: value.nombre.trim(),
        apellidos: value.apellidos.trim(),
        email: value.correo.trim(),
        telefono: value.telefono.trim(),
        titulo: value.titulo.trim(),
        descripcion: value.descripcion.trim(),
        aniosExperiencia: Number(value.aniosExperiencia),
        modalidad: value.modalidad as ModalidadServicio,
        provincia: value.provincia.trim(),
        canton: value.canton.trim(),
        distrito: value.distrito.trim(),
        tarifaBase: Number(value.tarifaBase),
        disponible: value.disponible,
        imagen: value.imagen || undefined,
        especialidadIds: value.especialidadIds
      };
    }
    
    // CREATE mode: incluir imagen
    return {
      usuarioId: value.usuarioId as number,
      titulo: value.titulo.trim(),
      descripcion: value.descripcion.trim(),
      aniosExperiencia: Number(value.aniosExperiencia),
      modalidad: value.modalidad as ModalidadServicio,
      provincia: value.provincia.trim(),
      canton: value.canton.trim(),
      distrito: value.distrito.trim(),
      tarifaBase: Number(value.tarifaBase),
      disponible: value.disponible,
      imagen: value.imagen || undefined,
      especialidadIds: value.especialidadIds
    };
  }

  onUsuarioSeleccionado(usuarioId: number | null) {
    if (!usuarioId) {
      this.perfilModel.update(value => ({
        ...value,
        usuarioId: null,
        nombre: '',
        apellidos: '',
        correo: '',
        telefono: ''
      }));
      return;
    }

    const usuario = this.usuarios().find(u => u.id === usuarioId);
    if (usuario) {
      this.perfilModel.update(value => ({
        ...value,
        usuarioId: usuarioId,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.email,
        telefono: usuario.telefono ?? ''
      }));
    }
  }

  private subirImagenYGuardar(file: File) {
    this.uploadingImage.set(true);
    this.imageService.subir(file).subscribe({
      next: (response) => {
        this.perfilModel.update((value) => ({
          ...value,
          imagen: response.data!.nombreArchivo,
        }));
        this.selectedImageFile.set(null);
        this.emitirGuardar();
      },
      error: () => {
        alert('No se pudo subir la imagen');
      },
      complete: () => {
        this.uploadingImage.set(false);
      },
    });
  }

  submit() {
    if (this.isSubmitting()) return;
    this.marcarCamposComoTocados();
    if (this.formularioInvalido()) return;
    
    const file = this.selectedImageFile();
    if (file) {
      this.subirImagenYGuardar(file);
      return;
    }
    
    this.emitirGuardar();
  }

  private emitirGuardar() {
    const dto = this.buildDto();
    this.guardar.emit(dto);
  }
}
