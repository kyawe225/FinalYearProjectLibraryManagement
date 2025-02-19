import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PublisherCreate } from '../model/publisher';
import { BookCreate } from '../model/book';

@Injectable({
  providedIn: 'root'
})
export class PublisherService {
  private baseUrl = environment.apiUrl;
  private baseUri = "publisher";
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

  create(model: PublisherCreate) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  update(id: string, model: PublisherCreate) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }

}
