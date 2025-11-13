import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBlurComponent } from './image-blur.component';

describe('ImageBlurComponent', () => {
  let component: ImageBlurComponent;
  let fixture: ComponentFixture<ImageBlurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageBlurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageBlurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
