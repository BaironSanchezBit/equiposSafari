import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarTopComponent } from './admin-navbar-top.component';

describe('AdminNavbarTopComponent', () => {
  let component: AdminNavbarTopComponent;
  let fixture: ComponentFixture<AdminNavbarTopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNavbarTopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNavbarTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
