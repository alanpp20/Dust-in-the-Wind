import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonMenuButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonMenuButton,
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class SobrePage implements OnInit {

  // Você pode tornar essa lista dinâmica futuramente
  teamMembers = [
    { name: 'Carlos Augusto', role: 'Desenvolvedor' },
    { name: 'Alan Pedro', role: 'Desenvolvedor' },
    { name: 'Guilherme Rafael', role: 'Desenvolvedor' },
    { name: 'Igor Oliveira', role: 'Desenvolvedor' }
  ];

  constructor() { }

  ngOnInit() {
    // Você pode inicializar animações, chamadas de dados etc.
    console.log('SobrePage iniciada.');
  }

}
