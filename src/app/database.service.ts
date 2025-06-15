// src/app/database.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() {
    console.log('DatabaseService foi desativado temporariamente.');
  }

  // Método de exemplo agora vazio
  async setUserData(token: string, name: string, email: string, master: number): Promise<void> {
    console.log('Simulando salvamento de dados do usuário (desativado):', { token, name, email });
    // A lógica do banco de dados foi removida
    return Promise.resolve();
  }

  // Adicione outros métodos que você tinha, mas deixe-os vazios
}