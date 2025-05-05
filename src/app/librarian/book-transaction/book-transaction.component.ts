import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-transaction',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './book-transaction.component.html',
  styleUrl: './book-transaction.component.scss'
})
export class BookTransactionComponent {
  // Mode control
  isCheckout = true;

  // Input fields
  memberId = '';
  bookIsbn = '';
  loanId = '';
  dueDate = new Date();

  // Member details
  memberDetails: any = null;
  hasOverdueItems = false;
  hasFines = false;
  totalFines = 0;

  // Transaction items
  transactionItems: any[] = [];
  calculatedFines = 0;

  // Receipt state
  showReceipt = false;
  transactionId = '';
  transactionDate = new Date();
  completedItems: any[] = [];
  finesPaid = false;

  constructor(private snackBar: MatSnackBar) {
    // Set due date to 14 days from today by default
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + 14);
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  // Mode toggling
  setActionMode(isCheckout: boolean): void {
    if (this.isCheckout !== isCheckout) {
      // Reset form if changing modes
      this.resetForm(false);
      this.isCheckout = isCheckout;
    }
  }

  // Member lookup
  lookupMember(): void {
    if (!this.memberId) {
      this.showMessage('Please enter a member ID');
      return;
    }

    // Simulate API call to find member
    // In a real implementation, this would call a service
    setTimeout(() => {
      if (this.memberId.includes('MEM_')) {
        // Mock data for demo purposes
        this.memberDetails = {
          id: 'MEM_01JQAB6PDRDGY6KRG9R9964GW4',
          first_name: 'Kyaw Zin',
          last_name: 'Htet',
          email: 'kyawe225@gmail.com',
          membership_status: 'Active',
          membership_date: '2025-03-27'
        };

        // Mock data for fines and overdue items
        this.hasOverdueItems = Math.random() > 0.5;
        this.hasFines = Math.random() > 0.5;
        this.totalFines = this.hasFines ? parseFloat((Math.random() * 50).toFixed(2)) : 0;

        this.showMessage('Member found');
      } else {
        this.showMessage('Member not found', true);
        this.memberDetails = null;
      }
    }, 500);
  }

  // Book checkout handling
  addBookToCheckout(): void {
    if (!this.bookIsbn) {
      this.showMessage('Please enter a book ISBN');
      return;
    }

    if (!this.memberDetails) {
      this.showMessage('Please lookup a member first', true);
      return;
    }

    // Simulate API call to find book
    // In a real implementation, this would call a service
    setTimeout(() => {
      // Check if book is already in transaction
      const existingBookIndex = this.transactionItems.findIndex(item => item.isbn === this.bookIsbn);

      if (existingBookIndex !== -1) {
        this.showMessage('This book is already in your checkout list', true);
        return;
      }

      // Mock data for demo purposes
      const newBook = {
        book_id: `BOOK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        copy_id: `COPY_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: this.getRandomBookTitle(),
        isbn: this.bookIsbn,
        due_date: new Date(this.dueDate),
        status: 'Available'
      };

      this.transactionItems.push(newBook);
      this.bookIsbn = ''; // Clear ISBN field
      this.showMessage('Book added to checkout');
    }, 500);
  }

