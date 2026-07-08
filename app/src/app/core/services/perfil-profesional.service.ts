import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { PerfilProfesional, PerfilProfesionalCreateDto, PerfilProfesionalUpdateDto } from '../models/perfil-profesional.model';

@Injectable({ providedIn: 'root' })
export class PerfilProfesionalService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/perfil-profesional`;

  private transformarEspecialidades(perfil: any): PerfilProfesional {
    return {
      ...perfil,
      especialidades: perfil.especialidades?.map((item: any) => item.especialidad) || [],
    };
  }

  listar() {
    return this.http.get<ApiPaginatedResponse<PerfilProfesional>>(this.apiUrl).pipe(
      map(response => ({
        ...response,
        data: response.data.map((p: any) => this.transformarEspecialidades(p))
      }))
    );
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        data: this.transformarEspecialidades(response.data)
      }))
    );
  }

  crear(datos: PerfilProfesionalCreateDto) {
    return this.http.post<ApiResponse<PerfilProfesional>>(this.apiUrl, datos).pipe(
      map(response => ({
        ...response,
        data: this.transformarEspecialidades(response.data)
      }))
    );
  }

  actualizar(id: number, datos: PerfilProfesionalUpdateDto) {
    return this.http.put<ApiResponse<PerfilProfesional>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }
}
