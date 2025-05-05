// appointment-management.component.ts
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
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Member } from '../../model/user';
import { Staff } from '../../model/auth';
import { Branch } from '../../model/branch';

interface Appointment {
  appointment_id: string;
  member_id: string;
  staff_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  notes: string;
  status: string;
  branch_id: string;
  created_date: string;
  modified_date: string;
  member_name?: string;
  staff_name?: string;
  branch_name?: string;
}


@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [CommonModule, CommonMaterialTableComponent, MatIconModule],
  templateUrl: './appointment-management.component.html',
  styleUrls: ['./appointment-management.component.scss']
})
export class AppointmentManagementComponent implements OnInit {
  @ViewChild(CommonMaterialTableComponent) table!: CommonMaterialTableComponent;
  
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  
  apiUrl = `${environment.apiUrl}/appointments`;
  
  displayedColumns: string[] = [
    'appointment_id',
    'member_name',
    'staff_name',
    'appointment_date',
    'start_time',
    'end_time',
    'purpose',
    'status',
    'branch_name'
  ];
  
  dataSource = new MatTableDataSource<Appointment>([]);
  isLoading = false;
  
  members: Member[] = [];
  staffs: Staff[] = [];
  branches: Branch[] = [];
  
  ngOnInit(): void {
    this.loadData();
    this.loadMembers();
    this.loadStaff();
    this.loadBranches();
  }
  
  loadData(): void {
    this.isLoading = true;
    this.http.get<Appointment[]>(this.apiUrl).subscribe({
      next: (appointments) => {
        // Enrich appointments with names
        const enrichedAppointments = appointments.map(appointment => {
          const member = this.members.find(m => m.id === appointment.member_id);
          const staff = this.staffs.find(s => s.id === appointment.staff_id);
          const branch = this.branches.find(b => b.id === appointment.branch_id);
          
          return {
            ...appointment,
            member_name: member ? `${member.first_name} ${member.last_name}` : 'Unknown',
            staff_name: staff ? `${staff.first_name} ${staff.last_name}` : 'Unknown',
            branch_name: branch ? branch.branch_name : 'Unknown'
          };
        });
        
        this.dataSource.data = enrichedAppointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading appointments', error);
        this.snackBar.open('Error loading appointments', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  loadMembers(): void {
    this.http.get<Member[]>(`${environment.apiUrl}/members`).subscribe({
      next: (members) => {
        this.members = members;
        // Refresh appointments to reflect member names
        if (this.dataSource.data.length > 0) {
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading members', error);
      }
    });
  }
  
  loadStaff(): void {
    this.http.get<Staff[]>(`${environment.apiUrl}/staff`).subscribe({
      next: (staffs) => {
        this.staffs = staffs;
        // Refresh appointments to reflect staff names
        if (this.dataSource.data.length > 0) {
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading staff', error);
      }
    });
  }
  
  loadBranches(): void {
    this.http.get<Branch[]>(`${environment.apiUrl}/library-branches`).subscribe({
      next: (branches) => {
        this.branches = branches;
        // Refresh appointments to reflect branch names
        if (this.dataSource.data.length > 0) {
          this.loadData();
        }
      },
      error: (error) => {
        console.error('Error loading branches', error);
      }
    });
  }
  
  onAddClick(): void {
    const dialogData: CrudDialogData = {
      title: 'Add New Appointment',
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
        this.http.post<Appointment>(this.apiUrl, result.data).subscribe({
          next: () => {
            this.snackBar.open('Appointment added successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error adding appointment', error);
            this.snackBar.open('Error adding appointment', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onEditClick(appointment: Appointment): void {
    const dialogData: CrudDialogData = {
      title: 'Edit Appointment',
      submitButtonText: 'Update',
      action: 'update',
      data: appointment,
      formFields: this.getFormFields()
    };
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.isLoading = true;
        this.http.put<Appointment>(`${this.apiUrl}/${appointment.appointment_id}`, result.data).subscribe({
          next: () => {
            this.snackBar.open('Appointment updated successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error updating appointment', error);
            this.snackBar.open('Error updating appointment', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onViewClick(appointment: Appointment): void {
    const dialogData: CrudDialogData = {
      title: 'View Appointment',
      submitButtonText: 'Close',
      action: 'view',
      data: appointment,
      formFields: this.getFormFields()
    };
    
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });
  }
  
  onDeleteClick(appointment: Appointment): void {
    const dialogData: CrudDialogData = {
      title: 'Delete Appointment',
      submitButtonText: 'Delete',
      action: 'delete',
      data: appointment,
      formFields: [
        {
          name: 'confirmation',
          label: 'Are you sure you want to delete this appointment?',
          type: 'text',
          disabled: true,
          value: `Appointment on ${appointment.appointment_date} from ${appointment.start_time} to ${appointment.end_time}`
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
        this.http.delete(`${this.apiUrl}/${appointment.appointment_id}`).subscribe({
          next: () => {
            this.snackBar.open('Appointment deleted successfully', 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error deleting appointment', error);
            this.snackBar.open('Error deleting appointment', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
  
  onRefresh(): void {
    this.loadData();
  }
  
  getFormFields(): DialogFieldConfig[] {
    return [
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
        name: 'staff_id',
        label: 'Staff',
        type: 'select',
        required: true,
        options: this.staffs.map(staff => ({
          value: staff.id,
          label: `${staff.first_name} ${staff.last_name}`
        }))
      },
      {
        name: 'appointment_date',
        label: 'Appointment Date',
        type: 'date',
        required: true
      },
      {
        name: 'start_time',
        label: 'Start Time',
        type: 'time',
        required: true
      },
      {
        name: 'end_time',
        label: 'End Time',
        type: 'time',
        required: true
      },
      {
        name: 'purpose',
        label: 'Purpose',
        type: 'text',
        required: true,
        maxLength: 255
      },
      {
        name: 'notes',
        label: 'Notes',
        type: 'textarea'
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Scheduled', label: 'Scheduled' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Cancelled', label: 'Cancelled' },
          { value: 'Rescheduled', label: 'Rescheduled' }
        ]
      },
      {
        name: 'branch_id',
        label: 'Branch',
        type: 'select',
        required: true,
        options: this.branches.map(branch => ({
          value: branch.id,
          label: branch.branch_name
        }))
      }
    ];
  }
}