import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[deferOnScroll]',
  standalone: true
})
export class DeferOnScrollDirective implements AfterViewInit, OnDestroy {

  @Input() deferMargin = '200px';

  private io?: IntersectionObserver;
  private rendered = false;

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef) {}

  ngAfterViewInit(): void {
    const anchor = document.createElement('div');
    anchor.style.height = '1px';
    this.vcr.element.nativeElement.parentElement?.insertBefore(anchor, this.vcr.element.nativeElement);

    this.io = new IntersectionObserver(
      (entries) => {
        if (this.rendered) return;
        if (!entries[0]?.isIntersecting) return;

        this.rendered = true;
        this.vcr.createEmbeddedView(this.tpl);
        this.io?.disconnect();
      },
      { rootMargin: this.deferMargin, threshold: 0.01 }
    );

    this.io.observe(anchor);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

}
