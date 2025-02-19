import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoanCreateComponent } from '../admin/loan-create/loan-create.component';
import { LoanCreateViewModel } from '../model/loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private baseUrl = environment.apiUrl;
  private baseUri = "loan";
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

  create(model: LoanCreateViewModel) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  update(id: string, model: LoanCreateViewModel) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }
}
