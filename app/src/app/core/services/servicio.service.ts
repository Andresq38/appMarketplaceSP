import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';
import { Servicio, ServicioCreateDto, ServicioUpdateDto } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/servicio`;

  private transformarEspecialidades(servicio: any): Servicio {
    return {
      ...servicio,
      especialidades: servicio.especialidades?.map((item: any) => item.especialidad) || [],
    };
  }

  listar() {
    return this.http.get<ApiPaginatedResponse<Servicio>>(this.apiUrl).pipe(
      map(response => ({
        ...response,
        data: response.data.map((s: any) => this.transformarEspecialidades(s))
      }))
    );
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        data: this.transformarEspecialidades(response.data)
      }))
    );
  }

  crear(datos: ServicioCreateDto) {
    return this.http.post<ApiResponse<Servicio>>(this.apiUrl, datos).pipe(
      map(response => ({
        ...response,
        data: this.transformarEspecialidades(response.data)
      }))
    );
  }

  actualizar(id: number, datos: ServicioUpdateDto) {
    return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
