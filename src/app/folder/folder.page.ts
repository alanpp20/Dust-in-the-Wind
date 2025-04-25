import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';


register();

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonContent],
  standalone: true,
})
export class FolderPage implements OnInit {
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  constructor() {}

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
  }
}
