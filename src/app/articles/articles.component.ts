import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
// 1. Importar o IonSpinner para a animação
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonSpinner } from '@ionic/angular/standalone';
// 2. Importar o operador 'finalize' para sabermos quando a busca termina
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  standalone: true,
  imports: [
    CommonModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonGrid, IonRow, IonCol,
    IonSpinner // 3. Adicionar o IonSpinner aos imports
  ]
})
export class ArticlesComponent implements OnInit {
  public liveGames: any[] = [];
  // 4. Criar a nova variável para controlar o estado de carregamento
  public isLoading: boolean = true; 
  private apiService: ApiService = inject(ApiService);

  constructor() { }

  ngOnInit() {
    this.loadLiveScores();
  }

  loadLiveScores() {
    // Garantir que o loading apareça toda vez que buscarmos os dados
    this.isLoading = true; 
    
    this.apiService.getLiveScores().pipe(
      // 5. Usar 'finalize' para garantir que isLoading vire 'false' no final, com sucesso ou erro
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (data: any) => {
        this.liveGames = data.response;
        console.log('Jogos ao vivo carregados:', this.liveGames);
      },
      error: (error) => {
        console.error('Erro ao buscar jogos ao vivo:', error);
        // Limpar a lista em caso de erro para mostrar a mensagem de 'vazio'
        this.liveGames = []; 
      }
    });
  }
}