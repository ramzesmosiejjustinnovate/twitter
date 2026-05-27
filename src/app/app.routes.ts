import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
  {
    path: 'posts',
    loadComponent: () =>
      import('./features/posts/posts-page/posts-page.component').then(
        (m) => m.PostsPageComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      ),
  },
];
