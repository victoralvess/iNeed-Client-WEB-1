import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteStoresComponent } from './delete-stores.component';

describe('DeleteStoresComponent', () => {
  let component: DeleteStoresComponent;
  let fixture: ComponentFixture<DeleteStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
