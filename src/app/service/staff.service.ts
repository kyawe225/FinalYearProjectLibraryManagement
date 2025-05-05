import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Staff } from '../model/auth';
import { ResponseModel } from '../model/response-model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<ResponseModel<Staff[]>>("http://localhost:8080/api/staffs");
  }
  create(model : Staff){
    return this.http.get<ResponseModel<boolean>>("http://localhost:8080/api/staffs");
  }
  update(staffId: string, model:Staff){
    return this.http.get<ResponseModel<boolean>>("http://localhost:8080/api/staffs");
  }
  delete(staffId:string){
    return this.http.get<ResponseModel<boolean>>("http://localhost:8080/api/staffs");
  }
}
