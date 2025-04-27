import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { WishBookCreateViewModel } from '../model/wish-book';

@Injectable({
  providedIn: 'root'
})
export class WishbookService {

  private baseUrl = environment.apiUrl;
  private baseUri = "wishbook";
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

  create(model: WishBookCreateViewModel) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }

  wishCustomer(model: WishBookCreateViewModel) {
    return this.http.post(this.baseUrl + this.baseUri + "/member/wish", model);
  }

  update(id: string, model: WishBookCreateViewModel) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }
}
