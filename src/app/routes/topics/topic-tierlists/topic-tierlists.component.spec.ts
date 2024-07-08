import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTierlistsComponent } from './topic-tierlists.component';

describe('TopicTierlistsComponent', () => {
  let component: TopicTierlistsComponent;
  let fixture: ComponentFixture<TopicTierlistsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicTierlistsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicTierlistsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
