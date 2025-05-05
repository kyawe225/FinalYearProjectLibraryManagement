import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Appointment } from '../model/reservation';
import { Member } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  /**
   * Get all appointments for a specific member
   * @param memberId The ID of the member
   * @returns Observable of appointments array
   */
  getAppointmentsByMemberId(memberId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/member/${memberId}`);
  }

  /**
   * Get a specific appointment by ID
   * @param id The appointment ID
   * @returns Observable of a single appointment
   */
  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cancel an existing appointment
   * @param id The appointment ID to cancel
   * @returns Observable of the updated appointment
   */
  cancelAppointment(id: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/cancel`, {});
  }

  /**
   * Get appointments with filtering options
   * @param params Optional filter parameters
   * @returns Observable of filtered appointments
   */
  getFilteredAppointments(params: {
    memberId?: string;
    staffId?: string;
    branchId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Observable<Appointment[]> {
    let httpParams = new HttpParams();
    
    if (params.memberId) {
      httpParams = httpParams.set('memberId', params.memberId);
    }
    
    if (params.staffId) {
      httpParams = httpParams.set('staffId', params.staffId);
    }
    
    if (params.branchId) {
      httpParams = httpParams.set('branchId', params.branchId);
    }
    
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    
    if (params.startDate) {
      httpParams = httpParams.set('startDate', params.startDate.toISOString().split('T')[0]);
    }
    
    if (params.endDate) {
      httpParams = httpParams.set('endDate', params.endDate.toISOString().split('T')[0]);
    }
    
    return this.http.get<Appointment[]>(`${this.apiUrl}/filter`, { params: httpParams });
  }

  /**
   * Count appointments by status for a specific member
   * @param memberId The ID of the member
   * @returns Observable with counts by status
   */
  getAppointmentCountsByMember(memberId: string): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.apiUrl}/member/${memberId}/counts`);
  }

  /**
   * Check if a time slot is available for a specific staff member
   * @param staffId The ID of the staff member
   * @param date The appointment date
   * @param startTime The start time
   * @param endTime The end time
   * @returns Observable boolean indicating availability
   */
  checkAvailability(staffId: string, date: Date, startTime: string, endTime: string): Observable<boolean> {
    const params = new HttpParams()
      .set('staffId', staffId)
      .set('date', date.toISOString().split('T')[0])
      .set('startTime', startTime)
      .set('endTime', endTime);
    
    return this.http.get<boolean>(`${this.apiUrl}/check-availability`, { params });
  }


  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }


  getMemberById(id: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  createAppointment(appointment: Omit<Appointment, 'appointment_id' | 'created_date' | 'modified_date'>): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointment);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMemberAppointments(memberId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/member/${memberId}`);
  }
}
