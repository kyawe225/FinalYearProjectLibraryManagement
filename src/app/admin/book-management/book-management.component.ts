import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { BookService } from '../../service/book.service';
import { PublisherService } from '../../service/publisher.service';
import { AuthorService } from '../../service/author.service';
import { CategoryService } from '../../service/category.service';
import { book_category } from '../../model/book_category';
import { Publisher } from '../../model/publisher';
import { author } from '../../model/author';
import { Book } from '../../model/book';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book-management',
  imports: [
    CommonModule, CommonMaterialTableComponent, MatIconModule
  ],
  templateUrl: './book-management.component.html',
  styleUrl: './book-management.component.scss'
})
export class BookManagementComponent {
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private publisherService = inject(PublisherService);
  private authorService = inject(AuthorService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data sources
  dataSource = new MatTableDataSource<Book>([]);
  categories: book_category[] = [];
  publishers: Publisher[] = [];
  authors: author[] = [];
  
  // Table configuration
  displayedColumns: string[] = [
    'title', 
    'isbn', 
    'publication_date', 
    'publisher',
    'category', 
    'total_copies', 
    'available_copies',
    'status'
  ];
  loading = false;

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
    this.loadPublishers();
    this.loadAuthors();
  }

  async loadBooks(): Promise<void> {
    this.loading = true;
    try {
      const books = await firstValueFrom(this.bookService.getAll());
      this.dataSource.data = books.data;
    } catch (error) {
      this.showNotification('Error loading books', 'error');
      console.error('Error loading books:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadCategories(): Promise<void> {
    try {
      this.categories = (await firstValueFrom(this.categoryService.getAll())).data;
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadPublishers(): Promise<void> {
    try {
      this.publishers = (await firstValueFrom(this.publisherService.getPublishers())).data;
    } catch (error) {
      console.error('Error loading publishers:', error);
    }
  }

  async loadAuthors(): Promise<void> {
    try {
      this.authors = (await firstValueFrom(this.authorService.getAll())).data;
    } catch (error) {
      console.error('Error loading authors:', error);
    }
  }

  onAddBook(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Book',
        submitButtonText: 'Add Book',
        action: 'add',
        formFields: this.getBookFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.createBook(result.data);
      }
    });
  }

  onEditBook(book: Book): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Book',
        submitButtonText: 'Update Book',
        action: 'edit',
        data: book,
        formFields: this.getBookFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updateBook(book.book_id, result.data);
      }
    });
  }

  onViewBook(book: Book): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Book Details',
        action: 'view',
        data: book,
        formFields: this.getBookFormFields()
      }
    });
  }

  onDeleteBook(book: Book): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '400px',
      data: {
        title: 'Delete Book',
        submitButtonText: 'Delete',
        action: 'delete',
        data: book,
        formFields: [
          {
            name: 'confirmation',
            label: `Are you sure you want to delete the book "${book.title}"?`,
            type: 'text',
            readonly: true
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteBook(book.book_id);
      }
    });
  }

  async createBook(bookData: any): Promise<void> {
    try {
      await firstValueFrom(this.bookService.createBook(bookData));
      this.showNotification('Book added successfully', 'success');
      this.loadBooks();
    } catch (error) {
      this.showNotification('Error adding book', 'error');
      console.error('Error adding book:', error);
    }
  }

  async updateBook(bookId: string, bookData: any): Promise<void> {
    try {
      await firstValueFrom(this.bookService.updateBook(bookId, bookData));
      this.showNotification('Book updated successfully', 'success');
      this.loadBooks();
    } catch (error) {
      this.showNotification('Error updating book', 'error');
      console.error('Error updating book:', error);
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    try {
      await firstValueFrom(this.bookService.deleteBook(bookId));
      this.showNotification('Book deleted successfully', 'success');
      this.loadBooks();
    } catch (error) {
      this.showNotification('Error deleting book', 'error');
      console.error('Error deleting book:', error);
    }
  }

  getBookFormFields(): DialogFieldConfig[] {
    return [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 255
      },
      {
        name: 'isbn',
        label: 'ISBN',
        type: 'text',
        maxLength: 20
      },
      {
        name: 'publication_date',
        label: 'Publication Date',
        type: 'date'
      },
      {
        name: 'publisher_id',
        label: 'Publisher',
        type: 'select',
        options: this.publishers.map(p => ({ value: p.id, label: p.name }))
      },
      {
        name: 'category_id',
        label: 'Category',
        type: 'select',
        options: this.categories.map(c => ({ value: c.id, label: c.name }))
      },
      {
        name: 'total_copies',
        label: 'Total Copies',
        type: 'number',
        required: true,
        min: 1,
        value: 1
      },
      {
        name: 'available_copies',
        label: 'Available Copies',
        type: 'number',
        required: true,
        min: 0,
        value: 1
      },
      {
        name: 'location_in_library',
        label: 'Location in Library',
        type: 'text',
        maxLength: 50
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Available', label: 'Available' },
          { value: 'Unavailable', label: 'Unavailable' },
          { value: 'Reserved', label: 'Reserved' },
          { value: 'On Loan', label: 'On Loan' }
        ],
        value: 'Available'
      }
    ];
  }

  onRefresh(): void {
    this.loadBooks();
  }

  showNotification(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'success' ? ['success-snackbar'] : ['error-snackbar']
    });
  }
}
