import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LancamentoEditComponent } from './lancamento-edit.component';

describe('LancamentoEditComponent', () => {
  let component: LancamentoEditComponent;
  let fixture: ComponentFixture<LancamentoEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LancamentoEditComponent]
    });
    fixture = TestBed.createComponent(LancamentoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
