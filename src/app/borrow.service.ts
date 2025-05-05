import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from './model/response-model';
import { WishBook } from './model/wish-book';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {

  baseUrl = environment.apiUrl;
  baseUri = "borrow";

  constructor(private http : HttpClient) { }

  borrowBook(bookId : string){
    return  this.http.post<ResponseModel<WishBook>>(this.baseUrl + this.baseUri + bookId, {});
  }
}
