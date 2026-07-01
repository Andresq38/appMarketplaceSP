import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Usuario } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-admin-list',
  imports: [RouterLink, FormsModule, MatButtonModule, MatIconModule, MatTableModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule],
  templateUrl: './usuario-admin-list.html',
  styleUrl: './usuario-admin-list.css',
})
export class UsuarioAdminList {
  private readonly usuarioService = inject(UsuarioService);
  usuarios = signal<Usuario[]>([]);
  search = signal('');
  loading = signal(false);
  error = signal<string | null>(null);
  displayedColumns = ['nombre', 'email', 'rol', 'telefono', 'acciones'];

  usuariosFiltrados = computed(() => {
    const texto = this.search().trim().toLowerCase();
    if (!texto) return this.usuarios();
    return this.usuarios().filter((u) => {
      const nombre = u.nombre?.toLowerCase() ?? '';
      const email = u.email?.toLowerCase() ?? '';
      return nombre.includes(texto) || email.includes(texto);
    });
  });

  totalUsuarios = computed(() => this.usuariosFiltrados().length);

  ngOnInit(): void { this.loadUsuarios(); }

  loadUsuarios(): void {
    this.loading.set(true);
    this.usuarioService.listar().subscribe({
      next: (response) => { this.usuarios.set(response.data); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar usuarios.'); this.loading.set(false); },
    });
  }

  clearSearch(): void { this.search.set(''); }
}
