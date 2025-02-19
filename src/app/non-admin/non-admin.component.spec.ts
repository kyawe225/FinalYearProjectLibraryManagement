import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonAdminComponent } from './non-admin.component';

describe('NonAdminComponent', () => {
  let component: NonAdminComponent;
  let fixture: ComponentFixture<NonAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
