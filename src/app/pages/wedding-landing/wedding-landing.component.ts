import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  DestroyRef,
  HostListener,
  Renderer2,
  signal,
  effect,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';
import { interval, startWith, Subscription } from 'rxjs';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { GaleryService } from '../../core/services/galery.service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { ImageBlurComponent } from '../../shared/components/image-blur/image-blur.component';
import { Galery } from '../../core/modules/galery.interface';
import { SpliterComponent } from '../../shared/components/spliter/spliter.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CuposService } from '../../core/services/cupos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wedding-landing',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    SafeUrlPipe,
    ImageBlurComponent,
    SpliterComponent,
  ],
  templateUrl: './wedding-landing.component.html',
  styleUrl: './wedding-landing.component.scss',
})
export class WeddingLandingComponent implements OnInit, OnDestroy {
  // --- Configura aquí tu fecha objetivo ---
  // Ejemplo: 20 de diciembre de 2025, 3:00 PM (GMT-5)
  targetDate = new Date('2026-02-28T15:00:00-05:00');

  showSeconds = true;
  subtitle = 'Cuenta regresiva en tiempo real';

  private sub?: Subscription;
  private destroyRef = inject(DestroyRef);
  private galeryService = inject(GaleryService);
  private cuposService = inject(CuposService);
  private route = inject(ActivatedRoute);

  boxes: Array<{ label: string; value: string }> = [
    { label: 'DÍAS', value: '00' },
    { label: 'HORAS', value: '00' },
    { label: 'MIN', value: '00' },
    // 'SEG' se agrega en ngOnInit si showSeconds = true
  ];

  get ariaLabel(): string {
    const [d, h, m] = this.boxes.map((b) => b.value);
    return `${d} días, ${h} horas, ${m} minutos restantes`;
  }

  // # Cupos ___________________________________________
  cupos = signal<number>(0);
  isCuposValid = signal<boolean>(false);

  /* VISOR */
  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  private stopVideo() {
    const v = this.videoEl?.nativeElement;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  // Navegación por teclado
  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (!this.viewerOpen()) return;
    if (e.key === 'Escape') this.closeViewer();
    if (e.key === 'ArrowRight') this.next();
    if (e.key === 'ArrowLeft') this.prev();
  }

  // Reemplaza con tus imágenes (pueden ser assets locales)
  images = [
    { src: 'images/galery/image-14.png', alt: 'Foto 1' },
    { src: 'images/galery/image-15.png', alt: 'Foto 2' },
    { src: 'images/galery/image-16.png', alt: 'Foto 3' },
    { src: 'images/galery/image-17.png', alt: 'Foto 4' },
    // ...
  ];

  viewerOpen = signal(false);
  activeIndex = signal(0);
  imageLoaded = false;

  // reemplaza imageLoaded por algo genérico:
  mediaLoaded = signal(false);
  isTransitioning = signal(false);
  buffering = signal(false);

  // Soporte para swipe
  private touchStartX = 0;
  private touchDeltaX = 0;
  private swipeThreshold = 40; // px

  // galery ______________________
  galery = signal<Galery[]>([]);

  activeItem = computed(() => this.galery()[this.activeIndex()] ?? null);

