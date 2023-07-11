import { TestBed } from '@angular/core/testing';

import { AvisosDialogService } from './avisos-dialog.service';

describe('AvisosDialogService', () => {
  let service: AvisosDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvisosDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
