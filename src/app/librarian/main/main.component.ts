import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BookService } from '../../service/book.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { PickupnotificationComponent } from '../pickupnotification/pickupnotification.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  // Today's stats
  todayStats = {
    booksCheckedOut: 0,
    booksReturned: 0,
    appointmentsScheduled: 0,
    activeUsers: 0
  };

  // Top 10 scheduled pickups
  scheduledPickups: any[] = [];

  // Loading states
  isLoading = true;
  isRefreshing = false;

  // Destroy subject for unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private bookService: BookService,
    // private reservationService: ReservationService,
    // private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();

    // Auto-refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      this.loadScheduledPickups();
    }, 300000); // 5 minutes
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load today's stats
    this.loadTodayStats();

    // Load scheduled pickups
    this.loadScheduledPickups();
  }

  loadTodayStats(): void {
    // Load books checked out today
    this.bookService.getTodayCheckouts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        count => {
          this.todayStats.booksCheckedOut = count;
        },
        error => {
          console.error('Error loading checked out books:', error);
        }
      );

    // Load books returned today
    this.bookService.getTodayReturns()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        count => {
          this.todayStats.booksReturned = count;
        },
        error => {
          console.error('Error loading returned books:', error);
        }
      );

    // Load appointments scheduled for today
    // this.appointmentService.getTodayAppointments()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(
    //     count => {
    //       this.todayStats.appointmentsScheduled = count;
    //     },
    //     error => {
    //       console.error('Error loading appointments:', error);
    //     }
    //   );

    // Load active users today
    this.bookService.getActiveUsersToday()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        count => {
          this.todayStats.activeUsers = count;
        },
        error => {
          console.error('Error loading active users:', error);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  loadScheduledPickups(): void {
    this.isRefreshing = true;

    // this.reservationService.getTopScheduledPickups(10)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(
    //     pickups => {
    //       this.scheduledPickups = pickups;
    //       this.isRefreshing = false;

    //       // Show notification if there are new pickups
    //       if (pickups.length > 0 && !this.isLoading) {
    //         this.showPickupNotification(pickups[0]);
    //       }
    //     },
    //     error => {
    //       console.error('Error loading scheduled pickups:', error);
    //       this.isRefreshing = false;
    //     }
    //   );
  }

  showPickupNotification(pickup: any): void {
    this.snackBar.openFromComponent(PickupnotificationComponent, {
      data: pickup,
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['pickup-notification']
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  navigateToBookReturn(): void {
    this.router.navigate(['/librarian/book-return']);
  }

  navigateToBookCheckout(): void {
    this.router.navigate(['/librarian/book-checkout']);
  }

  navigateToAppointments(): void {
    this.router.navigate(['/librarian/appointments']);
  }

  navigateToMembers(): void {
    this.router.navigate(['/librarian/members']);
  }
}
