import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author, AuthorRequest, AuthorResponse, AuthorsResponse } from '../model/author';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response-model';
import { author } from '../model/author';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private http : HttpClient) { }

  getAll(){
    return this.http.get<ResponseModel<author[]>>("http://localhost:8080/api/book/authors");
  }

  private apiUrl = `${environment.apiUrl}/authors`;


  getAuthors(): Observable<AuthorsResponse> {
    return this.http.get<AuthorsResponse>(this.apiUrl);
  }

  getAuthorById(id: string): Observable<AuthorResponse> {
    return this.http.get<AuthorResponse>(`${this.apiUrl}/${id}`);
  }

  createAuthor(author: AuthorRequest): Observable<AuthorResponse> {
    return this.http.post<AuthorResponse>(this.apiUrl, author);
  }

  updateAuthor(id: string, author: AuthorRequest): Observable<AuthorResponse> {
    return this.http.put<AuthorResponse>(`${this.apiUrl}/${id}`, author);
  }

  deleteAuthor(id: string): Observable<AuthorResponse> {
    return this.http.delete<AuthorResponse>(`${this.apiUrl}/${id}`);
  }

}
