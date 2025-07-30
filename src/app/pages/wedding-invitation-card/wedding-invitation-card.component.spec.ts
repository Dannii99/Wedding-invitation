import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingInvitationCardComponent } from './wedding-invitation-card.component';

describe('WeddingInvitationCardComponent', () => {
  let component: WeddingInvitationCardComponent;
  let fixture: ComponentFixture<WeddingInvitationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingInvitationCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingInvitationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
