import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdPageComponent } from './admin-prod-page.component';

describe('AdminProdPageComponent', () => {
  let component: AdminProdPageComponent;
  let fixture: ComponentFixture<AdminProdPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProdPageComponent]
    });
    fixture = TestBed.createComponent(AdminProdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
