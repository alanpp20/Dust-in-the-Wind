// src/app/chatbot/chatbot.page.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { sendOutline, playOutline, pauseOutline } from 'ionicons/icons'; // Importa ícones de play/pause

// Interface para as mensagens exibidas no chat
interface Message {
  role: 'user' | 'assistant';
  content: string;
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
export class ChatbotPage implements OnInit, AfterViewInit {
  // Referência ao ion-content para controle de scroll
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  // Referência ao elemento de áudio no HTML
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  messages: Message[] = []; // Array de mensagens exibidas no chat
  userMessage: string = ''; // Modelo para o input do usuário
  isLoading: boolean = false; // Indica se o assistente está a processar uma resposta

  // Variáveis de estado para o controle do áudio
  isPlayingAudio: boolean = false; // Indica se o áudio está a ser reproduzido
  currentAudioUrl: string | null = null; // Armazena a URL do último áudio gerado

  // --- Chaves e Endpoints das APIs ---
  // NOTA DE SEGURANÇA CRÍTICA:
  // Chaves de API não devem ser hardcoded em aplicações cliente (frontend) em produção.
  // Isso expõe a sua chave e pode levar a uso indevido.
  // Considere usar um backend (servidor) para intermediar as chamadas à API,
  // mantendo as chaves de API seguras no lado do servidor.

  // API Gemini
  private readonly GEMINI_API_KEY = 'AIzaSyBwC_ra7rMEK675PC-ZEZ7W8tq1MAecx6Y';
  private readonly GEMINI_MODEL = 'gemini-2.0-flash';
  private readonly GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${this.GEMINI_MODEL}:generateContent?key=${this.GEMINI_API_KEY}`;

  // API ElevenLabs
  private readonly ELEVENLABS_API_KEY = 'sk_f62e6e0a2eaeba403ee36c407a952be9a92043c50ab33c24';
  private readonly ELEVENLABS_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Carolina (feminina, brasileira )
  private readonly ELEVENLABS_ENDPOINT = `https://api.elevenlabs.io/v1/text-to-speech/${this.ELEVENLABS_VOICE_ID}`;
  private readonly ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

  constructor( ) {
    // Adiciona os ícones que serão usados
    addIcons({ sendOutline, playOutline, pauseOutline });
    // Mensagem de boas-vindas automática ao iniciar o chat
    this.messages.push({
      role: 'assistant',
      content: 'Olá! Sou seu assistente especialista em futebol. Como posso ajudar você hoje?',
    });
  }

  ngOnInit() {}

  // Este lifecycle hook é chamado após a inicialização das views do componente.
  // É o lugar ideal para adicionar event listeners a elementos do DOM.
  ngAfterViewInit() {
    if (this.audioPlayer && this.audioPlayer.nativeElement) {
      // Atualiza o estado 'isPlayingAudio' quando o áudio começa a tocar
      this.audioPlayer.nativeElement.addEventListener('play', () => {
        this.isPlayingAudio = true;
      });
      // Atualiza o estado 'isPlayingAudio' quando o áudio é pausado
      this.audioPlayer.nativeElement.addEventListener('pause', () => {
        this.isPlayingAudio = false;
      });
      // Atualiza o estado e limpa a URL quando o áudio termina
      this.audioPlayer.nativeElement.addEventListener('ended', () => {
        this.isPlayingAudio = false;
        if (this.currentAudioUrl) {
          URL.revokeObjectURL(this.currentAudioUrl); // Libera a URL do objeto
          this.currentAudioUrl = null;
        }
      });
    }
  }

  /**
   * Envia a mensagem do usuário para o chatbot e processa a resposta.
   */
  async sendMessage() {
    // Impede o envio de mensagens vazias ou apenas com espaços
    if (!this.userMessage.trim()) {
      return;
    }

    const currentMessage = this.userMessage.trim();
    // Adiciona a mensagem do usuário à lista de mensagens
    this.messages.push({ role: 'user', content: currentMessage });
    this.userMessage = ''; // Limpa o input imediatamente
    this.scrollToBottom(); // Rola para o fundo para mostrar a mensagem do usuário

    this.isLoading = true; // Ativa o spinner de carregamento

    // Se houver um áudio anterior a ser reproduzido, pare-o e limpe-o
    if (this.audioPlayer && this.audioPlayer.nativeElement && !this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.pause();
      this.audioPlayer.nativeElement.currentTime = 0;
    }
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    this.isPlayingAudio = false;


    try {
      // Prepara o histórico da conversa para a API Gemini
      const geminiContents: GeminiContent[] = [];

      // 1. Adiciona a instrução de persona e regras como a primeira "fala" do modelo.
      // Isso é crucial para controlar o comportamento do Gemini.
      geminiContents.push({
        role: 'model',
        parts: [
          {
            text: `Você é um especialista em futebol. Responda apenas a perguntas relacionadas a futebol (jogos, clubes, regras, história, jogadores etc.). Se a pergunta não for sobre futebol, responda educadamente que só pode tratar de assuntos futebolísticos e sugira que o usuário reformule. Suas respostas devem ser curtas, claras, humanas, informais, empáticas e engajadas. Não use emojis nem asteriscos. Ao final de cada resposta, pergunte sempre se o usuário quer saber mais.`,
          },
        ],
      });

      // 2. Mapeia as mensagens existentes para o formato Gemini, garantindo a alternância de roles.
      // A API Gemini exige que os roles alternem estritamente entre 'user' e 'model'.
      let lastRole: 'user' | 'model' | null = null;
      // Começa a partir da segunda mensagem, pois a primeira é a de boas-vindas do assistente
      // e a instrução de persona já foi adicionada como a primeira "fala" do modelo.
      for (const msg of this.messages) {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        // Se o role atual for o mesmo do último, significa que houve uma quebra na alternância.
        // Isso pode acontecer se o assistente responder duas vezes seguidas ou o usuário.
        // Para Gemini, precisamos garantir a alternância.
        if (role === lastRole) {
          // Se o último foi 'user' e o atual é 'user', adicionamos um 'model' vazio para alternar.
          if (role === 'user') {
            geminiContents.push({ role: 'model', parts: [{ text: '' }] });
          }
          // Se o último foi 'model' e o atual é 'model', adicionamos um 'user' vazio para alternar.
          // Isso é menos comum, mas pode acontecer com mensagens de erro do assistente.
          else if (role === 'model') {
            geminiContents.push({ role: 'user', parts: [{ text: '' }] });
          }
        }
        geminiContents.push({ role: role, parts: [{ text: msg.content }] });
        lastRole = role;
      }

      // Se a última mensagem adicionada for do usuário, adicionamos um placeholder para o modelo.
      // Isso é necessário para que o Gemini saiba que é a vez dele de responder.
      if (lastRole === 'user') {
        geminiContents.push({ role: 'model', parts: [{ text: '' }] });
      }

      // --- Chamada à API Gemini ---
      const geminiResponse = await fetch(this.GEMINI_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiContents,
        }),
      });

