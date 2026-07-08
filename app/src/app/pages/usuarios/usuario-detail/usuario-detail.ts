import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-usuario-detail',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatDividerModule, MatChipsModule, CommonModule, MatDialogModule],
  templateUrl: './usuario-detail.html',
  styleUrl: './usuario-detail.css',
})
export class UsuarioDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  usuario = signal<Usuario | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error.set('ID inválido.'); return; }
    this.loadUsuario(id);
  }

  loadUsuario(id: number): void {
    this.loading.set(true);
    this.usuarioService.obtenerPorId(id).subscribe({
      next: (response) => { this.usuario.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar usuario.'); this.loading.set(false); },
    });
  }

  getRolColor(rol: string): string {
    switch (rol) {
      case 'ADMIN': return 'warn';
      case 'PROFESIONAL': return 'accent';
      case 'CLIENTE': return 'primary';
      default: return '';
    }
  }

  toggleEstado(usuario: Usuario): void {
    const nuevoEstado = !usuario.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    const mensajeConfirmacion = `¿Está seguro de ${accion} a ${usuario.nombre}?`;
    
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { titulo: `${accion.charAt(0).toUpperCase() + accion.slice(1)} Usuario`, mensaje: mensajeConfirmacion }
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        usuario.estado = nuevoEstado;
        this.usuarioService.actualizar(usuario.id, { estado: usuario.estado }).subscribe({
          next: () => {
            this.loadUsuario(usuario.id);
          },
          error: () => {
            usuario.estado = !nuevoEstado;
            console.error('Error al cambiar estado');
          },
        });
      }
    });
  }
}
