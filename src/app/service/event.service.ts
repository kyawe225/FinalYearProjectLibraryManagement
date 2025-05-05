import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response-model';
import { Events } from '../model/events';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = environment.apiUrl;
  private baseUri = "book";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getAll(){
    return this.http.get<ResponseModel<Events[]>>(this.baseUrl + this.baseUri);
  }

  getDetail(id: string) {
    return this.http.get<ResponseModel<Events>>(this.baseUrl + this.baseUri + "/" + id);
  }

  create(model: Events) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }
  update(id: string, model: Events) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }

}
