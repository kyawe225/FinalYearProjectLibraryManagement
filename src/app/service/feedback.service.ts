import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Feedback } from '../model/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = environment.apiUrl;
  private baseUri = "feedback";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  save(model : Feedback){
    return this.http.post(this.baseUrl + this.baseUri , model); 
  }
}
