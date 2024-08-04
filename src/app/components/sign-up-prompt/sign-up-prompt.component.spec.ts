import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpPromptComponent } from './sign-up-prompt.component';

describe('SignUpPromptComponent', () => {
  let component: SignUpPromptComponent;
  let fixture: ComponentFixture<SignUpPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
