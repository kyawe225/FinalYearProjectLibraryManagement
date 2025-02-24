import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NonAdminLoadingComponent } from '../components/non-admin-loading/non-admin-loading.component';

@Component({
  selector: 'app-non-admin',
  imports: [
    NgbDropdownModule,
    RouterOutlet,
],
  templateUrl: './non-admin.component.html',
  styleUrl: './non-admin.component.scss'
})
export class NonAdminComponent {

  isAuthenticated : boolean = false;
  currentRoute : string = "";

  constructor(public authService: AuthService, private router: Router, private route: ActivatedRoute){
    
  }

  ngOnInit(){
    if(this.route.firstChild?.snapshot == undefined || this.route.firstChild== null){
      this.currentRoute = this.route.snapshot.url.join('/');
      console.log("this")
    }else{
      console.log(this.route.firstChild);
      this.currentRoute = this.route.firstChild.snapshot.url.join('/');
      console.log("firstchild")
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
