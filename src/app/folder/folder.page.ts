// src/app/folder/folder.page.ts
import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { NewsPage } from '../news/news.page';

register();

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  standalone: true,
  imports: [
    NewsPage,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonCard,
    IonCardContent,
    RouterModule,
  ],
})
export class FolderPage implements OnInit {
  videoUrl = 'https://www.youtube.com/embed/jVWnNV43ia4?si=nmJM5K3T7uz0B_pa" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
  safeVideoUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }

  ngOnInit() {
  }
}