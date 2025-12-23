import { TestBed } from '@angular/core/testing';

import { CuposService } from './cupos.service';

describe('CuposService', () => {
  let service: CuposService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuposService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
