import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective  implements AfterViewInit, OnDestroy {
  @Input() revealDelayMs = 0;

  private io?: IntersectionObserver;
  private revealed = false;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;

    // Estado inicial (oculto)
    this.r.addClass(node, 'reveal-init');

    this.io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || this.revealed) return;

        this.revealed = true;

        // Delay opcional por item
        if (this.revealDelayMs > 0) {
          setTimeout(() => this.r.addClass(node, 'reveal-in'), this.revealDelayMs);
        } else {
          this.r.addClass(node, 'reveal-in');
        }

        // Deja de observar (reveal una vez)
        this.io?.disconnect();
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -10% 0px', // entra un poquito antes
      }
    );

    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
