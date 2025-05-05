// src/app/admin/book-reviews/book-review-management.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable, forkJoin } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { BookReview } from '../../model/book-review';
import { BookService } from '../../service/book.service';
import { MemberService } from '../../service/member.service';
import { BookReviewService } from '../../service/bookreview.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';

@Component({
  selector: 'app-book-review-management',
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './bookreview-management.component.html',
  styleUrls: ['./bookreview-management.component.scss']
})
export class BookReviewManagementComponent implements OnInit {
  dataSource = signal<MatTableDataSource<BookReview>>(new MatTableDataSource<BookReview>([]));
  displayedColumns = signal<string[]>([
    'review_id',
    'book_title',
    'member_name',
    'rating',
    'review_date'
  ]);
  
  loading = signal<boolean>(false);
  books = signal<any[]>([]);
  members = signal<any[]>([]);
  
  constructor(
    private reviewService: BookReviewService,
    private bookService: BookService,
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadRelatedData();
    this.loadReviews();
  }
  
  loadRelatedData(): void {
    this.loading.set(true);
    
    forkJoin({
      books: this.bookService.getBookByIsbn(""),
      members: this.memberService.getMembers()
    }).subscribe({
      next: (result) => {
        this.books.set(result.books);
        this.members.set(result.members.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading related data:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading data. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  loadReviews(): void {
    this.loading.set(true);
    
    this.reviewService.getBookReviews().subscribe({
      next: (reviews) => {
        // Enhance reviews with book and member information
        const enhancedReviews = reviews.map(review => {
          const book = this.books().find(b => b.book_id === review.book_id);
          const member = this.members().find(m => m.id === review.member_id);
          
          return {
            ...review,
          };
        });
        
        this.dataSource.set(new MatTableDataSource(enhancedReviews));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading reviews. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  handleRefresh(): void {
    this.loadReviews();
  }
  
  handleRowClick(review: BookReview): void {
    this.openReviewDialog('view', review);
  }
  
  handleAddClick(): void {
    this.openReviewDialog('add');
  }
  
  handleEditClick(review: BookReview): void {
    this.openReviewDialog('edit', review);
  }
  
  handleDeleteClick(review: BookReview): void {
    this.openReviewDialog('delete', review);
  }
  
  openReviewDialog(action: 'add' | 'edit' | 'view' | 'delete', review?: BookReview): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'book_id',
        label: 'Book',
        type: 'select',
        required: true,
        options: this.books().map(book => ({
          value: book.book_id,
          label: book.title
        }))
      },
      {
        name: 'member_id',
        label: 'Member',
        type: 'select',
        required: true,
        options: this.members().map(member => ({
          value: member.id,
          label: `${member.first_name} ${member.last_name}`
        }))
      },
      {
        name: 'rating',
        label: 'Rating',
        type: 'number',
        required: true,
        min: 1,
        max: 5
      },
      {
        name: 'review_text',
        label: 'Review Text',
        type: 'textarea',
        required: false
      },
      {
        name: 'review_date',
        label: 'Review Date',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      }
    ];
    
    let dialogTitle = '';
    let submitButtonText = '';
    
    switch (action) {
      case 'add':
        dialogTitle = 'Add New Review';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Review';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Review Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Review';
        submitButtonText = 'Delete';
        break;
    }
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: review || {},
        action: action
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }
      
      let operation: Observable<any>;
      
      switch (action) {
        case 'add':
          operation = this.reviewService.createBookReview(result.data);
          break;
        case 'edit':
          operation = this.reviewService.updateBookReview({
            ...result.data,
            review_id: review?.review_id
          });
          break;
        case 'delete':
          operation = this.reviewService.deleteBookReview(review?.review_id || '');
          break;
        default:
          return;
      }
      
      this.loading.set(true);
      
      operation.subscribe({
        next: () => {
          this.loading.set(false);
          
          const message = action === 'add' ? 'Review added successfully' :
                          action === 'edit' ? 'Review updated successfully' :
                          'Review deleted successfully';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
          
          this.loadReviews();
        },
        error: (error) => {
          console.error(`Error ${action} review:`, error);
          this.loading.set(false);
          
          this.snackBar.open(`Error ${action === 'add' ? 'adding' : 
                               action === 'edit' ? 'updating' : 
                               'deleting'} review. Please try again.`, 'Close', {
            duration: 3000
          });
        }
      });
    });
  }
}