// src/app/services/computer-reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ComputerReservation, ComputerReservationFilter } from '../model/computer-reservation';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComputerReservationService {
  private baseUrl = environment.apiUrl;
  private apiUrl = '/api/computer-reservations';

  constructor(private http: HttpClient) { }

  getComputerReservations(filter?: ComputerReservationFilter): Observable<ComputerReservation[]> {
    let queryParams = '';

    if (filter) {
      const params = new URLSearchParams();
      if (filter.computer_id) params.append('computer_id', filter.computer_id);
      if (filter.member_id) params.append('member_id', filter.member_id);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);
      if (filter.status) params.append('status', filter.status);
      if (filter.branch_id) params.append('branch_id', filter.branch_id);

      queryParams = params.toString() ? `?${params.toString()}` : '';
    }

    return this.http.get<ComputerReservation[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<ComputerReservation[]>('getComputerReservations', []))
      );
  }

  getReservationById(id: string): Observable<ComputerReservation> {
    return this.http.get<ComputerReservation>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ComputerReservation>('getReservationById'))
      );
  }

  createReservation(reservation: ComputerReservation): Observable<ComputerReservation> {
    return this.http.post<ComputerReservation>(this.apiUrl, reservation)
      .pipe(
        catchError(this.handleError<ComputerReservation>('createReservation'))
      );
  }

  updateReservation(reservation: ComputerReservation): Observable<ComputerReservation> {
    return this.http.put<ComputerReservation>(`${this.apiUrl}/${reservation.reservation_id}`, reservation)
      .pipe(
        catchError(this.handleError<ComputerReservation>('updateReservation'))
      );
  }

  deleteReservation(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteReservation'))
      );
  }

  updateReservationStatus(id: string, status: string): Observable<ComputerReservation> {
    return this.http.patch<ComputerReservation>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(this.handleError<ComputerReservation>('updateReservationStatus'))
      );
  }

  getAvailableTimeslots(computerIds: string[], date: string): Observable<any[]> {
    const params = new URLSearchParams();
    params.append('date', date);
    computerIds.forEach(id => params.append('computer_id', id));

    return this.http.get<any[]>(`${this.apiUrl}/available-timeslots?${params.toString()}`)
      .pipe(
        catchError(this.handleError<any[]>('getAvailableTimeslots', []))
      );
  }

  checkOverlap(computerId: string, date: string, startTime: string, endTime: string, reservationId?: string): Observable<boolean> {
    const params = new URLSearchParams();
    params.append('computer_id', computerId);
    params.append('date', date);
    params.append('start_time', startTime);
    params.append('end_time', endTime);
    if (reservationId) params.append('reservation_id', reservationId);

    return this.http.get<{ overlap: boolean }>(`${this.apiUrl}/check-overlap?${params.toString()}`)
      .pipe(
        map(response => response.overlap),
        catchError(this.handleError<boolean>('checkOverlap', false))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}