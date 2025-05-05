import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../../model/book';
import { BookDetailComponent } from "../book-detail/book-detail.component";
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { BookService } from '../../service/book.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-book-search',
  imports: [NgbAccordionModule,CommonModule,RouterModule,  ReactiveFormsModule, MatIconModule, MatButtonModule, MatInputModule, MatSelectModule,MatProgressSpinnerModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss'
})
export class BookSearchComponent {
  books: Book[] = [];
  filteredBooks: any[] = [];
  categories: any[] = [];
  loading = false;
  error = '';

  searchForm = new FormGroup({
    query: new FormControl(''),
    category: new FormControl(''),
    sortBy: new FormControl('title')
  });

  isLoggedIn = false;
  userWishlist: string[] = []; // IDs of books in user's wishlist

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;

    // Check if user is logged in
    this.isLoggedIn = this.authService.isAuthenticated.getValue();

    // Load categories
    this.bookService.getCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      },
      error: (err) => {
        this.error = 'Failed to load categories';
        console.error(err);
      }
    });

    // Load books
    this.bookService.getAll().subscribe({
      next: (books: any) => {
        this.books = books;
        this.filteredBooks = [...books];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books';
        this.loading = false;
        console.error(err);
      }
    });

    // If user is logged in, load their wishlist
    if (this.isLoggedIn) {
      this.bookService.getUserWishlist().subscribe({
        next: (wishlist: any) => {
          // this.userWishlist = wishlist.map(item => item.book_id);
        },
        error: (err) => {
          console.error('Failed to load wishlist', err);
        }
      });
    }

    // Setup search with debounce
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters(): void {
    const query = this.searchForm.get('query')?.value?.toLowerCase() || '';
    const category = this.searchForm.get('category')?.value || '';
    const sortBy = this.searchForm.get('sortBy')?.value || 'title';

    // Filter by search query and category
    this.filteredBooks = this.books.filter(book => {
      const matchesQuery = !query ||
        book.title.toLowerCase().includes(query) ||
        (book.authors && book.authors.some(author =>
          `${author.first_name} ${author.last_name}`.toLowerCase().includes(query)
        ));

      const matchesCategory = !category || book.category_id === category;

      return matchesQuery && matchesCategory;
    });

    // Sort books
    this.filteredBooks.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'publication_date') {
        return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
      } else if (sortBy === 'added_date') {
        return new Date(b.added_date).getTime() - new Date(a.added_date).getTime();
      }
      return 0;
    });
  }

  viewBookDetails(bookId: string): void {
    this.router.navigate(['/books', bookId]);
  }

  addToWishlist(bookId: string, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/books' } });
      return;
    }

    this.bookService.addToWishlist(bookId).subscribe({
      next: () => {
        this.userWishlist.push(bookId);
      },
      error: (err) => {
        console.error('Failed to add to wishlist', err);
      }
    });
  }

  removeFromWishlist(bookId: string, event: Event): void {
    event.stopPropagation();
    this.bookService.removeFromWishlist(bookId).subscribe({
      next: () => {
        this.userWishlist = this.userWishlist.filter(id => id !== bookId);
      },
      error: (err) => {
        console.error('Failed to remove from wishlist', err);
      }
    });
  }

  makeReservation(bookId: string, event: Event): void {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/books' } });
      return;
    }

    // this.bookService.makeReservation(bookId).subscribe({
    //   next: () => {
    //     // Update book status in the list
    //     const bookIndex = this.filteredBooks.findIndex(b => b.book_id === bookId);
    //     if (bookIndex !== -1) {
    //       this.filteredBooks[bookIndex].status = 'Reserved';
    //     }
    //   },
    //   error: (err) => {
    //     console.error('Failed to make reservation', err);
    //   }
    // });
  }

  isInWishlist(bookId: string): boolean {
    return this.userWishlist.includes(bookId);
  }

  resetFilters(): void {
    this.searchForm.reset({
      query: '',
      category: '',
      sortBy: 'title'
    });
    this.filteredBooks = [...this.books];
  }
}
