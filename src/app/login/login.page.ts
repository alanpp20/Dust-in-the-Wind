import { Component, OnInit } from '@angular/core';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavController} from '@ionic/angular';
import { RegisterPage } from "../register/register.page";

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
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(public navCtrl: NavController) { }

  navigateToRegister(){
    // Implement navigation logic here
    this.navCtrl.navigateForward('/register', { animated: true });
  }
  ngOnInit() { }
}
