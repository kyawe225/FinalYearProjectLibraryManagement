import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Login, Register } from '../model/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private baseUri = "auth";
  private httpClient: HttpClient;

  private token = new BehaviorSubject<string>("");
  currentData = this.token.asObservable();

  isAuthenticated = new BehaviorSubject<boolean>(false);

  private expireTime = new BehaviorSubject<Date | null>(new Date());
  currentExpireTime = this.expireTime.asObservable();

  constructor(http: HttpClient) {
    this.httpClient = http;
    this.updateToken(localStorage.getItem("token") || "");
    this.updateExpireTime(new Date(localStorage.getItem("expireTime") || ""));
  }

  register(model : Register){
    return this.httpClient.post<any>(`${this.baseUrl}${this.baseUri}/register`,model);
  }

  login(model : Login){
    return this.httpClient.post<any>(`${this.baseUrl}${this.baseUri}/login`,model);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("expireTime");
    this.updateToken("");
    this.updateExpireTime(null);
    this.isAuthenticated.next(false);
  }

  updateToken(token: string){
    localStorage.setItem("token",token);
    this.token.next(token);
    if(token != "" && token != null){
      this.isAuthenticated.next(true);
    }else{
      this.isAuthenticated.next(false);
    }
  }
  updateExpireTime(time:Date | null){
    console.log(time)
    localStorage.setItem("expireTime",time?.toString() ?? "");
    this.expireTime.next(time);
  }
}
