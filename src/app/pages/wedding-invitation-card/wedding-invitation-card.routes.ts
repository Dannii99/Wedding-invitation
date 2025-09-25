import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./wedding-invitation-card.component').then((m) => m.WeddingInvitationCardComponent)
  }
];
