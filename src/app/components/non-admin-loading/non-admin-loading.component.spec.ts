import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonAdminLoadingComponent } from './non-admin-loading.component';

describe('NonAdminLoadingComponent', () => {
  let component: NonAdminLoadingComponent;
  let fixture: ComponentFixture<NonAdminLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonAdminLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonAdminLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
