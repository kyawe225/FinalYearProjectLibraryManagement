import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RoleCreate } from '../model/role';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = environment.apiUrl;
  private baseUri = "role";
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

  create(model: RoleCreate) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  update(id: string, model: RoleCreate) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }
}
