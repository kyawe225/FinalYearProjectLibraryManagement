import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardSearchComponent } from './book-card-search.component';

describe('BookCardSearchComponent', () => {
  let component: BookCardSearchComponent;
  let fixture: ComponentFixture<BookCardSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookCardSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
