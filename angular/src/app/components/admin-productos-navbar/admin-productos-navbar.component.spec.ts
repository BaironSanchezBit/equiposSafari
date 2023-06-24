import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductosNavbarComponent } from './admin-productos-navbar.component';

describe('AdminProductosNavbarComponent', () => {
  let component: AdminProductosNavbarComponent;
  let fixture: ComponentFixture<AdminProductosNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProductosNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProductosNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