  /** Detecta si una URL es video por extensión (mp4, webm, mov...) */
  private isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    const clean = url.split('?')[0].toLowerCase();
    return ['.mp4', '.webm', '.mov', '.m4v'].some((ext) => clean.endsWith(ext));
  }

  activeType = computed<'image' | 'video' | 'unknown'>(() => {
    const item = this.activeItem();
    if (!item) return 'unknown';

    // 1) Si el backend manda bien el type, úsalo
    if (item.type === 'image' || item.type === 'video') return item.type;

    // 2) Fallback por URL (tu caso real)
    if (this.isVideoUrl(item.mediaUrl) || this.isVideoUrl(item.thumbUrl))
      return 'video';

    // 3) Si no es video, asumimos imagen
    return 'image';
  });

  /** Para videos: elige la URL correcta (a veces viene en thumbUrl) */
  activeVideoSrc(): string {
    const item = this.activeItem();
    if (!item) return '';
    // Si mediaUrl es video, usa mediaUrl; si no, intenta thumbUrl
    if (this.isVideoUrl(item.mediaUrl)) return item.mediaUrl;
    if (this.isVideoUrl(item.thumbUrl)) return item.thumbUrl;
    // fallback (por si el backend luego arregla el mapping)
    return item.mediaUrl;
  }

  private stopActiveVideo() {
    const v = this.videoEl?.nativeElement;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  }

  /* VISOR FUNTION */

  openViewer(index: number) {
    this.activeIndex.set(index);
    this.viewerOpen.set(true);

    this.mediaLoaded.set(false);
    this.isTransitioning.set(false);
    this.buffering.set(false);
    // Bloquear scroll del body mientras el visor está abierto
    document.documentElement.classList.add('overflow-hidden');
  }

  closeViewer() {
    this.viewerOpen.set(false);
    document.documentElement.classList.remove('overflow-hidden');
  }

  next() {
    if (!this.galery().length || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.mediaLoaded.set(false);
    this.buffering.set(false);

    this.activeIndex.update((i) => (i + 1) % this.galery().length);
  }

  prev() {
    if (!this.galery().length || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.mediaLoaded.set(false);
    this.buffering.set(false);

    this.activeIndex.update(
      (i) => (i - 1 + this.galery().length) % this.galery().length
    );
  }

  onImageLoad() {
    this.imageLoaded = true;
    this.isTransitioning.set(false);
  }

  /** Unifica load para img y video */
  onMediaLoad() {
    this.mediaLoaded.set(true);
    this.isTransitioning.set(false);
  }

  onBuffering(state: boolean) {
    this.buffering.set(state);
  }

  // Gestos touch
  onTouchStart(ev: TouchEvent) {
    this.touchStartX = ev.changedTouches[0].clientX;
    this.touchDeltaX = 0;
  }
  onTouchMove(ev: TouchEvent) {
    this.touchDeltaX = ev.changedTouches[0].clientX - this.touchStartX;
  }
  onTouchEnd() {
    if (Math.abs(this.touchDeltaX) > this.swipeThreshold) {
      if (this.touchDeltaX < 0) this.next();
      else this.prev();
    }
    this.touchStartX = 0;
    this.touchDeltaX = 0;
  }

  /* Iframe de codigo de ropa ________________________*/
  loadingIframe = signal<boolean>(true);
  iframeUrl =
    'https://petracoding.github.io/pinterest/board.html?link=urhottestbae/c%C3%B3digo-de-vestimenta-boda/?invite_code=4a7fa2650e5e45b9b70e2b34c09e699c&sender=763078868021064802&hideHeader=0&hideFooter=0&transparent=0';

  onIframeLoad() {
    this.loadingIframe.set(false);
  }

  // Mapa ________________________
  placeName = 'Centro Recreacional Solinilla - Combarranquilla';
  address = 'Km 1.5 Vía Salgar - Sabanilla, Salgar, Atlántico, Colombia';

  private embedUrl =
    'https://maps.google.com/maps?q=11.02826,-74.91977&z=16&output=embed';

  mapUrl: SafeResourceUrl = '';
  isMapModalOpen = false;
  isMapIframeVisible = false;

  googleMapsLink =
    'https://www.google.com/maps/search/?api=1&query=11.02826,-74.91977';

  wazeLink = 'https://waze.com/ul?ll=11.02826,-74.91977&navigate=yes';

  openMapModal() {
    this.isMapModalOpen = true;

    setTimeout(() => {
      this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.embedUrl
      );
      this.isMapIframeVisible = true;
    }, 150);
  }

  closeMapModal() {
    this.isMapModalOpen = false;
    this.isMapIframeVisible = false;
  }

  constructor(private renderer: Renderer2, private sanitizer: DomSanitizer) {
    effect((onCleanup) => {
      if (!this.viewerOpen()) return;

      // Esto fuerza la dependencia reactiva:
      const type = this.activeType();
      this.activeIndex(); // (por si acaso)

      // Cuando cambie el item, antes del siguiente render:
      this.stopVideo();

      // Si quieres, también en cleanup:
      onCleanup(() => this.stopVideo());
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('params: ', params);

      const uuid = params['id'];

      if (!uuid) return;

      const cupos = this.cuposService.getCuposByUUID(uuid);
      console.log('cupos: ', cupos);

      if (cupos !== null) {
        this.cupos.set(cupos);
        this.isCuposValid.set(true);
      }
    });

    // Ocultamos el scroll del body temporalmente
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    // Luego de 1 segundo, lo restauramos
    setTimeout(() => {
      this.renderer.removeStyle(document.body, 'overflow');
    }, 5000);

    //por si no carga el frame
    setTimeout(() => {
      if (this.loadingIframe()) {
        this.loadingIframe.set(false);
        // aquí podrías setear un flag de error y mostrar un mensaje
      }
    }, 15000);

    this.galeryService.getGalery().subscribe({
      next: (value) => {
        this.galery.set(value.items);
      },
    });

    if (this.showSeconds) {
      this.boxes = [
        { label: 'DÍAS', value: '00' },
        { label: 'HORAS', value: '00' },
        { label: 'MIN', value: '00' },
        { label: 'SEG', value: '00' },
      ];
    }

    // Tiquea de inmediato y luego cada 1s
    this.sub = interval(1000)
      .pipe(startWith(0))
      .subscribe(() => {
        const now = Date.now();
        const diff = Math.max(0, this.targetDate.getTime() - now);

        const parts = msToParts(diff);
        const values = [pad(parts.days), pad(parts.hours), pad(parts.minutes)];
        if (this.showSeconds) values.push(pad(parts.seconds));

        this.boxes = this.boxes.map((b, i) => ({
          ...b,
          value: values[i] ?? b.value,
        }));

        if (diff === 0) {
          this.sub?.unsubscribe();
          queueMicrotask(() => {
            // Aquí puedes disparar un toast, animación o navegar
            // console.log('¡Llegó el gran día!');
          });
        }
      });

    // Limpieza extra en destrucción inesperada
    this.destroyRef.onDestroy(() => this.sub?.unsubscribe());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}

// ------- Helpers -------
function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function msToParts(ms: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  return { days, hours, minutes, seconds };
}
