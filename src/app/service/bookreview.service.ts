// src/app/services/book-review.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookReview, BookReviewFilter } from '../model/book-review';

@Injectable({
  providedIn: 'root'
})
export class BookReviewService {
  private apiUrl = '/api/book-reviews';

  constructor(private http: HttpClient) {}

  getBookReviews(filter?: BookReviewFilter): Observable<BookReview[]> {
    let queryParams = '';
    
    if (filter) {
      const params = new URLSearchParams();
      if (filter.book_id) params.append('book_id', filter.book_id);
      if (filter.member_id) params.append('member_id', filter.member_id);
      if (filter.rating) params.append('rating', filter.rating.toString());
      if (filter.date_from) params.append('date_from', filter.date_from);
      if (filter.date_to) params.append('date_to', filter.date_to);
      
      queryParams = params.toString() ? `?${params.toString()}` : '';
    }
    
    return this.http.get<BookReview[]>(`${this.apiUrl}${queryParams}`)
      .pipe(
        catchError(this.handleError<BookReview[]>('getBookReviews', []))
      );
  }

  getBookReview(id: string): Observable<BookReview> {
    return this.http.get<BookReview>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<BookReview>('getBookReview'))
      );
  }

  createBookReview(review: BookReview): Observable<BookReview> {
    return this.http.post<BookReview>(this.apiUrl, review)
      .pipe(
        catchError(this.handleError<BookReview>('createBookReview'))
      );
  }

  updateBookReview(review: BookReview): Observable<BookReview> {
    return this.http.put<BookReview>(`${this.apiUrl}/${review.review_id}`, review)
      .pipe(
        catchError(this.handleError<BookReview>('updateBookReview'))
      );
  }

  deleteBookReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError<any>('deleteBookReview'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}