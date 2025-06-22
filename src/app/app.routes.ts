// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then((m) => m.PerfilPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'recover',
    loadComponent: () => import('./recover/recover.page').then((m) => m.RecoverPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'placares',
    loadComponent: () => import('./placares/placares.page').then((m) => m.PlacaresPage),
  },
  {
    path: 'chatbot',
    loadComponent: () => import('./chatbot/chatbot.page').then((m) => m.ChatbotPage),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./sobre/sobre.page').then((m) => m.SobrePage),
  },
];
