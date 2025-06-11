import { Component, OnInit } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink, NavController, IonApp} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, person} from 'ionicons/icons';
import {IonRouterOutlet } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, RouterLink, IonRouterOutlet, RouterLinkActive, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterLink],
})
export class AppComponent {
  public appPages = [
      { title: 'Home', url: '/folder/inbox', icon: 'home' },
      { title: 'Perfil', url: '/perfil', icon: 'person' },
      { title: 'Login', url: '/login', icon: 'person' },
    ];
    constructor(public navCtrl: NavController) { 
      addIcons({ home, person});
    }
  
    navigateTo(way:string){
      // Implement navigation logic here
      this.navCtrl.navigateRoot(way);
    }
    ngOnInit() {}
  
}
