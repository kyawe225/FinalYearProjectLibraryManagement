import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BorrowService } from '../../borrow.service';
import { CommonModule, DatePipe } from '@angular/common';
import { WishlistService } from '../../service/wishlist-service.service';
import { WishBook } from '../../model/wish-book';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { WishNoteDialogComponent, WishNoteDialogData } from '../wish-note-dialog/wish-note-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { WishService } from '../../service/wishbook.service';

@Component({
  selector: 'app-wish-books',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    MatTableModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [DatePipe],
  templateUrl: './wish-books.component.html',
  styleUrl: './wish-books.component.scss',
  
})
export class WishBooksComponent {
  wishes: WishBook[] = [];
  filteredWishes: WishBook[] = [];
  isLoading = true;
  errorMessage = '';
  searchQuery = '';
  
  displayedColumns: string[] = [
    'book', 
    'dateAdded', 
    'availability', 
    'notes', 
    'actions'
  ];

  constructor(
    private wishlistService: WishService,
    private borrowService: BorrowService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.wishlistService.getMemberWishlist().subscribe({
      next: (data) => {
        this.wishes = data.data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching wishlist:', error);
        this.errorMessage = 'Failed to load wishlist. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredWishes = this.wishes.filter(wish => 
        wish.book?.title.toLowerCase().includes(query) ||
        wish.book?.isbn?.toLowerCase().includes(query) 
        // wish.notes?.toLowerCase().includes(query)
      );
    } else {
      this.filteredWishes = [...this.wishes];
    }
  }
  
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }
  
  removeFromWishlist(wish: WishBook): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Remove from Wishlist',
        message: `Are you sure you want to remove "${wish.book?.title}" from your wishlist?`,
        confirmText: 'Remove',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.wishlistService.deleteWish(wish.id).subscribe({
          next: () => {
            this.loadWishlist();
            this.snackBar.open('Book removed from wishlist successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (error) => {
            console.error('Error removing from wishlist:', error);
            this.isLoading = false;
            this.snackBar.open('Failed to remove book from wishlist. Please try again.', 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }
  
  borrowBook(wish: WishBook): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Borrow Book',
        message: `Are you sure you want to borrow "${wish.book?.title}"?`,
        confirmText: 'Borrow',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.borrowService.borrowBook(wish.bookId).subscribe({
          next: () => {
            this.loadWishlist();
            this.snackBar.open('Book borrowed successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (error) => {
            console.error('Error borrowing book:', error);
            this.isLoading = false;
            this.snackBar.open('Failed to borrow book. Please try again.', 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }
  
  editNotes(wish: WishBook): void {
    const dialogRef = this.dialog.open(WishNoteDialogComponent, {
      width: '400px',
      data: {
        bookTitle: wish.book?.title,
        notes:  ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.isLoading = true;
        this.wishlistService.updateWish(result,wish.id).subscribe({
          next: () => {
            this.loadWishlist();
            this.snackBar.open('Notes updated successfully', 'Close', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (error) => {
            console.error('Error updating notes:', error);
            this.isLoading = false;
            this.snackBar.open('Failed to update notes. Please try again.', 'Close', {
              duration: 5000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }
}
