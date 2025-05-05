// src/app/admin/wishes/wish-management.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { BookService } from '../../service/book.service';
import { MemberService } from '../../service/member.service';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { WishBook } from '../../model/wish-book';
import {  WishService } from '../../service/wishbook.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-wish-management',
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './wish-management.component.html',
  styleUrls: ['./wish-management.component.scss']
})
export class WishManagementComponent implements OnInit {
  dataSource = signal<MatTableDataSource<WishBook>>(new MatTableDataSource<WishBook>([]));
  displayedColumns = signal<string[]>([
    'wish_id',
    'book_title',
    'member_name',
    'date_added',
    'book_status',
    'notes',
    'actions'
  ]);
  
  loading = signal<boolean>(false);
  books = signal<any[]>([]);
  members = signal<any[]>([]);
  
  // Filter values
  selectedMember = signal<string>('');
  selectedDateRange = signal<{start: string | null, end: string | null}>({start: null, end: null});
  
  // Statistics
  totalWishes = signal<number>(0);
  activeMembers = signal<number>(0);
  popularBooks = signal<any[]>([]);
  
  constructor(
    private wishService: WishService,
    private bookService: BookService,
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    this.loading.set(true);
    
    forkJoin({
      books: this.bookService.getAll(),
      members: this.memberService.getMembers(),
      wishStats: this.wishService.getWishStatistics()
    }).subscribe({
      next: (result) => {
        this.books.set(result.books.data);
        this.members.set(result.members.data);
        
        // Update statistics
        this.totalWishes.set(result.wishStats.total_count || 0);
        this.activeMembers.set(result.wishStats.active_members || 0);
        this.popularBooks.set(result.wishStats.popular_books || []);
        
        // Load wishes
        this.loadWishes();
      },
      error: (error) => {
        console.error('Error loading initial data:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading data. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  loadWishes(): void {
    this.loading.set(true);
    
    // Build filter
    const filter = {
      member_id: this.selectedMember(),
      date_from: this.selectedDateRange().start || undefined,
      date_to: this.selectedDateRange().end || undefined
    };
    
    this.wishService.getWishes(filter).subscribe({
      next: (wishes) => {
        // Enhance wishes with related data
        const enhancedWishes = wishes.map(wish => {
          const book = this.books().find(b => b.book_id === wish.bookId);
          const member = this.members().find(m => m.id === wish.userId);
          
          return {
            ...wish,
          };
        });
        
        this.dataSource.set(new MatTableDataSource(enhancedWishes));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading wishes:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading wishes. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  onFilterChange(): void {
    this.loadWishes();
  }
  
  handleRefresh(): void {
    this.loadInitialData();
  }
  
  handleRowClick(wish: WishBook): void {
    this.openWishDialog('view', wish);
  }
  
  handleAddClick(): void {
    this.openWishDialog('add');
  }
  
  handleEditClick(wish: WishBook): void {
    this.openWishDialog('edit', wish);
  }
  
  handleDeleteClick(wish: WishBook): void {
    this.openWishDialog('delete', wish);
  }
  
  handleConvertToReservation(wish: WishBook): void {
    const book = this.books().find(b => b.book_id === wish.bookId);
    
    if (!book) {
      this.snackBar.open('Book information not found', 'Close', {
        duration: 3000
      });
      return;
    }
    
    // Confirm conversion
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '500px',
      data: {
        title: 'Convert to Reservation',
        submitButtonText: 'Convert',
        formFields: [
          {
            name: 'confirm',
            label: `Are you sure you want to convert this wish for "${book.title}" to a reservation?`,
            type: 'info',
            required: false
          }
        ],
        data: {},
        action: 'custom'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }
      
      this.loading.set(true);
      
      this.wishService.convertToReservation(wish.id).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Wish converted to reservation successfully', 'Close', {
            duration: 3000
          });
          this.loadInitialData();
        },
        error: (error) => {
          console.error('Error converting wish to reservation:', error);
          this.loading.set(false);
          this.snackBar.open('Error converting wish to reservation. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    });
  }
  
  openWishDialog(action: 'add' | 'edit' | 'view' | 'delete', wish?: WishBook): void {
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
        name: 'date_added',
        label: 'Date Added',
        type: 'date',
        required: true,
        value: new Date().toISOString().split('T')[0]
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea',
        required: false
      }
    ];
    
    let dialogTitle = '';
    let submitButtonText = '';
    
    switch (action) {
      case 'add':
        dialogTitle = 'Add New Wish';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Wish';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Wish Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Wish';
        submitButtonText = 'Delete';
        break;
    }
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: wish || {
          date_added: new Date().toISOString().split('T')[0]
        },
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
          operation = this.wishService.createWish(result.data);
          break;
        case 'edit':
          operation = this.wishService.updateWish({
            ...result.data,
            wish_id: wish?.id
          });
          break;
        case 'delete':
          operation = this.wishService.deleteWish(wish?.id || '');
          break;
        default:
          return;
      }
      
      this.loading.set(true);
      
      operation.subscribe({
        next: () => {
          this.loading.set(false);
          
          const message = action === 'add' ? 'Wish added successfully' :
                          action === 'edit' ? 'Wish updated successfully' :
                          'Wish deleted successfully';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
          
          this.loadInitialData();
        },
        error: (error) => {
          console.error(`Error ${action} wish:`, error);
          this.loading.set(false);
          
          this.snackBar.open(`Error ${action === 'add' ? 'adding' : 
                               action === 'edit' ? 'updating' : 
                               'deleting'} wish. Please try again.`, 'Close', {
            duration: 3000
          });
        }
      });
    });
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'Available':
        return 'status-available';
      case 'On Loan':
        return 'status-on-loan';
      case 'Reserved':
        return 'status-reserved';
      case 'Processing':
        return 'status-processing';
      case 'Lost':
      case 'Damaged':
        return 'status-unavailable';
      default:
        return '';
    }
  }
  
  clearDateFilter(): void {
    this.selectedDateRange.set({start: null, end: null});
    this.onFilterChange();
  }

  updateDateRangeStart(event: any): void {
    const value = event.value;
    const start = value ? value.toISOString().split('T')[0] : null;
    
    this.selectedDateRange.update(val => ({
      ...val,
      start: start
    }));
  }
  
  updateDateRangeEnd(event: any): void {
    const value = event.value;
    const end = value ? value.toISOString().split('T')[0] : null;
    
    this.selectedDateRange.update(val => ({
      ...val,
      end: end
    }));
  }
}