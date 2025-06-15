// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox', // Redireciona para a página 'folder' com o ID 'inbox'
    pathMatch: 'full',
  },
  {
    path: 'folder/:id', // Rota para a sua página principal 'folder' (que agora contém as notícias)
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./perfil/perfil.page').then( m => m.PerfilPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'recover',
    loadComponent: () => import('./recover/recover.page').then( m => m.RecoverPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'placares',
    loadComponent: () => import('./placares/placares.page').then( m => m.PlacaresPage)
  },
  {
    path: 'chatbot', // Rota para a página do Chatbot
    loadComponent: () => import('./chatbot/chatbot.page').then( m => m.ChatbotPage)
  },
  // A rota 'news' foi removida, pois o componente NewsPage é agora parte da FolderPage.
  // Se você precisar que 'news' seja uma página navegável separadamente no futuro,
  // você pode adicioná-la de volta aqui.
];
