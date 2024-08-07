import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameSelectComponent } from './username-select.component';

describe('UsernameSelectComponent', () => {
  let component: UsernameSelectComponent;
  let fixture: ComponentFixture<UsernameSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
