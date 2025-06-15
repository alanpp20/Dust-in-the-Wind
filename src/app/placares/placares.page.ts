// src/app/placares/placares.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Adicione IonButtons e IonMenuButton aqui
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ArticlesComponent } from '../articles/articles.component';

@Component({
  selector: 'app-placares',
  templateUrl: './placares.page.html',
  styleUrls: ['./placares.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    ArticlesComponent,
    IonButtons, IonMenuButton // E adicione aqui também
  ]
})
export class PlacaresPage implements OnInit {
  constructor() { }
  ngOnInit() { }
}