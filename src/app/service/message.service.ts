import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private dataSource = new BehaviorSubject<any>(null); // Default value can be null or an initial object
  currentData = this.dataSource.asObservable();

  constructor() {}

  updateData(data: any) {
    this.dataSource.next(data); // Update data for subscribers
  }
}
