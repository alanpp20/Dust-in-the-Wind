import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { StatusBar, Animation, Style } from '@capacitor/status-bar';
import { ArticlesComponent } from '../articles/articles.component';


register();


function ionViewWillEnter() {
  StatusBar.setOverlaysWebView({ overlay: false });
  StatusBar.show({animation: Animation.None});
  StatusBar.setStyle({ style: Style.Dark });
}

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [ ArticlesComponent,IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton],
  standalone: true,
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  
  constructor() {
    ionViewWillEnter();
  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
  
}
