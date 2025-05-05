import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookreviewManagementComponent } from './bookreview-management.component';

describe('BookreviewManagementComponent', () => {
  let component: BookreviewManagementComponent;
  let fixture: ComponentFixture<BookreviewManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookreviewManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookreviewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
