import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/upload`;
  private readonly imageUrl = `${environment.imageUrl}`;

  subir(archivo: File) {
    const formData = new FormData();
    formData.append('image', archivo);
    return this.http.post<ApiResponse<{ nombreArchivo: string }>>(this.apiUrl, formData);
  }

  getImageUrl(nombreArchivo: string): string {
    return `${this.imageUrl}/${nombreArchivo}`;
  }
}
