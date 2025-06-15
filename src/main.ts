// src/main.ts

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// --- INÍCIO DA CORREÇÃO DOS ÍCONES ---
import { addIcons } from 'ionicons';
import { mail, football, person, tvOutline } from 'ionicons/icons';
// --- FIM DA CORREÇÃO DOS ÍCONES ---

if (environment.production) {
  enableProdMode();
}

// --- REGISTRO DOS ÍCONES ---
// Adiciona os ícones globalmente para que possam ser usados em qualquer lugar do app
addIcons({ mail, football, person, tvOutline });
// --- FIM DO REGISTRO ---


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
  ],
});