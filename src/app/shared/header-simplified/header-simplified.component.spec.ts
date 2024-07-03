import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSimplifiedComponent } from './header-simplified.component';

describe('HeaderSimplifiedComponent', () => {
  let component: HeaderSimplifiedComponent;
  let fixture: ComponentFixture<HeaderSimplifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSimplifiedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderSimplifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
