import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoresComponent } from './add-stores.component';

describe('AddStoresComponent', () => {
  let component: AddStoresComponent;
  let fixture: ComponentFixture<AddStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

<<<<<<< HEAD
  it('should be created', () => {
=======
  it('should create', () => {
>>>>>>> stores-module
    expect(component).toBeTruthy();
  });
});
