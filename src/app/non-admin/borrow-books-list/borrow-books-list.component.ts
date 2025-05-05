import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookLoan } from '../../model/book-loan';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BorrowService } from '../../service/borrow.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-borrow-books-list',
  imports: [
    MatDialogModule,
    CommonModule,

  ],
  templateUrl: './borrow-books-list.component.html',
  styleUrl: './borrow-books-list.component.scss'
})
export class BorrowBooksListComponent {
  loans: BookLoan[] = [];
  filteredLoans: BookLoan[] = [];
  isLoading = true;
  errorMessage = '';
  filterStatus = 'all'; // 'all', 'active', 'returned', 'overdue'
  searchQuery = '';
  
  displayedColumns: string[] = [
    'title', 
    'dateBorrowed', 
    'dueDate', 
    'status', 
    'fine', 
    'actions'
  ];

  constructor(
    private borrowService: BorrowService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.isLoading = true;
    // this.borrowService.getMemberLoans().subscribe({
    //   next: (data) => {
    //     this.loans = data;
    //     this.applyFilters();
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching loans:', error);
    //     this.errorMessage = 'Failed to load borrowed books. Please try again later.';
    //     this.isLoading = false;
    //   }
    // });
  }

  applyFilters(): void {
    let filtered = [...this.loans];
    
    // Apply status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(loan => loan.status.toLowerCase() === this.filterStatus);
    }
    
    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(loan => 
        loan.book.title.toLowerCase().includes(query) ||
        loan.book.isbn?.toLowerCase().includes(query)
      );
    }
    
    this.filteredLoans = filtered;
  }
  
  onFilterChange(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }
  
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  isOverdue(loan: BookLoan): boolean {
    if (loan.status === 'Returned') return false;
    
    const today = new Date();
    const dueDate = new Date(loan.due_date);
    return today > dueDate;
  }
  
  calculateDaysLeft(dueDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MMM d, yyyy') || '';
  }
  
  returnBook(loan: BookLoan): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Return Book',
        message: `Are you sure you want to return "${loan.book.title}"?`,
        confirmText: 'Return',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // this.borrowService.returnBook(loan.loan_id).subscribe({
        //   next: () => {
        //     this.loadLoans();
        //     this.snackBar.open('Book returned successfully', 'Close', {
        //       duration: 3000,
        //       panelClass: 'success-snackbar'
        //     });
        //   },
        //   error: (error) => {
        //     console.error('Error returning book:', error);
        //     this.isLoading = false;
        //     this.snackBar.open('Failed to return book. Please try again.', 'Close', {
        //       duration: 5000,
        //       panelClass: 'error-snackbar'
        //     });
        //   }
        // });
      }
    });
  }
  
  renewLoan(loan: BookLoan): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Renew Book',
        message: `Are you sure you want to renew "${loan.book.title}"?`,
        confirmText: 'Renew',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // this.borrowService.renewLoan(loan.loan_id).subscribe({
        //   next: (updatedLoan) => {
        //     this.loadLoans();
        //     this.snackBar.open(`Book renewed successfully. New due date: ${this.formatDate(updatedLoan.dueDate)}`, 'Close', {
        //       duration: 5000,
        //       panelClass: 'success-snackbar'
        //     });
        //   },
        //   error: (error) => {
        //     console.error('Error renewing loan:', error);
        //     this.isLoading = false;
        //     this.snackBar.open('Failed to renew book. Please try again.', 'Close', {
        //       duration: 5000,
        //       panelClass: 'error-snackbar'
        //     });
        //   }
        // });
      }
    });
  }
}
