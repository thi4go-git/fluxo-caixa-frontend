import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturezaFormComponent } from './natureza-form.component';

describe('NaturezaFormComponent', () => {
  let component: NaturezaFormComponent;
  let fixture: ComponentFixture<NaturezaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaturezaFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturezaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
