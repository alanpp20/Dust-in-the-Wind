// src/app/news/news.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, // Embora não usados diretamente aqui, são importações comuns
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonSpinner, IonImg
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common'; // Importe DatePipe para o pipe 'date'

interface NewsArticle {
  title: string;
  description: string;
  image_url: string;
  link: string;
  pubDate: string;
  source_id: string;
}

@Component({
  selector: 'app-news', // Este é o seletor que usaremos na página 'folder'
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe, // Adicione DatePipe aqui
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonSpinner, IonImg
  ]
})
export class NewsPage implements OnInit {
  news: NewsArticle[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  constructor() { }

  ngOnInit() {
    this.loadNews();
  }

  async loadNews() {
    this.isLoading = true;
    this.error = null;
    try {
      // Use a API Key fornecida
      const response = await fetch("https://newsdata.io/api/1/latest?apikey=pub_5953053e1ae14046a9f06577d62c28c7&q=futebol&language=pt" );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        this.news = data.results.filter((article: NewsArticle) => article.image_url); // Filtra artigos sem imagem
      } else {
        this.news = [];
        this.error = "Nenhuma notícia de futebol encontrada.";
      }
    } catch (e: any) {
      console.error("Erro ao carregar notícias:", e);
      this.error = `Falha ao carregar notícias: ${e.message}. Tente novamente mais tarde.`;
    } finally {
      this.isLoading = false;
    }
  }

  openNewsLink(url: string) {
    window.open(url, '_blank');
  }
}
