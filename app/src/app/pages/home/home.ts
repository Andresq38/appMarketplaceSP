import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ContentCard {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  cards = signal<ContentCard[]>([
    {
      title: 'Servicios de Salud',
      description: 'Explora servicios profesionales especializados en diversas áreas de la salud.',
      icon: 'medical_services',
    },
    {
      title: 'Gestión de Citas',
      description: 'Reserva, consulta y gestiona tus citas con profesionales de salud.',
      icon: 'event',
    },
    {
      title: 'Especialidades',
      description: 'Encuentra profesionales de diferentes especialidades médicas.',
      icon: 'local_hospital',
    },
    {
      title: 'Reseñas y Valoraciones',
      description: 'Comparte tu experiencia y conoce las opiniones de otros usuarios.',
      icon: 'star',
    },
  ]);
}
