import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeforeLaunchComponent } from './before-launch.component';

describe('BeforeLaunchComponent', () => {
  let component: BeforeLaunchComponent;
  let fixture: ComponentFixture<BeforeLaunchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeforeLaunchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BeforeLaunchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
