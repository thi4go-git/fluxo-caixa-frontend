import { TestBed } from '@angular/core/testing';

import { LancamentoService } from './lancamento.service';

describe('LancamentoService', () => {
  let service: LancamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LancamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
