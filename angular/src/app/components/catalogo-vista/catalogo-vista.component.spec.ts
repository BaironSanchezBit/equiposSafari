import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoVistaComponent } from './catalogo-vista.component';

describe('CatalogoVistaComponent', () => {
  let component: CatalogoVistaComponent;
  let fixture: ComponentFixture<CatalogoVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogoVistaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
