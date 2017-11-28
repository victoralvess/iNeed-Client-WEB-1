import { TestBed, inject } from '@angular/core/testing';

import { IsLoggedAuthGuard } from './is-logged-auth.guard';

describe('IsLoggedAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsLoggedAuthGuard]
    });
  });

  it('should ...', inject([IsLoggedAuthGuard], (guard: IsLoggedAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
