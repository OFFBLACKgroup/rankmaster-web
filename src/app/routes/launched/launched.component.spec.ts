import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchedComponent } from './launched.component';

describe('LaunchedComponent', () => {
  let component: LaunchedComponent;
  let fixture: ComponentFixture<LaunchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
