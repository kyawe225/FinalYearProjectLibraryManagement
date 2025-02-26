import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../../model/book';
import { BookDetailComponent } from "../book-detail/book-detail.component";
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-book-search',
  imports: [NgbAccordionModule, BookCardSearchComponent],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss'
})
export class BookSearchComponent {
  hasData = false;
  isClosedAdvancedSearch = true;
  books: Book[] | null = null;
  private service : BookService| null = null;

  constructor(service : BookService){
    this.service = service;
  }

  openAdvancedSearch() {
    this.isClosedAdvancedSearch = false;
  }

  closeAdvancedSearch() {
    this.isClosedAdvancedSearch = true;
  }

  getListBooks(){
    console.error(this.service);
    this.service?.getAll().subscribe({
      next: (data: any)=>{
        console.log("something")
      this.books = data.data;
      this.books = [{
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
      {
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
      {
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
  
      ]
    },
    error :(data: any)=>{
      console.log("this file")
      console.log(data);
    }
  })
  }

  searchBooks() {
    this.getListBooks();

    this.isClosedAdvancedSearch = true;
    this.books = [{
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
    {
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
    {
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

    ]

    // TODO: Implement search books and loading data
  }
}
