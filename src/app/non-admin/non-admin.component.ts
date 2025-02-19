import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-non-admin',
  imports: [
    NgbDropdownModule,
    RouterOutlet
  ],
  templateUrl: './non-admin.component.html',
  styleUrl: './non-admin.component.scss'
})
export class NonAdminComponent {

  isAuthenticated : boolean = false;

  constructor(private authService: AuthService, private router: Router){}

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
