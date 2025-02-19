import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishBooksComponent } from './wish-books.component';

describe('WishBooksComponent', () => {
  let component: WishBooksComponent;
  let fixture: ComponentFixture<WishBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
