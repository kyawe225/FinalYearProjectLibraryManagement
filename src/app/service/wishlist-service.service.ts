import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = environment.apiUrl;
  private baseUri = "wishlist";

  constructor(private readonly http:HttpClient) { }

  checkInWishlist(userId : string,bookId: string) {
    // Logic to check if the book is in the wishlist
    // This is a placeholder implementation. Replace with actual logic.
    return this.http.post<ResponseModel<boolean>>(this.apiUrl+this.baseUri,{book_id : bookId,user_id:userId}); // or true based on the actual check
  }
}
