// src/app/app.component.ts
import { Component } from '@angular/core'; // Removido OnInit, pois ngOnInit está vazio
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle,
  IonItem, IonIcon, IonLabel, NavController, IonApp, IonRouterOutlet // Removido IonRouterLink, pois RouterLink já é usado
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, // Padronizado para -outline
  personOutline, // Padronizado para -outline
  footballOutline, // Ícone para Placares
  chatbubblesOutline, // Ícone para Chatbot
  informationCircleOutline // Ícone para Sobre o App
  // Se você tiver outros ícones para 'recover' ou 'register', adicione-os aqui também
  // Ex: keyOutline, personAddOutline
} from 'ionicons/icons';
// Removido HttpClient, pois não está sendo usado neste componente

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    RouterLink,
    IonRouterOutlet,
    RouterLinkActive,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel
    // IonRouterLink foi removido, pois RouterLink já é o padrão para standalone
  ],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/inbox', icon: 'home-outline' }, // Sua página principal com as notícias
    { title: 'Placares ao Vivo', url: '/placares', icon: 'football-outline' }, // Novo item
    { title: 'Chatbot', url: '/chatbot', icon: 'chatbubbles-outline' }, // Novo item
    { title: 'Sobre o App', url: '/sobre', icon: 'information-circle-outline' }, // Nova página
    { title: 'Perfil', url: '/perfil', icon: 'person-outline' },
    { title: 'Login', url: '/login', icon: 'person-outline' },
    // Adicione aqui outros itens do seu menu, como Recover e Register, se houver
    // Ex: { title: 'Recuperar Senha', url: '/recover', icon: 'key-outline' },
    // Ex: { title: 'Registrar', url: '/register', icon: 'person-add-outline' },
  ];

  constructor(public navCtrl: NavController) {
    // Adicione todos os ícones usados no appPages e em outras partes do app
    addIcons({
      homeOutline,
      personOutline,
      footballOutline,
      chatbubblesOutline,
      informationCircleOutline, // Novo ícone
      // Adicione aqui os ícones para Recover, Register, etc. se usar
      // keyOutline,
      // personAddOutline,
    });
  }

  navigateTo(way: string) {
    // Implement navigation logic here
    this.navCtrl.navigateRoot(way);
  }

  // ngOnInit foi removido, pois estava vazio e OnInit não é mais importado
}