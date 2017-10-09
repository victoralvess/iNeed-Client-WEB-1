import { TestBed, async, inject } from '@angular/core/testing';

import { MustBeLoggedInGuard } from './must-be-logged-in.guard';

describe('MustBeLoggedInGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MustBeLoggedInGuard]
    });
  });

  it('should ...', inject([MustBeLoggedInGuard], (guard: MustBeLoggedInGuard) => {
    expect(guard).toBeTruthy();
  }));
});
