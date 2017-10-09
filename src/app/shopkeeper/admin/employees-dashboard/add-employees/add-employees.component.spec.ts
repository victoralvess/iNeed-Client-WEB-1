import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeesComponent } from './add-employees.component';

describe('AddEmployeesComponent', () => {
  let component: AddEmployeesComponent;
  let fixture: ComponentFixture<AddEmployeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEmployeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
