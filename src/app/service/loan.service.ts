import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoanCreateViewModel } from '../model/loan';
import { BookLoan } from '../model/book-loan';
import { Observable } from 'rxjs';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = environment.apiUrl;
  private baseUri = "loan";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getAll() {
    return this.http.get(this.baseUrl + this.baseUri);
  }

  getDetail(id: string) {
    return this.http.get(this.baseUrl + this.baseUri + "/"+ id);
  }

  create(model: LoanCreateViewModel) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  update(id: string, model: LoanCreateViewModel) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }

  getAllLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(this.baseUrl);
  }

  getLoanById(loanId: string): Observable<BookLoan> {
    return this.http.get<BookLoan>(`${this.baseUrl}/${loanId}`);
  }

  getLoansByMemberId(memberId: string): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.baseUrl}/member/${memberId}`);
  }

  getOverdueLoans(): Observable<BookLoan[]> {
    return this.http.get<BookLoan[]>(`${this.baseUrl}/overdue`);
  }

  getOverdueLoansCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/overdue/count`);
  }

  createLoan(loan: Partial<BookLoan>): Observable<BookLoan> {
    return this.http.post<BookLoan>(this.baseUrl, loan);
  }

  returnBook(loanId: string, returnData: { date_returned: Date }): Observable<BookLoan> {
    return this.http.patch<BookLoan>(`${this.baseUrl}/${loanId}/return`, returnData);
  }

  updateLoanStatus(loanId: string, status: string): Observable<BookLoan> {
    return this.http.patch<BookLoan>(`${this.baseUrl}/${loanId}/status`, { status });
  }

  // For handling books grabbed via appointments
  updateLoanForAppointment(appointmentId: string, loanData: Partial<BookLoan>): Observable<BookLoan> {
    return this.http.post<BookLoan>(`${this.baseUrl}/appointment/${appointmentId}`, loanData);
  }

  checkUserLoan(user_id : string, book_id : string){
    return this.http.get<ResponseModel<boolean>>(this.baseUrl + this.baseUri + "/check-user-loan");
  }
}
