import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '1task',
    loadComponent: () => import('./task1/task1.component').then((m) => m.Task1Component),
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
