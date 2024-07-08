import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTierlistComponent } from './play-tierlist.component';

describe('PlayTierlistComponent', () => {
  let component: PlayTierlistComponent;
  let fixture: ComponentFixture<PlayTierlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayTierlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTierlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
