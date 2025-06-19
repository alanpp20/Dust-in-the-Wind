// src/app/chatbot/chatbot.page.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonList,
  IonItem,
  IonLabel,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, playOutline, pauseOutline } from 'ionicons/icons';

// Interface para as mensagens exibidas no chat
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// Interfaces para a API Gemini
interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: 'user' | 'model'; // Gemini usa 'user' e 'model'
  parts: GeminiPart[];
}

// Interfaces para a API ElevenLabs
interface ElevenLabsRequest {
  text: string;
  model_id: string;
  voice_settings: {
    stability: number;
    similarity_boost: number;
  };
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonFooter,
  ],
})
export class ChatbotPage implements OnInit, AfterViewInit, OnDestroy {
  // Referência ao ion-content para controle de scroll
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  // Referência ao elemento de áudio no HTML
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  messages: Message[] = []; // Array de mensagens exibidas no chat
  userMessage: string = ''; // Modelo para o input do usuário
  isLoading: boolean = false; // Indica se o assistente está processando uma resposta

  // Variáveis de estado para o controle do áudio
  isPlayingAudio: boolean = false; // Indica se o áudio está sendo reproduzido
  currentAudioUrl: string | null = null; // Armazena a URL do último áudio gerado

  // Controle de tentativas para retry
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1 segundo

  // --- Chaves e Endpoints das APIs ---
  // NOTA DE SEGURANÇA: Em produção, use um backend para intermediar as chamadas
  // e manter as chaves de API seguras no servidor

  // API Gemini
  private readonly GEMINI_API_KEY = 'AIzaSyBwC_ra7rMEK675PC-ZEZ7W8tq1MAecx6Y';
  private readonly GEMINI_MODEL = 'gemini-2.0-flash';
  private readonly GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${this.GEMINI_API_KEY}`;

  // API ElevenLabs
  private readonly ELEVENLABS_API_KEY = 'sk_f62e6e0a2eaeba403ee36c407a952be9a92043c50ab33c24';
  private readonly ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';
  private readonly ELEVENLABS_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${this.ELEVENLABS_VOICE_ID}`;
  private readonly ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

  constructor() {
    // Adiciona os ícones que serão usados
    addIcons({ sendOutline, playOutline, pauseOutline });
    
    // Mensagem de boas-vindas automática ao iniciar o chat
    this.messages.push({
      role: 'assistant',
      content: 'Olá! Sou seu assistente especialista em futebol. Como posso ajudar você hoje?',
      timestamp: new Date()
    });
  }

  ngOnInit() {
    // Configurações iniciais se necessário
  }

  ngAfterViewInit() {
    this.setupAudioEventListeners();
    this.scrollToBottom();
  }

  ngOnDestroy() {
    // Limpa recursos ao destruir o componente
    this.cleanupAudio();
  }

  /**
   * Configura os event listeners para o player de áudio
   */
  private setupAudioEventListeners() {
    if (this.audioPlayer?.nativeElement) {
      const audio = this.audioPlayer.nativeElement;
      
      audio.addEventListener('play', () => {
        this.isPlayingAudio = true;
      });
      
      audio.addEventListener('pause', () => {
        this.isPlayingAudio = false;
      });
      
      audio.addEventListener('ended', () => {
        this.isPlayingAudio = false;
        this.cleanupCurrentAudio();
      });
      
      audio.addEventListener('error', (error) => {
        console.error('Erro no player de áudio:', error);
        this.isPlayingAudio = false;
        this.cleanupCurrentAudio();
      });
    }
  }

