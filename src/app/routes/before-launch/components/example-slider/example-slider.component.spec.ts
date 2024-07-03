import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSliderComponent } from './example-slider.component';

describe('ExampleSliderComponent', () => {
  let component: ExampleSliderComponent;
  let fixture: ComponentFixture<ExampleSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
