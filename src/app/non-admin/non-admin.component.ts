import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { NonAdminLoadingComponent } from '../components/non-admin-loading/non-admin-loading.component';
import { SidebarService } from '../service/sidebar.service';
import { CommonModule } from '@angular/common';
// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { NonAdminSidebarDataService } from '../service/non-admin-sidebar-data.service';
import { MenuItem } from '../model/layout/menu-item';

@Component({
  selector: 'app-non-admin',
  imports: [
    NgbDropdownModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule,
    CommonModule,
    RouterModule
],
  templateUrl: './non-admin.component.html',
  styleUrl: './non-admin.component.scss'
})
export class NonAdminComponent implements OnInit {

  userName: string = '';
  isMenuOpen = false;

  constructor() { }

  ngOnInit(): void {
    // In a real app, this would come from an authentication service
    this.userName = 'Kyaw Zin Htet';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    // Implementation for logout functionality
    console.log('Logout clicked');
  }

}