  /**
   * Envia a mensagem do usuário para o chatbot e processa a resposta
   */
  async sendMessage() {
    // Validação da mensagem
    if (!this.userMessage?.trim() || this.isLoading) {
      return;
    }

    const currentMessage = this.userMessage.trim();
    
    // Adiciona a mensagem do usuário
    this.messages.push({ 
      role: 'user', 
      content: currentMessage,
      timestamp: new Date()
    });
    
    this.userMessage = '';
    this.scrollToBottom();
    this.isLoading = true;

    // Para áudio anterior se estiver tocando
    this.stopCurrentAudio();

    try {
      await this.processMessage(currentMessage);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      this.addErrorMessage('Desculpe, houve um erro ao processar sua mensagem. Tente novamente.');
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Processa a mensagem do usuário com retry automático
   */
  private async processMessage(message: string, attempt: number = 1): Promise<void> {
    try {
      const geminiContents = this.prepareGeminiContents();
      const response = await this.callGeminiAPI(geminiContents);
      
      if (response) {
        this.messages.push({
          role: 'assistant',
          content: response,
          timestamp: new Date()
        });
        
        this.scrollToBottom();
        
        // Gerar áudio em background
        this.generateAudioAsync(response);
      }
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.log(`Tentativa ${attempt} falhou, tentando novamente...`);
        await this.delay(this.retryDelay * attempt);
        return this.processMessage(message, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Prepara o histórico de mensagens para a API Gemini
   */
  private prepareGeminiContents(): GeminiContent[] {
    const geminiContents: GeminiContent[] = [];

    // Instrução de persona
    geminiContents.push({
      role: 'model',
      parts: [{
        text: `Você é um especialista em futebol brasileiro. Responda apenas perguntas sobre futebol (jogos, clubes, regras, história, jogadores, táticas, competições). 
        Se a pergunta não for sobre futebol, responda educadamente que só trata de assuntos futebolísticos. 
        Suas respostas devem ser: informativas, objetivas, em português brasileiro, entre 50-150 palavras. 
        Ao final, sempre pergunte se o usuário quer saber mais sobre algum aspecto específico.`
      }]
    });

    // Converte mensagens para formato Gemini
    let lastRole: 'user' | 'model' | null = null;
    
    for (const msg of this.messages.slice(1)) { // Pula mensagem de boas-vindas
      const role = msg.role === 'assistant' ? 'model' : 'user';
      
      // Garante alternância de roles
      if (role === lastRole) {
        if (role === 'user') {
          geminiContents.push({ role: 'model', parts: [{ text: 'Entendi.' }] });
        } else {
          geminiContents.push({ role: 'user', parts: [{ text: 'Continue.' }] });
        }
      }
      
      geminiContents.push({
        role: role,
        parts: [{ text: msg.content }]
      });
      
      lastRole = role;
    }

    return geminiContents;
  }

  /**
   * Chama a API do Gemini
   */
  private async callGeminiAPI(contents: GeminiContent[]): Promise<string> {
    const response = await fetch(this.GEMINI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Erro da API Gemini:', response.status, errorData);
      throw new Error(`Erro na API Gemini: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Resposta inválida da API Gemini:', data);
      throw new Error('Resposta inválida da API');
    }

    return data.candidates[0].content.parts[0].text.trim();
  }

  /**
   * Gera áudio de forma assíncrona
   */
  private async generateAudioAsync(text: string) {
    try {
      await this.generateAudio(text);
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      // Não exibe erro para o usuário, apenas loga
    }
  }

  /**
   * Gera áudio usando ElevenLabs
   */
  private async generateAudio(text: string): Promise<void> {
    const requestBody: ElevenLabsRequest = {
      text: this.cleanTextForAudio(text),
      model_id: this.ELEVENLABS_MODEL_ID,
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    };

    const response = await fetch(this.ELEVENLABS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.ELEVENLABS_API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Erro na API ElevenLabs: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    this.currentAudioUrl = audioUrl;
    
    if (this.audioPlayer?.nativeElement) {
      this.audioPlayer.nativeElement.src = audioUrl;
      // Auto-play removido para melhor UX
    }
  }

  /**
   * Limpa o texto para melhor síntese de áudio
   */
  private cleanTextForAudio(text: string): string {
    return text
      .replace(/\*/g, '') // Remove asteriscos
      .replace(/#{1,6}\s/g, '') // Remove headers markdown
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links markdown
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }

  /**
   * Alterna reprodução/pausa do áudio
   */
  toggleAudioPlayback() {
    if (!this.audioPlayer?.nativeElement || !this.currentAudioUrl) {
      return;
    }

    const audio = this.audioPlayer.nativeElement;
    
    if (audio.paused) {
      audio.play().catch(error => {
        console.error('Erro ao reproduzir áudio:', error);
      });
    } else {
      audio.pause();
    }
  }

  /**
   * Para o áudio atual
   */
  private stopCurrentAudio() {
    if (this.audioPlayer?.nativeElement && !this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.currentTime = 0;
    }
    this.cleanupCurrentAudio();
  }

  /**
   * Limpa o áudio atual
   */
  private cleanupCurrentAudio() {
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    this.isPlayingAudio = false;
  }

  /**
   * Limpa todos os recursos de áudio
   */
  private cleanupAudio() {
    this.stopCurrentAudio();
  }

  /**
   * Adiciona mensagem de erro ao chat
   */
  private addErrorMessage(message: string) {
    this.messages.push({
      role: 'assistant',
      content: message,
      timestamp: new Date()
    });
    this.scrollToBottom();
  }

  /**
   * Rola o conteúdo para o final
   */
  private scrollToBottom() {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(300);
      }
    }, 100);
  }

  /**
   * Utilitário para delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Verifica se pode enviar mensagem
   */
  canSendMessage(): boolean {
    return !this.isLoading && this.userMessage?.trim().length > 0;
  }

  /**
   * Handle para Enter no input
   */
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.canSendMessage()) {
      this.sendMessage();
    }
  }
}