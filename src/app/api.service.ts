// src/app/api.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http: HttpClient = inject(HttpClient);

  // URL para buscar jogos ao vivo da API-FOOTBALL
  private url: string = 'https://v3.football.api-sports.io/fixtures?live=all';

  // Configuração do cabeçalho com sua chave de API
  private headers = new HttpHeaders({
    'x-rapidapi-key': environment.apiFootballKey
  });

  constructor() { }

  // Novo método para buscar os placares ao vivo
  getLiveScores() {
    // Faz a requisição GET, passando a URL e os cabeçalhos de autenticação
    return this.http.get(this.url, { headers: this.headers });
  }
}