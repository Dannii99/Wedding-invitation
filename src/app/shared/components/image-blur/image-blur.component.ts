import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';

@Component({
  selector: 'image-blur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-blur.component.html',
  styleUrl: './image-blur.component.scss'
})
export class ImageBlurComponent {

  // image requerida version hd
  hdUrl = input.required<string>();

  // Tu valor derivado (Solo lectura, reactivo)
  lowResUrl = computed(() => {
    const url = this.hdUrl();
    // Lógica: Busca la extensión final (ej: .jpg) y ponle -tiny antes
    // La regex busca un punto seguido de caracteres al final del string ($)
    return url.replace(/(\.[^.]+)$/, '-tiny$1');
  });

  // Es opcional. Si no se envía nada, será un string vacío ''
  customClass = input('');

  bgLoaded = signal<boolean>(false);

  onHdImageLoad() {
    this.bgLoaded.set(true);
  }

  constructor() {
    effect(() => {
      // console.log('hdUrl => ', this.hdUrl());
      // console.log('lowResUrl => ', this.lowResUrl());
    })
  }

}
