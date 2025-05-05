// src/app/admin/computers/computer-management.component.ts

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
import { MatChipsModule } from '@angular/material/chips';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { Computer } from '../../model/computer';
import { ComputerService } from '../../service/computer.service';
import { BranchService } from '../../service/branch.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-computer-management',
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './computer-management.component.html',
  styleUrls: ['./computer-management.component.scss']
})
export class ComputerManagementComponent implements OnInit {
  dataSource = signal<MatTableDataSource<Computer>>(new MatTableDataSource<Computer>([]));
  displayedColumns = signal<string[]>([
    'computer_id',
    'computer_name',
    'branch_name',
    'computer_type',
    'status',
    'time_limit_minutes',
    'location_in_library'
  ]);
  
  loading = signal<boolean>(false);
  branches = signal<any[]>([]);
  computerTypes = signal<string[]>(['Desktop', 'Laptop', 'Tablet', 'Workstation']);
  statuses = signal<string[]>(['Available', 'In Use', 'Maintenance', 'Out of Order']);
  
  constructor(
    private computerService: ComputerService,
    private branchService: BranchService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadInitialData();
  }
  
  loadInitialData(): void {
    this.loading.set(true);
    
    forkJoin({
      branches: this.branchService.getAll(),
      computers: this.computerService.getComputers()
    }).subscribe({
      next: (result) => {
        this.branches.set(result.branches.data);
        
        // Enhance computers with branch names
        const enhancedComputers = result.computers.data.map(computer => {
          const branch = result.branches.data.find(b => b.id === computer.branch_id);
          return {
            ...computer,
          };
        });
        
        this.dataSource.set(new MatTableDataSource(enhancedComputers));
        this.loading.set(false);
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
  
  handleRefresh(): void {
    this.loadInitialData();
  }
  
  handleRowClick(computer: Computer): void {
    this.openComputerDialog('view', computer);
  }
  
  handleAddClick(): void {
    this.openComputerDialog('add');
  }
  
  handleEditClick(computer: Computer): void {
    this.openComputerDialog('edit', computer);
  }
  
  handleDeleteClick(computer: Computer): void {
    this.openComputerDialog('delete', computer);
  }
  
  handleStatusChange(computer: Computer, status: string): void {
    this.loading.set(true);
    this.computerService.updateComputerStatus(computer.computer_id, status).subscribe({
      next: () => {
        this.snackBar.open(`Computer status updated to ${status}`, 'Close', {
          duration: 3000
        });
        this.loadInitialData();
      },
      error: (error) => {
        console.error('Error updating computer status:', error);
        this.loading.set(false);
        this.snackBar.open('Error updating computer status. Please try again.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  handleScheduleMaintenance(computer: Computer): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'maintenance_date',
        label: 'Maintenance Date',
        type: 'date',
        required: true
      },
      {
        name: 'notes',
        label: 'Maintenance Notes',
        type: 'textarea',
        required: false
      }
    ];
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '500px',
      data: {
        title: 'Schedule Maintenance',
        submitButtonText: 'Schedule',
        formFields: formFields,
        data: {
          maintenance_date: new Date().toISOString().split('T')[0]
        },
        action: 'custom'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }
      
      this.loading.set(true);
      
      this.computerService.scheduleComputerMaintenance(
        computer.computer_id, 
        result.data.maintenance_date
      ).subscribe({
        next: () => {
          this.loading.set(false);
          this.snackBar.open('Maintenance scheduled successfully', 'Close', {
            duration: 3000
          });
          this.handleStatusChange(computer, 'Maintenance');
        },
        error: (error) => {
          console.error('Error scheduling maintenance:', error);
          this.loading.set(false);
          this.snackBar.open('Error scheduling maintenance. Please try again.', 'Close', {
            duration: 3000
          });
        }
      });
    });
  }
  
  openComputerDialog(action: 'add' | 'edit' | 'view' | 'delete', computer?: Computer): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'computer_name',
        label: 'Computer Name',
        type: 'text',
        required: true,
        maxLength: 50,
        errorMessage: 'Computer name is required'
      },
      {
        name: 'branch_id',
        label: 'Branch',
        type: 'select',
        required: true,
        options: this.branches().map(branch => ({
          value: branch.id,
          label: branch.branch_name
        }))
      },
      {
        name: 'computer_type',
        label: 'Computer Type',
        type: 'select',
        required: true,
        options: this.computerTypes().map(type => ({
          value: type,
          label: type
        }))
      },
      {
        name: 'location_in_library',
        label: 'Location in Library',
        type: 'text',
        required: false,
        maxLength: 100
      },
      {
        name: 'specifications',
        label: 'Specifications',
        type: 'textarea',
        required: false
      },
      {
        name: 'operating_system',
        label: 'Operating System',
        type: 'text',
        required: false,
        maxLength: 100
      },
      {
        name: 'installed_software',
        label: 'Installed Software',
        type: 'textarea',
        required: false
      },
      {
        name: 'acquisition_date',
        label: 'Acquisition Date',
        type: 'date',
        required: false
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: this.statuses().map(status => ({
          value: status,
          label: status
        }))
      },
      {
        name: 'time_limit_minutes',
        label: 'Time Limit (minutes)',
        type: 'number',
        required: true,
        min: 0,
        value: 60
      }
    ];
    
    let dialogTitle = '';
    let submitButtonText = '';
    
    switch (action) {
      case 'add':
        dialogTitle = 'Add New Computer';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Computer';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Computer Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Computer';
        submitButtonText = 'Delete';
        break;
    }
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '700px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: computer || { status: 'Available', time_limit_minutes: 60 },
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
          operation = this.computerService.createComputer(result.data);
          break;
        case 'edit':
          operation = this.computerService.updateComputer({
            ...result.data,
            computer_id: computer?.computer_id
          });
          break;
        case 'delete':
          operation = this.computerService.deleteComputer(computer?.computer_id || '');
          break;
        default:
          return;
      }
      
      this.loading.set(true);
      
      operation.subscribe({
        next: () => {
          this.loading.set(false);
          
          const message = action === 'add' ? 'Computer added successfully' :
                          action === 'edit' ? 'Computer updated successfully' :
                          'Computer deleted successfully';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
          
          this.loadInitialData();
        },
        error: (error) => {
          console.error(`Error ${action} computer:`, error);
          this.loading.set(false);
          
          this.snackBar.open(`Error ${action === 'add' ? 'adding' : 
                               action === 'edit' ? 'updating' : 
                               'deleting'} computer. Please try again.`, 'Close', {
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
      case 'In Use':
        return 'status-in-use';
      case 'Maintenance':
        return 'status-maintenance';
      case 'Out of Order':
        return 'status-out-of-order';
      default:
        return '';
    }
  }
}