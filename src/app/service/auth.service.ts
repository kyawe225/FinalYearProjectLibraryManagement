import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Login, Register } from '../model/auth';
import { BehaviorSubject } from 'rxjs';
import { AuthenticatedUser } from '../model/authenticated-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private baseUri = "auth";
  private httpClient: HttpClient;
  private currentUser = new BehaviorSubject<AuthenticatedUser | null>(null);

  private token = new BehaviorSubject<string>("");
  currentData = this.token;
  currentUserData = this.currentUser;

  isAuthenticated = new BehaviorSubject<boolean>(false);

  private expireTime = new BehaviorSubject<Date | null>(new Date());
  currentExpireTime = this.expireTime.asObservable();

  constructor(http: HttpClient) {
    this.httpClient = http;
    this.updateToken(localStorage.getItem("token") || "");
    this.updateExpireTime(new Date(localStorage.getItem("expireTime") || ""));
    this.isAuthenticated.next(this.token.value != "" && this.token.value != null);
    this.currentUser.next(JSON.parse(localStorage.getItem("currentUser") || "null"));  
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
    localStorage.removeItem("currentUser");
    this.currentUser.next(null); 
    this.updateToken("");
    this.updateExpireTime(null);
    this.isAuthenticated.next(false);
  }

  updateToken(token: string,data?:AuthenticatedUser){
    localStorage.setItem("token",token);
    this.token.next(token);
    if(token != "" && token != null){
      this.isAuthenticated.next(true);
      this.currentUser.next(data ?? null);
    }else{
      this.isAuthenticated.next(false);
      this.currentUser.next(null);
    }
  }
  updateExpireTime(time:Date | null){
    console.log(time)
    localStorage.setItem("expireTime",time?.toString() ?? "");
    this.expireTime.next(time);
  }
}
