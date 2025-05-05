import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { Publisher } from '../../model/publisher';
import { PublisherService } from '../../service/publisher.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { ConfirmDialogComponent } from '../../non-admin/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-publisher-management',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class PublisherComponent implements OnInit {
  // Table configuration
  displayedColumns: string[] = ['name', 'contact_person', 'email', 'phone', 'website'];
  dataSource = new MatTableDataSource<Publisher>([]);
  loading = false;
  
  constructor(
    private publisherService: PublisherService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPublishers();
  }

  // Load publishers from the API
  loadPublishers(): void {
    this.loading = true;
    this.publisherService.getPublishers()
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading publishers:', error);
          this.snackBar.open('Failed to load publishers', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  // Open dialog to add a new publisher
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Publisher',
        submitButtonText: 'Add',
        action: 'add',
        formFields: this.getPublisherFormConfig()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.addPublisher(result.data);
      }
    });
  }

  // Add a new publisher
  addPublisher(publisher: Publisher): void {
    this.loading = true;
    this.publisherService.createPublisher(publisher)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Publisher added successfully', 'Close', { duration: 3000 });
            this.loadPublishers();
          } else {
            this.snackBar.open('Failed to add publisher', 'Close', { duration: 3000 });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error adding publisher:', error);
          this.snackBar.open('Failed to add publisher', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  // Open dialog to edit a publisher
  openEditDialog(publisher: Publisher): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Publisher',
        submitButtonText: 'Update',
        action: 'edit',
        data: publisher,
        formFields: this.getPublisherFormConfig()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updatePublisher({...result.data, publisher_id: publisher.id});
      }
    });
  }

  // Update an existing publisher
  updatePublisher(publisher: Publisher): void {
    this.loading = true;
    this.publisherService.updatePublisher(publisher)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Publisher updated successfully', 'Close', { duration: 3000 });
            this.loadPublishers();
          } else {
            this.snackBar.open('Failed to update publisher', 'Close', { duration: 3000 });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating publisher:', error);
          this.snackBar.open('Failed to update publisher', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  // Open dialog to view publisher details
  openViewDialog(publisher: Publisher): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Publisher Details',
        action: 'view',
        data: publisher,
        formFields: this.getPublisherFormConfig()
      }
    });
  }

  // Open confirmation dialog to delete a publisher
  openDeleteDialog(publisher: Publisher): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Publisher',
        message: `Are you sure you want to delete the publisher "${publisher.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deletePublisher(publisher.id);
      }
    });
  }

  // Delete a publisher
  deletePublisher(id: string): void {
    this.loading = true;
    this.publisherService.deletePublisher(id)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Publisher deleted successfully', 'Close', { duration: 3000 });
            this.loadPublishers();
          } else {
            this.snackBar.open('Failed to delete publisher', 'Close', { duration: 3000 });
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error deleting publisher:', error);
          this.snackBar.open('Failed to delete publisher', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  // Handle table row selection
  onRowClick(publisher: Publisher): void {
    this.openViewDialog(publisher);
  }

  // Handle edit button click
  onEditClick(publisher: Publisher): void {
    this.openEditDialog(publisher);
  }

  // Handle delete button click
  onDeleteClick(publisher: Publisher): void {
    this.openDeleteDialog(publisher);
  }

  // Handle refresh button click
  onRefresh(): void {
    this.loadPublishers();
  }

  // Form configuration for publisher dialog
  private getPublisherFormConfig(): DialogFieldConfig[] {
    return [
      {
        name: 'name',
        label: 'Publisher Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 255,
        errorMessage: 'Publisher name is required'
      },
      {
        name: 'contact_person',
        label: 'Contact Person',
        type: 'text',
        maxLength: 100
      },
      {
        name: 'address',
        label: 'Address',
        type: 'textarea'
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'text',
        maxLength: 20
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        maxLength: 100
      },
      {
        name: 'website',
        label: 'Website',
        type: 'text',
        maxLength: 255
      }
    ];
  }
}