      if (!geminiResponse.ok) {
        const errorBody = await geminiResponse.json();
        console.error('Erro da API Gemini:', geminiResponse.status, geminiResponse.statusText, errorBody);
        this.messages.push({
          role: 'assistant',
          content: `Desculpe, houve um erro ao processar sua solicitação no momento. Por favor, tente novamente mais tarde.`,
        });
        this.scrollToBottom();
        return; // Sai da função se houver erro na Gemini
      }

      const geminiData = await geminiResponse.json();
      console.log('Resposta completa da API Gemini:', geminiData);

      let assistantResponseText: string = 'Não foi possível obter uma resposta válida do assistente.';

      // Extrai a resposta do Gemini
      if (
        geminiData.candidates &&
        geminiData.candidates.length > 0 &&
        geminiData.candidates[0].content &&
        geminiData.candidates[0].content.parts &&
        geminiData.candidates[0].content.parts.length > 0
      ) {
        assistantResponseText = geminiData.candidates[0].content.parts[0].text;
      } else {
        console.warn('Estrutura de resposta da API Gemini inesperada ou incompleta:', geminiData);
        assistantResponseText = 'Resposta do assistente em formato inesperado.';
      }

      // Adiciona a pergunta "Quer saber mais?" ao final da resposta
      assistantResponseText += ' Quer saber mais?';

      // Adiciona a resposta do assistente à lista de mensagens
      this.messages.push({ role: 'assistant', content: assistantResponseText });
      this.scrollToBottom();

      // --- Chamada à API ElevenLabs para gerar áudio ---
      await this.playAssistantResponse(assistantResponseText);

    } catch (error: any) {
      console.error('Erro ao enviar mensagem para o chatbot ou gerar áudio:', error);
      this.messages.push({
        role: 'assistant',
        content: 'Desculpe, não consegui conectar ao serviço no momento. Verifique sua conexão com a internet.',
      });
      this.scrollToBottom();
    } finally {
      this.isLoading = false; // Desativa o spinner de carregamento
    }
  }

  /**
   * Gera e reproduz o áudio da resposta do assistente usando ElevenLabs.
   * @param text A resposta do assistente a ser convertida em áudio.
   */
  private async playAssistantResponse(text: string) {
    try {
      const elevenLabsBody: ElevenLabsRequest = {
        text: text,
        model_id: this.ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: 0.75, // Ajuste para maior estabilidade
          similarity_boost: 0.75, // Ajuste para maior similaridade
        },
      };

      const elevenLabsResponse = await fetch(this.ELEVENLABS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify(elevenLabsBody),
      });

      if (!elevenLabsResponse.ok) {
        const errorBody = await elevenLabsResponse.json();
        console.error('Erro da API ElevenLabs:', elevenLabsResponse.status, elevenLabsResponse.statusText, errorBody);
        // Não adiciona mensagem de erro ao chat para não poluir, apenas loga.
        return;
      }

      // Obtém o blob de áudio e cria uma URL para ele
      const audioBlob = await elevenLabsResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Armazena a URL do áudio atual para controle de play/pause
      this.currentAudioUrl = audioUrl;

      // Define a URL do áudio e reproduz
      if (this.audioPlayer && this.audioPlayer.nativeElement) {
        this.audioPlayer.nativeElement.src = audioUrl;
        this.audioPlayer.nativeElement.play();
      }
    } catch (error) {
      console.error('Erro ao reproduzir áudio com ElevenLabs:', error);
    }
  }

  /**
   * Alterna entre reproduzir e pausar o áudio atual.
   */
  toggleAudioPlayback() {
    if (this.audioPlayer && this.audioPlayer.nativeElement && this.currentAudioUrl) {
      if (this.audioPlayer.nativeElement.paused) {
        this.audioPlayer.nativeElement.play();
      } else {
        this.audioPlayer.nativeElement.pause();
      }
    }
  }

  /**
   * Rola o conteúdo do chat para o fundo com uma animação suave.
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
