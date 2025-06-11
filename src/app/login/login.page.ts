import { Component, inject, OnInit } from '@angular/core';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { NavController, MenuController} from '@ionic/angular';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';

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

  private apiService: ApiService = inject(ApiService);

  constructor(public navCtrl: NavController) {
   }

  navigateToRegister(){
    // Implement navigation logic here
    this.navCtrl.navigateForward('/register', { animated: true });
  }
  ngOnInit() { }
  async login() {
    // Implement login logic here
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    alert(`Email: ${this.email}, Password: ${this.password}`);
    const datuada = await this.apiService.getData().subscribe({
      next: (data) => {
        console.log('Data received:', data);
        alert(`Data received: ${JSON.stringify(data)}`);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        alert(`Error fetching data: ${error.message}`);
      }
    }
    );
  }
}
