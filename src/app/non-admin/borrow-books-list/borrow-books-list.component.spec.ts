import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowBooksListComponent } from './borrow-books-list.component';

describe('BorrowBooksListComponent', () => {
  let component: BorrowBooksListComponent;
  let fixture: ComponentFixture<BorrowBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowBooksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
