import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductosCrearComponent } from './admin-productos-crear.component';

describe('AdminProductosCrearComponent', () => {
  let component: AdminProductosCrearComponent;
  let fixture: ComponentFixture<AdminProductosCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProductosCrearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductosCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
