// services/book-loans.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';;
import { environment } from '../../environments/environment';
import { BookLoan } from '../model/book-loan';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class BookLoansService {
  private apiUrl = `${environment.apiUrl}/book-loans`;

  constructor(private http: HttpClient) { }

  getBookLoans(): Observable<ResponseModel<BookLoan[]>> {
    return this.http.get<ResponseModel<BookLoan[]>>(this.apiUrl);
  }

  getBookLoanById(id: string): Observable<ResponseModel<BookLoan>> {
    return this.http.get<ResponseModel<BookLoan>>(`${this.apiUrl}/${id}`);
  }

  getMemberBookLoans(memberId: string): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.apiUrl}/member/${memberId}`);
  }

  createBookLoan(bookLoan: Omit<BookLoan, 'loan_id'>): Observable<BookLoan> {
    return this.http.post<BookLoan>(this.apiUrl, bookLoan);
  }

  createBookLoans(memberId: string, bookCopyIds: string[], dueDate: Date, notes?: string): Observable<BookLoan[]> {
    return this.http.post<BookLoan[]>(`${this.apiUrl}/batch`, {
      member_id: memberId,
      book_copy_ids: bookCopyIds,
      due_date: dueDate.toISOString().split('T')[0],
      notes
    });
  }

  returnBookLoan(id: string): Observable<BookLoan> {
    return this.http.patch<BookLoan>(`${this.apiUrl}/${id}/return`, {});
  }

  renewBookLoan(id: string, newDueDate: Date): Observable<BookLoan> {
    return this.http.patch<BookLoan>(`${this.apiUrl}/${id}/renew`, {
      due_date: newDueDate.toISOString().split('T')[0]
    });
  }

  deleteBookLoan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}