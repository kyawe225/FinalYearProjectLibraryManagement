// book-loan-management.component.ts
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CrudDialogData, DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { environment } from '../../../environments/environment';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { MatIconModule } from '@angular/material/icon';

interface BookLoan {
  loan_id: string;
  book_id: string;
  member_id: string;
  date_borrowed: string;
  due_date: string;
  date_returned: string | null;
  status: string;
  fine_amount: number;
  book_title?: string;
  member_name?: string;
}

interface Book {
  book_id: string;
  title: string;
  isbn: string;
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-book-loan-management',
  standalone: true,
  imports: [CommonModule, CommonMaterialTableComponent, MatIconModule],
  templateUrl: './bookloan-management.component.html',
  styleUrls: ['./bookloan-management.component.scss']
})
export class BookLoanManagementComponent implements OnInit {
  @ViewChild(CommonMaterialTableComponent) table!: CommonMaterialTableComponent;
  
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  
  apiUrl = `${environment.apiUrl}/book-loans`;
  
  displayedColumns: string[] = [
    'loan_id',
    'book_title',
    'member_name',
    'date_borrowed',
    'due_date',
    'date_returned',
    'status',
    'fine_amount'
  ];
  
  dataSource = new MatTableDataSource<BookLoan>([]);
  isLoading = false;
  
  books: Book[] = [];
  members: Member[] = [];
  
  ngOnInit(): void {
    this.loadData();
    this.loadBooks();
    this.loadMembers();
  }
  
  loadData(): void {
    this.isLoading = true;
    this.http.get<BookLoan[]>(this.apiUrl).subscribe({
      next: (loans) => {
        // Enrich book loans with names
        const enrichedLoans = loans.map(loan => {
          const book = this.books.find(b => b.book_id === loan.book_id);
          const member = this.members.find(m => m.id === loan.member_id);
          
          return {
            ...loan,
            book_title: book ? book.title : 'Unknown',
            member_name: member ? `${member.first_name} ${member.last_name}` : 'Unknown'
          };
        });
        
        this.dataSource.data = enrichedLoans;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading book loans', error);
        this.snackBar.open('Error loading book loans', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  loadBooks(): void {
    this.http.get<Book[]>(`${environment.apiUrl}/books`).subscribe({
      next: (books) => {
        this.books = books;
        // Refresh loans to reflect book titles
        if (this.dataSource.data.length > 0) {
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading books', error);
      }
    });
  }
  
  loadMembers(): void {
    this.http.get<Member[]>(`${environment.apiUrl}/members`).subscribe({
      next: (members) => {
        this.members = members;
        // Refresh loans to reflect member names
        if (this.dataSource.data.length > 0) {
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading members', error);
      }
    });
  }
  
  onAddClick(): void {
    const dialogData: CrudDialogData = {
      title: 'Add New Book Loan',
      submitButtonText: 'Add',
      action: 'create',
      formFields: this.getFormFields()
    };
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.isLoading = true;
        this.http.post<BookLoan>(this.apiUrl, result.data).subscribe({
          next: () => {
            this.snackBar.open('Book loan added successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error adding book loan', error);
            this.snackBar.open('Error adding book loan', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onEditClick(loan: BookLoan): void {
    const dialogData: CrudDialogData = {
      title: 'Edit Book Loan',
      submitButtonText: 'Update',
      action: 'update',
      data: loan,
      formFields: this.getFormFields(loan)
    };
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.isLoading = true;
        this.http.put<BookLoan>(`${this.apiUrl}/${loan.loan_id}`, result.data).subscribe({
          next: () => {
            this.snackBar.open('Book loan updated successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error updating book loan', error);
            this.snackBar.open('Error updating book loan', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onViewClick(loan: BookLoan): void {
    const dialogData: CrudDialogData = {
      title: 'View Book Loan',
      submitButtonText: 'Close',
      action: 'view',
      data: loan,
      formFields: this.getFormFields(loan)
    };
    
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });
  }
  
  onDeleteClick(loan: BookLoan): void {
    const dialogData: CrudDialogData = {
      title: 'Delete Book Loan',
      submitButtonText: 'Delete',
      action: 'delete',
      data: loan,
      formFields: [
        {
          name: 'confirmation',
          label: 'Are you sure you want to delete this book loan?',
          type: 'text',
          disabled: true,
          value: `Loan ID: ${loan.loan_id} - Book: ${loan.book_title}`
        }
      ]
    };
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '500px',
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.isLoading = true;
        this.http.delete(`${this.apiUrl}/${loan.loan_id}`).subscribe({
          next: () => {
            this.snackBar.open('Book loan deleted successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting book loan', error);
            this.snackBar.open('Error deleting book loan', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onReturnBook(loan: BookLoan): void {
    this.isLoading = true;
    
    // Set returned date to today and update status
    const returnData = {
      loan_id: loan.loan_id,
      date_returned: new Date().toISOString().split('T')[0],
      status: 'Returned'
    };
    
    this.http.patch<BookLoan>(`${this.apiUrl}/${loan.loan_id}/return`, returnData).subscribe({
      next: () => {
        this.snackBar.open('Book returned successfully', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Error returning book', error);
        this.snackBar.open('Error returning book', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  onRefresh(): void {
    this.loadData();
  }
  
  getFormFields(loan?: BookLoan): DialogFieldConfig[] {
    const baseFields: DialogFieldConfig[] = [
      {
        name: 'book_id',
        label: 'Book',
        type: 'select',
        required: true,
        options: this.books.map(book => ({
          value: book.book_id,
          label: `${book.title} (ISBN: ${book.isbn})`
        }))
      },
      {
        name: 'member_id',
        label: 'Member',
        type: 'select',
        required: true,
        options: this.members.map(member => ({
          value: member.id,
          label: `${member.first_name} ${member.last_name}`
        }))
      },
      {
        name: 'date_borrowed',
        label: 'Date Borrowed',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      },
      {
        name: 'due_date',
        label: 'Due Date',
        type: 'date',
        required: true,
        // Default due date is 14 days from today
        value: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];
    
    // If editing an existing loan, add these fields
    if (loan) {
      baseFields.push(
        {
          name: 'date_returned',
          label: 'Date Returned',
          type: 'date'
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          options: [
            { value: 'Active', label: 'Active' },
            { value: 'Returned', label: 'Returned' },
            { value: 'Overdue', label: 'Overdue' },
            { value: 'Lost', label: 'Lost' }
          ]
        },
        {
          name: 'fine_amount',
          label: 'Fine Amount',
          type: 'number',
          min: 0,
        }
      );
    } else {
      // If adding a new loan, set default values
      baseFields.push(
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          required: true,
          value: 'Active',
          options: [
            { value: 'Active', label: 'Active' }
          ]
        },
        {
          name: 'fine_amount',
          label: 'Fine Amount',
          type: 'number',
          min: 0,
          value: 0
        }
      );
    }
    
    return baseFields;
  }
}
