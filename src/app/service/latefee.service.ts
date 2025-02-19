import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LatefeeCreateViewModel } from '../model/latefee';

@Injectable({
  providedIn: 'root'
})
export class LatefeeService {
  private baseUrl = environment.apiUrl;
  private baseUri = "latefee";
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

  create(model: LatefeeCreateViewModel) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  update(id: string, model: LatefeeCreateViewModel) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }
}
