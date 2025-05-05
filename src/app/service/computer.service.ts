import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ResponseModel } from '../model/response-model';
import { Computer, ComputerFilter } from '../model/computer';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComputerService {
  private apiUrl = environment.apiUrl;
  private baseUri = "computer";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getComputers(filter?: ComputerFilter): Observable<ResponseModel<Computer[]>> {
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.branch_id) params.append('branch_id', filter.branch_id);
      if (filter.computer_type) params.append('computer_type', filter.computer_type);
      if (filter.status) params.append('status', filter.status);
      if (filter.search_term) params.append('search', filter.search_term);
      
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }
    
    return this.http.get<ResponseModel<Computer[]>>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<ResponseModel<Computer[]>>('getComputers', {data : [] , message: "" , status: "yes"}))
      );
  }

  getComputerById(id: string): Observable<Computer> {
    return this.http.get<Computer>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<Computer>('getComputerById'))
      );
  }

  createComputer(computer: Computer): Observable<ResponseModel<Computer>> {
    return this.http.post<ResponseModel<Computer>>(this.apiUrl, computer)
      .pipe(
        catchError(this.handleError<ResponseModel<Computer>>('createComputer'))
      );
  }

  updateComputer(computer: Computer): Observable<ResponseModel<Computer>> {
    return this.http.put<ResponseModel<Computer>>(`${this.apiUrl}/${computer.computer_id}`, computer)
      .pipe(
        catchError(this.handleError<ResponseModel<Computer>>('updateComputer'))
      );
  }

  deleteComputer(id: string): Observable<any> {
    return this.http.delete<ResponseModel<boolean>>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ResponseModel<boolean>>('deleteComputer'))
      );
  }

  updateComputerStatus(id: string, status: string): Observable<ResponseModel<Computer>> {
    return this.http.patch<ResponseModel<Computer>>(`${this.apiUrl}/${id}/status`, { status })
      .pipe(
        catchError(this.handleError<ResponseModel<Computer>>('updateComputerStatus'))
      );
  }

  scheduleComputerMaintenance(id: string, maintenanceDate: string): Observable<ResponseModel<Computer>> {
    return this.http.patch<ResponseModel<Computer>>(`${this.apiUrl}/${id}/maintenance`, { maintenance_date: maintenanceDate })
      .pipe(
        catchError(this.handleError<ResponseModel<Computer>>('scheduleComputerMaintenance'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
