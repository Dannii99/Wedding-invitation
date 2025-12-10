import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpliterComponent } from './spliter.component';

describe('SpliterComponent', () => {
  let component: SpliterComponent;
  let fixture: ComponentFixture<SpliterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpliterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpliterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
