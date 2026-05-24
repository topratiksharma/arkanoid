import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadComponent: () =>
      import('./game/game.component').then((m) => m.GameComponent),
  },
  {
    path: '',
    redirectTo: 'game',
    pathMatch: 'full',
  },
];
