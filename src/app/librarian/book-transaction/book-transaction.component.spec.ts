import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTransactionComponent } from './book-transaction.component';

describe('BookTransactionComponent', () => {
  let component: BookTransactionComponent;
  let fixture: ComponentFixture<BookTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
