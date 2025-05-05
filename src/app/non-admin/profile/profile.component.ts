import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports:[
    CommonModule
  ]
})
export class ProfileComponent implements OnInit {
  isSidebarOpen = signal(false);

  constructor() { }

  ngOnInit(): void {
    // Check screen size on component initialization
    this.checkScreenSize();
    
    // Listen for window resize events
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  // Toggle sidebar visibility
  toggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen);
  }

  // Set sidebar state based on screen size
  private checkScreenSize(): void {
    this.isSidebarOpen.set(window.innerWidth >= 992);
  }
}