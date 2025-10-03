import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wedding-invitation-card',
  standalone: true,
  imports: [CommonModule, LoadingComponent, RouterLink],
  templateUrl: './wedding-invitation-card.component.html',
  styleUrl: './wedding-invitation-card.component.scss'
})
export class WeddingInvitationCardComponent {

}
