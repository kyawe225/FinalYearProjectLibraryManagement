import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookloanManagementComponent } from './bookloan-management.component';

describe('BookloanManagementComponent', () => {
  let component: BookloanManagementComponent;
  let fixture: ComponentFixture<BookloanManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookloanManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookloanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
