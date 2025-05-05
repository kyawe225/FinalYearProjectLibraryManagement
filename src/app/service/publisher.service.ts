import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Publisher, PublisherResponse, SinglePublisherResponse } from '../model/publisher';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private apiUrl = `${environment.apiUrl}/publishers`;

  constructor(private http: HttpClient) { }

  // Get all publishers with optional pagination and filtering
  getPublishers(
    page: number = 0, 
    pageSize: number = 10, 
    sortField: string = 'name', 
    sortDirection: string = 'asc', 
    filter: string = ''
  ): Observable<PublisherResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);
    
    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<PublisherResponse>(this.apiUrl, { params });
  }

  // Get a single publisher by ID
  getPublisherById(id: string): Observable<SinglePublisherResponse> {
    return this.http.get<SinglePublisherResponse>(`${this.apiUrl}/${id}`);
  }

  // Create a new publisher
  createPublisher(publisher: Publisher): Observable<SinglePublisherResponse> {
    return this.http.post<SinglePublisherResponse>(this.apiUrl, publisher);
  }

  // Update an existing publisher
  updatePublisher(publisher: Publisher): Observable<SinglePublisherResponse> {
    return this.http.put<SinglePublisherResponse>(`${this.apiUrl}/${publisher.id}`, publisher);
  }

  // Delete a publisher
  deletePublisher(id: string): Observable<SinglePublisherResponse> {
    return this.http.delete<SinglePublisherResponse>(`${this.apiUrl}/${id}`);
  }
}

