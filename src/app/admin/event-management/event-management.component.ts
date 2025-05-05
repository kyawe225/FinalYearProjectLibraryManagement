import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { BranchService } from '../../service/branch.service';
import { StaffService } from '../../service/staff.service';
import { Branch } from '../../model/branch';
import { Staff } from '../../model/auth';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { EventService } from '../../service/event.service';
import { MatIconModule } from '@angular/material/icon';
import { Events } from '../../model/events';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, CommonMaterialTableComponent, MatIconModule],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent implements OnInit {
  // Services
  private eventService = inject(EventService);
  private branchService = inject(BranchService);
  private staffService = inject(StaffService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Data sources
  dataSource = new MatTableDataSource<Events>([]);
  branches: Branch[] = [];
  staff: Staff[] = [];
  
  // Table configuration
  displayedColumns: string[] = [
    'event_name', 
    'event_type',
    'event_date', 
    'start_time',
    'end_time',
    'branch_name',
    'organizer_name',
    'current_attendees',
    'max_attendees',
    'event_status'
  ];
  loading = false;

  ngOnInit(): void {
    this.loadEvents();
    this.loadBranches();
    this.loadStaff();
  }

  async loadEvents(): Promise<void> {
    this.loading = true;
    try {
      const events = (await firstValueFrom(this.eventService.getAll())).data;
      
      // Add branch and organizer names for display
      events.forEach(event => {
        if (event.branch_id && this.branches.length > 0) {
          const branch = this.branches.find(b => b.id === event.branch_id);
          if (branch) {
            event.branch_name = branch.branch_name;
          }
        }
        
        if (event.organizer_id && this.staff.length > 0) {
          const organizer = this.staff.find(s => s.id === event.organizer_id);
          if (organizer) {
            event.organizer_name = `${organizer.first_name} ${organizer.last_name}`;
          }
        }
      });
      
      this.dataSource.data = events;
    } catch (error) {
      this.showNotification('Error loading events', 'error');
      console.error('Error loading events:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadBranches(): Promise<void> {
    try {
      this.branches = (await firstValueFrom(this.branchService.getAll())).data;
    } catch (error) {
      console.error('Error loading branches:', error);
    }
  }

  async loadStaff(): Promise<void> {
    try {
      this.staff = (await firstValueFrom(this.staffService.getAll())).data;
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  }

  onAddEvent(): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Add New Event',
        submitButtonText: 'Add Event',
        action: 'add',
        formFields: this.getEventFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.createEvent(result.data);
      }
    });
  }

  onEditEvent(event: Events): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Edit Event',
        submitButtonText: 'Update Event',
        action: 'edit',
        data: event,
        formFields: this.getEventFormFields()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.updateEvent(event.event_id, result.data);
      }
    });
  }

  onViewEvent(event: Event): void {
    this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: 'Event Details',
        action: 'view',
        data: event,
        formFields: this.getEventFormFields()
      }
    });
  }

  onDeleteEvent(event: Events): void {
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '400px',
      data: {
        title: 'Delete Event',
        submitButtonText: 'Delete',
        action: 'delete',
        data: event,
        formFields: [
          {
            name: 'confirmation',
            label: `Are you sure you want to delete event "${event}"?`,
            type: 'text',
            readonly: true
          }
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'delete') {
        this.deleteEvent(event.event_id);
      }
    });
  }

  async createEvent(eventData: any): Promise<void> {
    try {
      await firstValueFrom(this.eventService.create(eventData));
      this.showNotification('Event added successfully', 'success');
      this.loadEvents();
    } catch (error) {
      this.showNotification('Error adding event', 'error');
      console.error('Error adding event:', error);
    }
  }

  async updateEvent(eventId: string, eventData: any): Promise<void> {
    try {
      await firstValueFrom(this.eventService.update(eventId, eventData));
      this.showNotification('Event updated successfully', 'success');
      this.loadEvents();
    } catch (error) {
      this.showNotification('Error updating event', 'error');
      console.error('Error updating event:', error);
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await firstValueFrom(this.eventService.delete(eventId));
      this.showNotification('Event deleted successfully', 'success');
      this.loadEvents();
    } catch (error) {
      this.showNotification('Error deleting event', 'error');
      console.error('Error deleting event:', error);
    }
  }

  getEventFormFields(): DialogFieldConfig[] {
    return [
      {
        name: 'event_name',
        label: 'Event Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 255
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea'
      },
      {
        name: 'event_date',
        label: 'Event Date',
        type: 'date',
        required: true,
        value: new Date()
      },
      {
        name: 'start_time',
        label: 'Start Time',
        type: 'text',
        required: true,
      },
      {
        name: 'end_time',
        label: 'End Time',
        type: 'text',
        required: true,
      },
      {
        name: 'branch_id',
        label: 'Branch',
        type: 'select',
        required: true,
        options: this.branches.map(b => ({ value: b.id, label: b.branch_name }))
      },
      {
        name: 'organizer_id',
        label: 'Organizer',
        type: 'select',
        required: true,
        options: this.staff.map(s => ({ value: s.id, label: `${s.first_name} ${s.last_name} (${s.position})` }))
      },
      {
        name: 'max_attendees',
        label: 'Maximum Attendees',
        type: 'number',
        min: 1
      },
      {
        name: 'current_attendees',
        label: 'Current Attendees',
        type: 'number',
        min: 0,
        value: 0
      },
      {
        name: 'registration_required',
        label: 'Registration Required',
        type: 'checkbox',
        value: false
      },
      {
        name: 'event_type',
        label: 'Event Type',
        type: 'select',
        required: true,
        options: [
          { value: 'Workshop', label: 'Workshop' },
          { value: 'Seminar', label: 'Seminar' },
          { value: 'Book Club', label: 'Book Club' },
          { value: 'Reading Session', label: 'Reading Session' },
          { value: 'Exhibition', label: 'Exhibition' },
          { value: 'Other', label: 'Other' }
        ]
      },
      {
        name: 'event_status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { value: 'Upcoming', label: 'Upcoming' },
          { value: 'Ongoing', label: 'Ongoing' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Cancelled', label: 'Cancelled' }
        ],
        value: 'Upcoming'
      }
    ];
  }

  onRefresh(): void {
    this.loadEvents();
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