  // Book return handling
  addBookToReturn(): void {
    if (!this.loanId) {
      this.showMessage('Please enter a loan ID or scan a book');
      return;
    }

    if (!this.memberDetails) {
      this.showMessage('Please lookup a member first', true);
      return;
    }

    // Simulate API call to find loan
    // In a real implementation, this would call a service
    setTimeout(() => {
      // Check if book is already in transaction
      const existingLoanIndex = this.transactionItems.findIndex(item =>
        item.loan_id === this.loanId || item.book_id === this.loanId || item.isbn === this.loanId);

      if (existingLoanIndex !== -1) {
        this.showMessage('This item is already in your return list', true);
        return;
      }

      // Generate random due date in the past (50% chance of being overdue)
      const dueDate = new Date();
      const isOverdue = Math.random() > 0.5;

      if (isOverdue) {
        // Set due date to 1-30 days in the past
        dueDate.setDate(dueDate.getDate() - Math.floor(Math.random() * 30) - 1);
      } else {
        // Set due date to 1-14 days in the future
        dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1);
      }

      // Calculate days overdue and fine if applicable
      const daysOverdue = isOverdue ?
        Math.floor((new Date().getTime() - dueDate.getTime()) / (1000 * 3600 * 24)) : 0;

      const fineAmount = daysOverdue * 0.50; // $0.50 per day overdue

      // Mock data for demo purposes
      const returnedBook = {
        loan_id: `LOAN_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        book_id: `BOOK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        copy_id: `COPY_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        title: this.getRandomBookTitle(),
        isbn: Math.floor(Math.random() * 9000000000000) + 1000000000000,
        due_date: dueDate,
        is_overdue: isOverdue,
        days_overdue: daysOverdue,
        fine_amount: fineAmount
      };

      this.transactionItems.push(returnedBook);
      this.calculatedFines += fineAmount;
      this.loanId = ''; // Clear loan ID field
      this.showMessage('Book added to return list');
    }, 500);
  }

  // Remove an item from the transaction
  removeItem(index: number): void {
    if (index >= 0 && index < this.transactionItems.length) {
      // Subtract fines if in return mode
      if (!this.isCheckout && this.transactionItems[index].fine_amount) {
        this.calculatedFines -= this.transactionItems[index].fine_amount;
      }

      this.transactionItems.splice(index, 1);
      this.showMessage('Item removed');
    }
  }

  // Complete the transaction (checkout or return)
  completeTransaction(): void {
    if (this.transactionItems.length === 0) {
      this.showMessage('No items in transaction', true);
      return;
    }

    // Generate a transaction ID
    this.transactionId = `TRANS_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    this.transactionDate = new Date();
    this.completedItems = [...this.transactionItems];

    // In a real implementation, this would call a service to save the transaction
    setTimeout(() => {
      // Set due dates for all items if it's a checkout
      if (this.isCheckout) {
        this.completedItems = this.completedItems.map(item => ({
          ...item,
          due_date: new Date(this.dueDate)
        }));
      } else {
        // Handle fines for return
        this.finesPaid = this.calculatedFines > 0 ? Math.random() > 0.5 : false;
      }

      this.showReceipt = true;
      this.showMessage(`${this.isCheckout ? 'Checkout' : 'Return'} completed successfully`);
    }, 1000);
  }

  // Clear the current transaction
  clearTransaction(): void {
    this.transactionItems = [];
    this.calculatedFines = 0;
    this.showMessage('Transaction cleared');
  }

  // Reset the form completely
  resetForm(showMessage = true): void {
    this.memberId = '';
    this.bookIsbn = '';
    this.loanId = '';
    this.memberDetails = null;
    this.transactionItems = [];
    this.calculatedFines = 0;
    this.showReceipt = false;
    this.hasOverdueItems = false;
    this.hasFines = false;
    this.totalFines = 0;

    // Reset due date to 14 days from today
    this.dueDate = new Date();
    this.dueDate.setDate(this.dueDate.getDate() + 14);

    if (showMessage) {
      this.showMessage('Form reset. Ready for new transaction');
    }
  }

  // Print receipt (would be implemented to use browser's print functionality)
  printReceipt(): void {
    this.showMessage('Printing receipt...');
    // In a real implementation, this would trigger window.print() or similar
  }

  // Email receipt
  emailReceipt(): void {
    this.showMessage('Emailing receipt to member...');
    // In a real implementation, this would call a service to email the receipt
  }

  // Helper to display snackbar messages
  private showMessage(message: string, isError = false): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  // Helper to generate random book titles for demo
  private getRandomBookTitle(): string {
    const bookTitles = [
      'Programming C#',
      'Angular Development',
      'PostgreSQL Database Management',
      'Web Development with ASP.NET Core',
      'Learning TypeScript',
      'Node.js Design Patterns',
      'Cloud Computing Fundamentals',
      'JavaScript: The Good Parts',
      'CSS Mastery',
      'HTML5 and CSS3'
    ];

    return bookTitles[Math.floor(Math.random() * bookTitles.length)];
  }
}
