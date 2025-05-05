import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MediaMatcher } from '@angular/cdk/layout';
import { MenuItem } from '../model/layout/menu-item';
import { Subscription } from 'rxjs';
import { SidebarService } from '../service/sidebar.service';
import { NonAdminSidebarDataService } from '../service/non-admin-sidebar-data.service';

@Component({
  selector: 'app-librarian',
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './librarian.component.html',
  styleUrl: './librarian.component.scss'
})
export class LibrarianComponent {
   // Sidebar state
    isOpen = true;
    private subscriptions = new Subscription();
    activeMenuItem: string | null = null;
  
    // Media query for responsive design
    private mobileQuery: MediaQueryList | null = null;
    private mobileQueryListener: () => void;
  
    isAuthenticated: boolean = false;
    currentRoute: string = "";
    menuItems = signal<MenuItem[] | null>(null);
  
    constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute, private sidebar: SidebarService, private media: MediaMatcher, private menuItemsService: NonAdminSidebarDataService) {
      this.mobileQuery = this.media.matchMedia('(max-width: 768px)');
      this.mobileQueryListener = () => {
        this.checkScreenSize();
      };
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
      this.menuItems.set(this.menuItemsService.getSidebarData("librarian"));
  
      // Set initial sidebar state based on screen size
      this.checkScreenSize();
    }
  
    ngOnInit(): void {
      // Track active route to highlight active menu item
      // this.subscriptions.add(
      //   this.router.events.pipe(
      //     filter(event => event instanceof NavigationEnd)
      //   ).subscribe(() => {
      //     this.setActiveMenuItem();
      //   })
      // );
  
      // Set initial active menu item
      this.setActiveMenuItem();
  
      if (this.route.firstChild?.snapshot == undefined || this.route.firstChild == null) {
        this.currentRoute = this.route.snapshot.url.join('/');
        console.log("this")
      } else {
        console.log(this.route.firstChild);
        this.currentRoute = this.route.firstChild.snapshot.url.join('/');
        console.log("firstchild")
      }
    }
  
    //#region aigenerated part
  
    ngOnDestroy(): void {
      // Clean up subscriptions and event listeners
      this.subscriptions.unsubscribe();
      this.mobileQuery?.removeEventListener('change', this.mobileQueryListener);
    }
  
    toggleSidebar(): void {
      this.isOpen = !this.isOpen;
    }
  
    toggleSubMenu(menuItem: MenuItem, event: Event): void {
      event.preventDefault();
      event.stopPropagation();
      menuItem.expanded = !menuItem.expanded;
    }
  
    closeSidebarOnMobile(): void {
      if (this.isMobile()) {
        this.isOpen = false;
      }
    }
  
    isMobile(): boolean {
      return this.mobileQuery?.matches ?? false;
    }
  
    // Check screen size and set sidebar state accordingly
    private checkScreenSize(): void {
      if (this.mobileQuery?.matches) {
        this.isOpen = false;
      } else {
        this.isOpen = true;
      }
    }
  
    // Determine which menu item should be highlighted based on current route
    private setActiveMenuItem(): void {
      const url = this.router.url;
      this.activeMenuItem = url;
  
      // Expand parent menu items if a child is active
      this.menuItems()?.forEach(item => {
        if (item.children) {
          const hasActiveChild = item.children.some(child =>
            child.route && url.startsWith(child.route));
          item.expanded = hasActiveChild;
        }
      });
    }
  
    //#endregion
  
    logout() {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
}
