import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/upload`;

  subir(archivo: File) {
    const formData = new FormData();
    formData.append('file', archivo);
    return this.http.post<ApiResponse<{ nombreArchivo: string }>>(this.apiUrl, formData);
  }
}
