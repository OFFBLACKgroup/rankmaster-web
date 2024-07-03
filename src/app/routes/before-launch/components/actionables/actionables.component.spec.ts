import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionablesComponent } from './actionables.component';

describe('ActionablesComponent', () => {
  let component: ActionablesComponent;
  let fixture: ComponentFixture<ActionablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
