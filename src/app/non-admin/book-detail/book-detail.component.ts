import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Book } from '../../model/book';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { WishService } from '../../service/wishbook.service';
import { WishBookCreateViewModel } from '../../model/wish-book';
import { ResponseModel } from '../../model/response-model';
import {author} from '../../model/author';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Review } from '../../model/book-review';
import { catchError, of } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import {
  MatDialog,
} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import { Publisher } from '../../model/publisher';
import { book_category } from '../../model/book_category';
import { MatButtonModule } from '@angular/material/button';
import { ReservationService } from '../../service/reservation.service';
import { LoanService } from '../../service/loan.service';
import { WishlistService } from '../../service/wishlist-service.service';
import { Reservation } from '../../model/reservation';

@Component({
  selector: 'app-book-detail',
  imports: [
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule
  ],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  bookId: string | null = null;
  loading = true;
  error = false;
  errorMessage = '';
  isLoggedIn = false; // This would normally be from AuthService
  userReviewed = false;
  userHasActiveReservation = false;
  userHasActiveLoan = false;
  userHasInWishlist = false;
  reviews: Review[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private reservationService: ReservationService,
    private loanService: LoanService,
    private wishlistService: WishlistService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Typically, you would get the auth status from your AuthService
    // this.isLoggedIn = this.authService.isAuthenticated();
    this.isLoggedIn = localStorage.getItem('user') !== null; // Simple check for demo
    
    this.route.paramMap.subscribe(params => {
      this.bookId = params.get('id');
      if (this.bookId) {
        this.loadBookDetails(this.bookId);
      } else {
        this.error = true;
        this.errorMessage = 'No book ID provided';
        this.loading = false;
      }
    });
  }

  loadBookDetails(bookId: string): void {
    this.bookService.getDetail(bookId).pipe(
      catchError((error: HttpErrorResponse) => {
        const programmingCategory: book_category = {
          id: 'CAT-001',
          name: 'Programming',
          description: 'Books about programming languages and software development'
        };
        const publisher1: Publisher = {
          id: 'PUB-001',
          name: 'Addison-Wesley Professional',
          address: '1234 Publisher Lane, Boston, MA',
          phone_number: '555-123-4567',
          email: 'info@addisonwesley.com',
          description: 'A leading publisher of computer science and engineering books.',
          createdDate: new Date('2025-01-01'),
          updatedDate: new Date('2025-01-01'),
        };
        const author1: author = {
          author_id: 'AUTH-001',
          first_name: 'Robert',
          last_name: 'Martin',
          biography: 'Robert Cecil Martin is an American software engineer, instructor, and author.',
          date_of_birth: new Date('1952-12-05')
        };

        this.book = {
          book_id: 'BOOK-002',
          title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
          isbn: '9780201633610',
          publication_date: new Date('1994-11-10'),
          publisher_id: 'PUB-001',
          category_id: 'CAT-001',
          total_copies: 3,
          available_copies: 1,
          location_in_library: 'Section A, Shelf 4',
          added_date: new Date('2024-02-10'),
          status: 'Available',
          edition: 'First Edition',
          description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
          authors: [author1],
          author_names: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
          publisher: publisher1,
          category: programmingCategory
        };
        this.error = false;
        // this.errorMessage = `Error loading book details: ${error.message}`;
        // this.loading = false;
        return of({'data':this.book});
      })
    ).subscribe(book => {
      if (book) {
        this.book = book.data;
        
        // this.loadReviews(bookId);
        
        if (this.isLoggedIn) {
          this.checkUserInteractions(bookId);
        }
      }
      this.loading = false;
    });
  }

  // loadReviews(bookId: string): void {
  //   this.bookService.getBookReviews(bookId).pipe(
  //     catchError(() => of([]))
  //   ).subscribe(reviews => {
  //     this.reviews = reviews;
  //     if (this.isLoggedIn) {
  //       const userId = this.getUserId();
  //       this.userReviewed = this.reviews.some(review => review.memberId === userId);
  //     }
  //   });
  // }

  checkUserInteractions(bookId: string): void {
    const userId = this.getUserId();
    
    this.reservationService.checkUserReservation(userId, bookId).pipe(
      catchError(() => of(false))
    ).subscribe(hasReservation => {
      this.userHasActiveReservation = hasReservation;
    });

    this.loanService.checkUserLoan(userId, bookId).pipe(
      catchError(() => of({data : false, status: "OK", message : ""}))
    ).subscribe(hasLoan => {
      this.userHasActiveLoan = hasLoan.data;
    });

    this.wishlistService.checkInWishlist(userId, bookId).pipe(
      catchError(() => of({data : false, status: "OK", message : ""}))
    ).subscribe(inWishlist => {
      this.userHasInWishlist = inWishlist.data;
    });
  }

  getUserId(): string {
    // In a real implementation, you would get this from your auth service
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : '';
  }

  reserveBook(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/books/${this.bookId}` } 
      });
      return;
    }

    if (!this.book || !this.bookId) return;
    let reservation : Reservation = {
      bookId : this.bookId,
      userId: this.getUserId(),

      Status : "Pending",
      AppointDate : new Date(),
    };
    this.reservationService.createReservation(reservation).pipe(
      catchError((error) => {
        this.snackBar.open(
          `Failed to reserve book: ${error.message}`, 
          'Close', 
          { duration: 5000 }
        );
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.userHasActiveReservation = true;
        this.snackBar.open(
          'Book reserved successfully! You will be notified when it\'s available.', 
          'Close', 
          { duration: 5000 }
        );
      }
    });
  }

  addToWishlist(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/books/${this.bookId}` } 
      });
      return;
    }

    if (!this.book || !this.bookId) return;
    
    // this.wishlistService.addToWishlist(this.getUserId(), this.bookId).pipe(
    //   catchError((error) => {
    //     this.snackBar.open(
    //       `Failed to add to wishlist: ${error.message}`, 
    //       'Close', 
    //       { duration: 5000 }
    //     );
    //     return of(null);
    //   })
    // ).subscribe(result => {
    //   if (result) {
    //     this.userHasInWishlist = true;
    //     this.snackBar.open(
    //       'Book added to your wishlist!', 
    //       'Close', 
    //       { duration: 5000 }
    //     );
    //   }
    // });
  }

  removeFromWishlist(): void {
    if (!this.book || !this.bookId) return;
    
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Remove from Wishlist',
    //     message: 'Are you sure you want to remove this book from your wishlist?'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.wishlistService.removeFromWishlist(this.getUserId(), this.bookId!).pipe(
    //       catchError((error) => {
    //         this.snackBar.open(
    //           `Failed to remove from wishlist: ${error.message}`, 
    //           'Close', 
    //           { duration: 5000 }
    //         );
    //         return of(null);
    //       })
    //     ).subscribe(success => {
    //       if (success) {
    //         this.userHasInWishlist = false;
    //         this.snackBar.open(
    //           'Book removed from your wishlist', 
    //           'Close', 
    //           { duration: 5000 }
    //         );
    //       }
    //     });
    //   }
    // });
  }

  cancelReservation(): void {
    if (!this.book || !this.bookId) return;
    
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Cancel Reservation',
    //     message: 'Are you sure you want to cancel your reservation for this book?'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.reservationService.cancelReservation(this.getUserId(), this.bookId!).pipe(
    //       catchError((error) => {
    //         this.snackBar.open(
    //           `Failed to cancel reservation: ${error.message}`, 
    //           'Close', 
    //           { duration: 5000 }
    //         );
    //         return of(null);
    //       })
    //     ).subscribe(success => {
    //       if (success) {
    //         this.userHasActiveReservation = false;
    //         this.snackBar.open(
    //           'Reservation cancelled successfully', 
    //           'Close', 
    //           { duration: 5000 }
    //         );
    //       }
    //     });
    //   }
    // });
  }

  openReviewDialog(): void {
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: `/books/${this.bookId}` } 
      });
      return;
    }

    if (!this.book || !this.bookId) return;
    
    // const dialogRef = this.dialog.open(ReviewDialogComponent, {
    //   width: '500px',
    //   data: {
    //     bookId: this.bookId,
    //     bookTitle: this.book.title,
    //     existingReview: this.reviews.find(r => r.memberId === this.getUserId())
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadReviews(this.bookId!);
    //   }
    // });
  }

  getAuthorNames(): string {
    if (!this.book || !this.book.authors || this.book.authors.length === 0) {
      return 'Unknown Author';
    }
    return this.book.authors.map(author => 
      `${author.first_name} ${author.last_name}`
    ).join(', ');
  }

  // Calculate average rating from reviews
  getAverageRating(): number {
    if (!this.reviews || this.reviews.length === 0) {
      return 0;
    }
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  // Helper method to generate an array for star ratings
  getStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  // Helper method to determine if a half star should be shown
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
}
