// src/app/folder/folder.page.ts
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
// import { StatusBar, Animation, Style } from '@capacitor/status-bar'; // Removido se não estiver usando diretamente aqui
// import { ArticlesComponent } from '../articles/articles.component'; // Removido, pois não é usado no folder.page.html

import { NewsPage } from '../news/news.page'; // Importe o componente NewsPage

register();

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [
    NewsPage, // Adicione NewsPage aqui
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton
    // ArticlesComponent, // Remova esta linha se ArticlesComponent não for usado no folder.page.html
  ],
  standalone: true,
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }

}
