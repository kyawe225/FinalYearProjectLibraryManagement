import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatefeeManagementComponent } from './latefee-management.component';

describe('LatefeeManagementComponent', () => {
  let component: LatefeeManagementComponent;
  let fixture: ComponentFixture<LatefeeManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatefeeManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatefeeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
