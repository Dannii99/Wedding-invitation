import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wedding-invitation-card',
  standalone: true,
  imports: [CommonModule, LoadingComponent, RouterLink],
  templateUrl: './wedding-invitation-card.component.html',
  styleUrl: './wedding-invitation-card.component.scss',
})
export class WeddingInvitationCardComponent implements OnInit {
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Ocultamos el scroll del body temporalmente
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    // Luego de 1 segundo, lo restauramos
    setTimeout(() => {
      this.renderer.removeStyle(document.body, 'overflow');
    }, 4000);
  }
}
