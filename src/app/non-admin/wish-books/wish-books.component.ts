import { Component, OnInit, signal } from '@angular/core';
import { WishBook } from '../../model/wish-book';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { WishbookService } from '../../service/wishbook.service';

@Component({
  selector: 'app-wish-books',
  imports: [
    BookCardSearchComponent
  ],
  templateUrl: './wish-books.component.html',
  styleUrl: './wish-books.component.scss'
})
export class WishBooksComponent implements OnInit {
  wishBooks = signal<WishBook[] | null>(null);

  constructor( private service : WishbookService){

  }

  ngOnInit(): void {
    this.service.getAll().subscribe((data: any) => {
      this.wishBooks.set(data.data);

      this.wishBooks.set([
        {
          id: "1",
          bookId: "1",
          userId: "1",
          book: {
            title: "Sample Book Title",
            authors: "Author Name",
            isbn: "123-4567890123",
            publisher: "Sample Publisher",
            publicationYear: 2025,
            genre: "Fiction",
            language: "English",
            pageCount: 350,
            coverImage: "https://example.com/cover.jpg",
            description: "This is a sample description of the book.",
            status: "Available",
            category: "Novel",
            edition: "1st Edition",
            format: "Hardcover",
            dateAdded: new Date("2025-01-06T00:00:00Z"),
            createdAt: new Date("2025-01-06T00:00:00Z"),
            updatedAt: new Date("2025-01-06T00:00:00Z"),
            id: "unique-book-id-12345"
          },
          createdAt: new Date("2025-01-06T00:00:00Z"),
          updatedAt: new Date("2025-01-06T00:00:00Z")
        }
      ]);
    });
  }

  
}
