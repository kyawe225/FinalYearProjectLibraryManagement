// src/app/core/services/sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();
  private mobileQuery: MediaQueryList;
  

  constructor(private media: MediaMatcher) {
    this.mobileQuery = this.media.matchMedia('(max-width: 768px)');

    // Initialize sidebar state based on screen size
    if (this.mobileQuery.matches) {
      this.isOpenSubject.next(false);
    }

    // Listen for changes in screen size
    this.mobileQuery.addEventListener('change', (e: MediaQueryListEvent) => {
      if (e.matches) {
        this.isOpenSubject.next(false);
      } else {
        this.isOpenSubject.next(true);
      }
    });
  }

  toggle(): void {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  open(): void {
    this.isOpenSubject.next(true);
  }

  close(): void {
    this.isOpenSubject.next(false);
  }

  isMobile(): boolean {
    return this.mobileQuery.matches;
  }
}