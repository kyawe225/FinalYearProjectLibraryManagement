// src/app/services/wish.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { WishBook, WishFilter } from '../model/wish-book';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class WishService {
  private apiUrl = '/api/wishes';

  constructor(private http: HttpClient) {}

  getWishes(filter?: WishFilter): Observable<WishBook[]> {
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.member_id) params.append('member_id', filter.member_id);
      if (filter.book_id) params.append('book_id', filter.book_id);
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);
      
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }
    
    return this.http.get<WishBook[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<WishBook[]>('getWishes', []))
      );
  }

  getWishById(id: string): Observable<WishBook> {
    return this.http.get<WishBook>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<WishBook>('getWishById'))
      );
  }

  createWish(wish: WishBook): Observable<WishBook> {
    return this.http.post<WishBook>(this.apiUrl, wish)
      .pipe(
        catchError(this.handleError<WishBook>('createWish'))
      );
  }

  updateWish(wish: WishBook,id?:string): Observable<WishBook> {
    return this.http.put<WishBook>(`${this.apiUrl}/${id || wish.id}`, wish)
      .pipe(
        catchError(this.handleError<WishBook>('updateWish'))
      );
  }

  deleteWish(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteWish'))
      );
  }

  convertToReservation(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/convert-to-reservation`, {})
      .pipe(
        catchError(this.handleError<any>('convertToReservation'))
      );
  }

  getWishStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
      .pipe(
        catchError(this.handleError<any>('getWishStatistics', {}))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  getMemberWishlist(): Observable<ResponseModel<WishBook[]>> {
    return this.http.get<ResponseModel<WishBook[]>>(`${this.apiUrl}/member`);
  }

  addToWishlist(bookId: string, notes?: string): Observable<ResponseModel<WishBook>> {
    return this.http.post<ResponseModel<WishBook>>(`${this.apiUrl}`, { bookId, notes });
  }

  removeFromWishlist(wishId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${wishId}`);
  }

  updateWishNotes(wishId: string, notes: string): Observable<ResponseModel<WishBook>> {
    return this.http.put<ResponseModel<WishBook>>(`${this.apiUrl}/${wishId}`, { notes });
  }

  checkIfBookInWishlist(bookId: string): Observable<{ inWishlist: boolean, wishId?: string }> {
    return this.http.get<{ inWishlist: boolean, wishId?: string }>(`${this.apiUrl}/check/${bookId}`);
  }
}