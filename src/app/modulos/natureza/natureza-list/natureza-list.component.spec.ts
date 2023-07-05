import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturezaListComponent } from './natureza-list.component';

describe('NaturezaListComponent', () => {
  let component: NaturezaListComponent;
  let fixture: ComponentFixture<NaturezaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NaturezaListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NaturezaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
