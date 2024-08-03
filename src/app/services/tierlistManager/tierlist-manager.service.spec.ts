import { TestBed } from '@angular/core/testing';

import { TierlistManagerService } from './tierlist-manager.service';

describe('TierlistManagerService', () => {
  let service: TierlistManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TierlistManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
