import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonInput, IonButton, IonItem, IonLabel, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { DatabaseService } from '../database.service'; // Assumindo que você usará o database service aqui

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
  private databaseService: DatabaseService = inject(DatabaseService);
  private router: Router = inject(Router);

  constructor() { }

  ngOnInit() { }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  async login() {
    // Verificamos se os campos não estão vazios
    if (!this.email || !this.password) {
      console.error('Email e senha são obrigatórios.');
      // Opcional: Adicionar um Alert para o usuário
      return;
    }

    console.log('Tentando fazer login com:', this.email);

    //
    // AQUI ENTRA A SUA LÓGICA DE AUTENTICAÇÃO REAL
    //
    // Você precisará de um método no seu ApiService, por exemplo, `autenticar(email, senha)`
    // que fará a chamada para o seu backend.
    // O código abaixo é um exemplo de como seria.
    /*
    this.apiService.autenticar(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login bem-sucedido!', response);
        // Salva os dados do usuário no banco de dados local
        this.databaseService.setUserData(response.token, response.user.name, response.user.email, response.user.master);
        // Navega para a página principal do app
        this.router.navigate(['/folder/Inbox']);
      },
      error: (err: any) => {
        console.error('Falha no login:', err);
        // Mostre um alerta de erro para o usuário
      }
    });
    */

    // Como ainda não temos o backend, vamos simular um login bem-sucedido e navegar
    console.log('Login simulado com sucesso! Navegando para a página principal.');
    this.router.navigate(['/folder/Inbox']);
  }
}