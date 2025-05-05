import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishManagementComponent } from './wish-management.component';

describe('WishManagementComponent', () => {
  let component: WishManagementComponent;
  let fixture: ComponentFixture<WishManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
