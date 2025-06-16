// src/app/chatbot/chatbot.page.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonInput, IonButton, IonIcon, IonSpinner, IonList, IonItem, IonLabel, IonText, IonFooter } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline } from 'ionicons/icons';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Interfaces para o formato de mensagem que a API Gemini espera
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model'; // Gemini usa 'user' e 'model'
  parts: GeminiPart[];
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonInput, IonButton, IonIcon, IonSpinner, IonList, IonItem, IonLabel, IonText, IonFooter
  ]
})
export class ChatbotPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  messages: Message[] = [];
  userMessage: string = '';
  isLoading: boolean = false;

  // NOTA DE SEGURANÇA CRÍTICA:
  // Chaves de API não devem ser hardcoded em aplicações cliente (frontend).
  // Isso expõe a sua chave e pode levar a uso indevido.
  // Considere usar um backend (servidor) para intermediar as chamadas à API,
  // mantendo a chave de API segura no lado do servidor.
  // Substitua 'YOUR_GEMINI_API_KEY' pela sua chave real da API Gemini.
  private readonly GEMINI_API_KEY = 'AIzaSyBwC_ra7rMEK675PC-ZEZ7W8tq1MAecx6Y';
  private readonly GEMINI_MODEL = 'gemini-2.0-flash'; // Ou 'gemini-pro', 'gemini-1.5-flash', etc.
  private readonly API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${this.GEMINI_API_KEY}`;

  constructor( ) {
    addIcons({ sendOutline });
    // Mensagem de boas-vindas inicial
    this.messages.push({ role: 'assistant', content: 'Olá! Sou seu assistente de futebol. Pergunte-me sobre qualquer coisa relacionada a futebol!' });
  }

  ngOnInit() {}

  async sendMessage() {
    if (!this.userMessage.trim()) {
      return;
    }

    const currentMessage = this.userMessage.trim();
    this.messages.push({ role: 'user', content: currentMessage });
    this.userMessage = '';
    this.scrollToBottom(); // Rola para o fundo para mostrar a mensagem do utilizador

    this.isLoading = true; // Ativa o indicador de carregamento

    try {
      // Prepara as mensagens para a API Gemini
      // A API Gemini não usa um "system" role diretamente para instruções de persona
      // mas sim no prompt inicial ou através de "safety settings".
      // Para este exemplo, vamos adicionar a instrução de persona como a primeira mensagem do "model"
      // ou garantir que a primeira mensagem do usuário já inclua o contexto.
      // Uma abordagem comum é ter a primeira mensagem do assistente como "model" e a primeira do usuário como "user".

      const geminiContents: GeminiContent[] = [];

      // Adiciona a instrução de persona como a primeira mensagem do "model" se a conversa estiver vazia
      // ou se for a primeira interação após a mensagem de boas-vindas.
      if (this.messages.length === 1 && this.messages[0].role === 'assistant') {
        geminiContents.push({
          role: 'model',
          parts: [{ text: 'Olá! Sou seu especialista em futebol. Respondo apenas a perguntas relacionadas a futebol. Se a pergunta não for sobre futebol, respondo educadamente que só posso falar sobre futebol e peço para o usuário reformular a pergunta.' }]
        });
      }

      // Mapeia as mensagens existentes para o formato Gemini
      // Gemini espera alternância de 'user' e 'model'
      this.messages.forEach(msg => {
        // Ajusta o role para 'model' se for 'assistant'
        const role = msg.role === 'assistant' ? 'model' : 'user';
        geminiContents.push({
          role: role,
          parts: [{ text: msg.content }]
        });
      });

      // Se a última mensagem for do usuário, adicionamos um placeholder para a resposta do modelo
      // Isso é importante para o Gemini entender o turno.
      if (geminiContents[geminiContents.length - 1].role === 'user') {
        geminiContents.push({
          role: 'model',
          parts: [{ text: '' }] // Placeholder para a resposta do modelo
        });
      }


      const response = await fetch(this.API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiContents
        })
      });

      if (!response.ok) {
        const errorBody = await response.json();
        console.error('Erro da API Gemini:', response.status, response.statusText, errorBody);
        this.messages.push({ role: 'assistant', content: `Desculpe, houve um erro ao processar sua solicitação: ${errorBody.error?.message || response.statusText}.` });
      } else {
        const data = await response.json();
        console.log('Resposta completa da API Gemini:', data);

        let assistantResponse: string = 'Não foi possível obter uma resposta válida do assistente.';

        // Tenta extrair a resposta do Gemini
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
          assistantResponse = data.candidates[0].content.parts[0].text;
        } else {
          console.warn('Estrutura de resposta da API Gemini inesperada ou incompleta:', data);
          assistantResponse = 'Resposta do assistente em formato inesperado.';
        }

        this.messages.push({ role: 'assistant', content: assistantResponse });
      }

    } catch (error: any) {
      console.error('Erro ao enviar mensagem para o chatbot Gemini:', error);
      this.messages.push({
        role: 'assistant',
        content: 'Desculpe, não consegui conectar ao serviço Gemini no momento. Verifique sua conexão com a internet.'
      });
    } finally {
      this.isLoading = false; // Desativa o indicador de carregamento
      this.scrollToBottom(); // Rola para o fundo novamente
    }
  }

  /**
   * Método auxiliar para rolar o conteúdo do chat para o fundo.
   * Usa requestAnimationFrame para garantir que a rolagem ocorra após a renderização do DOM.
   */
  private scrollToBottom() {
    requestAnimationFrame(() => {
      if (this.content) {
        this.content.scrollToBottom(300); // Animação de rolagem de 300ms
      }
    });
  }
}

