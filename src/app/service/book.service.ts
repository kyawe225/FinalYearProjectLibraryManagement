import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Book, BookCreate } from '../model/book';
import { ResponseModel } from '../model/response-model';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = environment.apiUrl;
  private baseUri = "book";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getAll(){
    return this.http.get<ResponseModel<Book[]>>(this.baseUrl + this.baseUri);
  }

  getDetail(id: string) {
    return this.http.get<ResponseModel<Book>>(this.baseUrl + this.baseUri + "/" + id);
  }

  create(model: BookCreate) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }



  update(id: string, model: BookCreate) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }

  getCategories() {
    return this.http.get(this.baseUrl + this.baseUri + "/categories");
  }
  getUserWishlist() {
    return this.http.get(this.baseUrl + this.baseUri + "/wishlist");
  }

  addToWishlist(bookId: string) {
    return this.http.post(this.baseUrl + this.baseUri + "/wishlist", { bookId });
  }
  removeFromWishlist(bookId: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/wishlist/" + bookId);
  }

  /**
   * Get a book by its barcode
   * @param barcode The barcode to look up
   * @returns Observable of book or null if not found
   */
  getBookByBarcode(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/barcode/${barcode}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching book by barcode:', error);
          return of(null);
        })
      );
  }

  /**
   * Get a book by its ISBN
   * @param isbn The ISBN to look up
   * @returns Observable of book or null if not found
   */
  getBookByIsbn(isbn: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/isbn/${isbn}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching book by ISBN:', error);
          return of(null);
        })
      );
  }

  /**
   * Get books by category ID
   * @param categoryId The category ID to filter by
   * @param limit Optional limit of results
   * @returns Observable of books in the category
   */
  getBooksByCategory(categoryId: string, limit?: number): Observable<any[]> {
    let url = `${this.baseUrl}/category/${categoryId}`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error fetching books by category:', error);
          return of([]);
        })
      );
  }

  /**
   * Search books by title, author, or ISBN
   * @param query The search query
   * @param limit Optional limit of results
   * @returns Observable of matching books
   */
  searchBooks(query: string, limit?: number): Observable<any[]> {
    let url = `${this.baseUrl}/search?q=${encodeURIComponent(query)}`;
    if (limit) {
      url += `&limit=${limit}`;
    }
    return this.http.get<any[]>(url)
      .pipe(
        catchError(error => {
          console.error('Error searching books:', error);
          return of([]);
        })
      );
  }

  /**
   * Get number of books checked out today
   * @returns Observable with count of books checked out today
   */
  getTodayCheckouts(): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/stats/today-checkouts`)
      .pipe(
        map(response => response.count),
        catchError(error => {
          console.error('Error fetching today\'s checkouts:', error);
          return of(0);
        })
      );
  }

  /**
   * Get number of books returned today
   * @returns Observable with count of books returned today
   */
  getTodayReturns(): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/stats/today-returns`)
      .pipe(
        map(response => response.count),
        catchError(error => {
          console.error('Error fetching today\'s returns:', error);
          return of(0);
        })
      );
  }

  /**
   * Get number of active users today
   * @returns Observable with count of active users today
   */
  getActiveUsersToday(): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/stats/active-users-today`)
      .pipe(
        map(response => response.count),
        catchError(error => {
          console.error('Error fetching active users:', error);
          return of(0);
        })
      );
  }

  /**
   * Create a new book
   * @param bookData Object with book details
   * @returns Observable of the created book
   */
  createBook(bookData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, bookData)
      .pipe(
        catchError(error => {
          console.error('Error creating book:', error);
          throw error;
        })
      );
  }

  /**
   * Update a book
   * @param bookId ID of the book to update
   * @param bookData Updated book data
   * @returns Observable of the updated book
   */
  updateBook(bookId: string, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${bookId}`, bookData)
      .pipe(
        catchError(error => {
          console.error('Error updating book:', error);
          throw error;
        })
      );
  }

  /**
   * Delete a book
   * @param bookId ID of the book to delete
   * @returns Observable of operation result
   */
  deleteBook(bookId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${bookId}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting book:', error);
          throw error;
        })
      );
  }

  /**
   * Get popular books
   * @param limit Number of books to return
   * @returns Observable of popular books
   */
  getPopularBooks(limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/popular?limit=${limit}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching popular books:', error);
          return of([]);
        })
      );
  }

  /**
   * Get recently added books
   * @param limit Number of books to return
   * @returns Observable of recently added books
   */
  getRecentlyAddedBooks(limit: number = 10): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recent?limit=${limit}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching recent books:', error);
          return of([]);
        })
      );
  }

  /**
   * Get book availability status
   * @param bookId ID of the book to check
   * @returns Observable with availability information
   */
  getBookAvailability(bookId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${bookId}/availability`)
      .pipe(
        catchError(error => {
          console.error('Error fetching book availability:', error);
          return of({ available: false, total_copies: 0, available_copies: 0 });
        })
      );
  }
}
