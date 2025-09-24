import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'wedding-invitation',
    loadComponent: () => import('./pages/wedding-invitation-card/wedding-invitation-card.component').then((m) => m.WeddingInvitationCardComponent)
  },
  {
     path: 'wedding-landing',
    loadComponent: () => import('./pages/wedding-landing/wedding-landing.component').then((m) => m.WeddingLandingComponent)
  },
  {
    path: '',
    redirectTo: 'wedding-landing',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'wedding-landing',
    pathMatch: 'full'
  }
];
