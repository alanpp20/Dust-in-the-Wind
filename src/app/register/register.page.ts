import { Component, OnInit } from '@angular/core';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg, IonCheckbox} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput, 
    IonButton, 
    IonItem, 
    IonLabel,
    FormsModule,
    IonImg,
    RouterLink,
    IonCheckbox]
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';
  name: string = '';
  master: boolean = false;

  constructor() {}

  clickar() {
    console.log('Master:', this.master);
    }
  ngOnInit() {
  }

}
