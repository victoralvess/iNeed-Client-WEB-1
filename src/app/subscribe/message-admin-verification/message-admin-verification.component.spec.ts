import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageAdminVerificationComponent } from './message-admin-verification.component';

describe('MessageAdminVerificationComponent', () => {
  let component: MessageAdminVerificationComponent;
  let fixture: ComponentFixture<MessageAdminVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageAdminVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageAdminVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
