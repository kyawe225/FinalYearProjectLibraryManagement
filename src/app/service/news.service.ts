import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { NewsCreate } from '../model/news';
import { PaginationRequest } from '../request/pagination-request';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private baseUrl = environment.apiUrl;
    private baseUri = "news";
    private http: HttpClient;
  
  
    constructor(http: HttpClient) {
      this.http = http;
    }
  
    getAll() {
      return this.http.get(this.baseUrl + this.baseUri);
    }

    getLatest(request : PaginationRequest){
      return this.http.post(this.baseUrl + this.baseUri +"/latest" , request);
    }
  
    getDetail(id: string) {
      return this.http.get(this.baseUrl + this.baseUri + "/"+ id);
    }
  
    create(model: NewsCreate) {
      return this.http.post(this.baseUrl + this.baseUri, model);
    }
  
    update(id: string, model: NewsCreate) {
      return this.http.put(this.baseUrl + this.baseUri + "/" + id, model)
    }
  
    delete(id: string) {
      return this.http.delete(this.baseUrl + this.baseUri + "/" + id)
    }
}
