import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { interval, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-wedding-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wedding-landing.component.html',
  styleUrl: './wedding-landing.component.scss'
})
export class WeddingLandingComponent implements OnInit, OnDestroy {
  // --- Configura aquí tu fecha objetivo ---
  // Ejemplo: 20 de diciembre de 2025, 3:00 PM (GMT-5)
  targetDate = new Date('2026-02-28T15:00:00-05:00');

  showSeconds = true;
  label = 'Nuestra boda';
  subtitle = 'Cuenta regresiva en tiempo real';

  private sub?: Subscription;
  private destroyRef = inject(DestroyRef);

  boxes: Array<{ label: string; value: string }> = [
    { label: 'DÍAS',  value: '00' },
    { label: 'HORAS', value: '00' },
    { label: 'MIN',   value: '00' },
    // 'SEG' se agrega en ngOnInit si showSeconds = true
  ];

  get ariaLabel(): string {
    const [d, h, m] = this.boxes.map(b => b.value);
    return `${d} días, ${h} horas, ${m} minutos restantes`;
  }

  ngOnInit(): void {
    if (this.showSeconds) {
      this.boxes = [
        { label: 'DÍAS',  value: '00' },
        { label: 'HORAS', value: '00' },
        { label: 'MIN',   value: '00' },
        { label: 'SEG',   value: '00' },
      ];
    }

    // Tiquea de inmediato y luego cada 1s
    this.sub = interval(1000).pipe(startWith(0)).subscribe(() => {
      const now = Date.now();
      const diff = Math.max(0, this.targetDate.getTime() - now);

      const parts = msToParts(diff);
      const values = [
        pad(parts.days),
        pad(parts.hours),
        pad(parts.minutes),
      ];
      if (this.showSeconds) values.push(pad(parts.seconds));

      this.boxes = this.boxes.map((b, i) => ({ ...b, value: values[i] ?? b.value }));

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
function pad(n: number): string { return String(n).padStart(2, '0'); }

function msToParts(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  return { days, hours, minutes, seconds };
}
