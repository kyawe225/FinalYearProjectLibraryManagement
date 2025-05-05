// src/app/services/fine.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Fine, FineFilter } from '../model/latefee';

@Injectable({
  providedIn: 'root'
})
export class FineService {
  private apiUrl = '/api/fines';

  constructor(private http: HttpClient) {}

  getFines(filter?: FineFilter): Observable<Fine[]> {
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.member_id) params.append('member_id', filter.member_id);
      if (filter.loan_id) params.append('loan_id', filter.loan_id);
      if (filter.payment_status) params.append('payment_status', filter.payment_status);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);
      if (filter.min_amount) params.append('min_amount', filter.min_amount.toString());
      if (filter.max_amount) params.append('max_amount', filter.max_amount.toString());
      
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }
    
    return this.http.get<Fine[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<Fine[]>('getFines', []))
      );
  }

  getFineById(id: string): Observable<Fine> {
    return this.http.get<Fine>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Fine>('getFineById'))
      );
  }

  createFine(fine: Fine): Observable<Fine> {
    return this.http.post<Fine>(this.apiUrl, fine)
      .pipe(
        catchError(this.handleError<Fine>('createFine'))
      );
  }

  updateFine(fine: Fine): Observable<Fine> {
    return this.http.put<Fine>(`${this.apiUrl}/${fine.fine_id}`, fine)
      .pipe(
        catchError(this.handleError<Fine>('updateFine'))
      );
  }

  deleteFine(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteFine'))
      );
  }

  recordPayment(id: string, paymentDate: string, amount?: number): Observable<Fine> {
    const payload = {
      payment_date: paymentDate,
      payment_status: 'Paid',
      fine_amount: amount
    };
    
    return this.http.patch<Fine>(`${this.apiUrl}/${id}/payment`, payload)
      .pipe(
        catchError(this.handleError<Fine>('recordPayment'))
      );
  }

  waiveFine(id: string, reason: string): Observable<Fine> {
    return this.http.patch<Fine>(`${this.apiUrl}/${id}/waive`, { reason })
      .pipe(
        catchError(this.handleError<Fine>('waiveFine'))
      );
  }

  calculateFineForLoan(loanId: string): Observable<{ amount: number; days_overdue: number }> {
    return this.http.get<{ amount: number; days_overdue: number }>(`${this.apiUrl}/calculate/${loanId}`)
      .pipe(
        catchError(this.handleError<{ amount: number; days_overdue: number }>('calculateFineForLoan', { amount: 0, days_overdue: 0 }))
      );
  }

  getFineStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
      .pipe(
        catchError(this.handleError<any>('getFineStatistics', {}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}