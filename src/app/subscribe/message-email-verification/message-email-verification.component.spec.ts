import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEmailVerificationComponent } from './message-email-verification.component';

describe('MessageEmailVerificationComponent', () => {
  let component: MessageEmailVerificationComponent;
  let fixture: ComponentFixture<MessageEmailVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageEmailVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageEmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
