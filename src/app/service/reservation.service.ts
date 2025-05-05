// src/app/services/reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Reservation, ReservationAdmin, ReservationFilter } from '../model/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = '/api/reservations';

  constructor(private http: HttpClient) {}

  getReservations(filter?: ReservationFilter): Observable<ReservationAdmin[]> {
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.member_id) params.append('member_id', filter.member_id);
      if (filter.book_id) params.append('book_id', filter.book_id);
      if (filter.status) params.append('status', filter.status);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);
      
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }
    
    return this.http.get<ReservationAdmin[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<ReservationAdmin[]>('getReservations', []))
      );
  }

  getReservationById(id: string): Observable<ReservationAdmin> {
    return this.http.get<ReservationAdmin>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ReservationAdmin>('getReservationById'))
      );
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation)
      .pipe(
        catchError(this.handleError<Reservation>('createReservation'))
      );
  }

  updateReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${reservation.id}`, reservation)
      .pipe(
        catchError(this.handleError<Reservation>('updateReservation'))
      );
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteReservation'))
      );
  }

  updateReservationStatus(id: string, status: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(this.handleError<Reservation>('updateReservationStatus'))
      );
  }

  getReservationStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
      .pipe(
        catchError(this.handleError<any>('getReservationStatistics', {}))
      );
  }
  
  convertToLoan(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/convert-to-loan`, {})
      .pipe(
        catchError(this.handleError<any>('convertToLoan'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
  checkUserReservation(userId: string, bookId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check`, { userId, bookId })
      .pipe(
        map(response => response),
        catchError(() => of(false)) // Return false if there's an error
      );
  }
}