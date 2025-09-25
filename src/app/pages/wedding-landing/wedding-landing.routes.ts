import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./wedding-landing.component').then((m) => m.WeddingLandingComponent)
  }
];
