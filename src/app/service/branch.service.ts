import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response-model';
import { Branch } from '../model/branch';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
private baseUrl = environment.apiUrl;
  private baseUri = "book";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getAll(){
    return this.http.get<ResponseModel<Branch[]>>(this.baseUrl + this.baseUri);
  }

  getDetail(id: string) {
    return this.http.get<ResponseModel<Branch>>(this.baseUrl + this.baseUri + "/" + id);
  }

  create(model: Branch) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }
  update(id: string, model: Branch) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }
}
