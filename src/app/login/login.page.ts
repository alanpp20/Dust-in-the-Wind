import { Component, OnInit } from '@angular/core';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NavController, MenuController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput, 
    IonButton, 
    IonItem, 
    IonLabel,
    FormsModule,
    IonImg,
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(public navCtrl: NavController, public menu:MenuController) {

   }
   ionViewWillEnter() {
    console.log('ionViewWillEnter login');
  this.menu.swipeGesture(false, 'main-menu');
  this.menu.enable(false, 'main-menu'); // Desativa completamente o menu se quiser
}

  navigateToRegister(){
    // Implement navigation logic here
    this.navCtrl.navigateForward('/register', { animated: true });
  }
  ngOnInit() { }
}
