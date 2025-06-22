// src/app/news/news.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonSpinner, IonImg, IonModal, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { DatePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { closeOutline, openOutline, shareOutline } from 'ionicons/icons';

interface NewsArticle {
  title: string;
  description: string;
  image_url: string;
  link: string;
  pubDate: string;
  source_id: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, DatePipe,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonSpinner, IonImg, IonModal, IonButton, IonIcon
  ]
})
export class NewsPage implements OnInit {
  news: NewsArticle[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  selectedArticle: NewsArticle | null = null;
  isModalOpen: boolean = false;

  constructor() {
    addIcons({ closeOutline, openOutline, shareOutline });
  }

  ngOnInit() {
    this.loadNews();
  }

  async loadNews() {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await fetch("https://newsdata.io/api/1/latest?apikey=pub_5953053e1ae14046a9f06577d62c28c7&q=futebol&language=pt");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        this.news = data.results.filter((article: NewsArticle) => article.image_url);
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

  openNewsModal(article: NewsArticle) {
    this.selectedArticle = article;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedArticle = null;
  }

  openNewsLink(url: string) {
    window.open(url, '_blank');
  }

  shareArticle(article: NewsArticle) {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.link,
      });
    } else {
      // Fallback para dispositivos que não suportam Web Share API
      navigator.clipboard.writeText(article.link);
      // Aqui você poderia mostrar um toast informando que o link foi copiado
    }
  }
}