import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonAvatar, IonList, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonAvatar,   // Adicionado para suportar <ion-avatar>
    IonList,     // Adicionado para suportar <ion-list>
    IonItem,     // Adicionado para suportar <ion-item>
    IonLabel,    // Adicionado para suportar <ion-label>
    IonButton,   // Adicionado para suportar <ion-button>
    CommonModule,
    FormsModule
  ],
})
export class PerfilPage implements OnInit {
  public nome: string = 'Nome do Usuário';
  public senha: string = '';

  constructor() {}

  ngOnInit() {}

  alterarPerfil() {
    // Aqui você pode implementar a lógica para salvar as alterações
    alert('Nome e/ou senha alterados!');
  }
}