import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingLandingComponent } from './wedding-landing.component';

describe('WeddingLandingComponent', () => {
  let component: WeddingLandingComponent;
  let fixture: ComponentFixture<WeddingLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
