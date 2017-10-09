import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoresComponent } from './add-store.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
