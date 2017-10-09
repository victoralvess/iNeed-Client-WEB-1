import { TestBed, async, inject } from '@angular/core/testing';

import { MustBeAdminGuard } from './must-be-admin.guard';

describe('MustBeAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MustBeAdminGuard]
    });
  });

  it('should ...', inject([MustBeAdminGuard], (guard: MustBeAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
