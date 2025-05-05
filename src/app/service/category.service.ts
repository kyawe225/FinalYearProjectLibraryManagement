import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '../model/response-model';
import { book_category, book_category_create } from '../model/book_category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = environment.apiUrl;
  private baseUri = "book";
  private http: HttpClient;


  constructor(http: HttpClient) {
    this.http = http;
  }

  getAll(){
    return this.http.get<ResponseModel<book_category[]>>(this.baseUrl + this.baseUri);
  }

  getDetail(id: string) {
    return this.http.get<ResponseModel<book_category>>(this.baseUrl + this.baseUri + "/" + id);
  }

  create(model: book_category_create) {
    return this.http.post(this.baseUrl + this.baseUri, model);
  }



  update(id: string, model: book_category_create) {
    return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
  }

  delete(id: string) {
    return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
  }

}
