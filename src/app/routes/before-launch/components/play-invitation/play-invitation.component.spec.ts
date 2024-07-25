import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayInvitationComponent } from './play-invitation.component';

describe('PlayInvitationComponent', () => {
  let component: PlayInvitationComponent;
  let fixture: ComponentFixture<PlayInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayInvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
