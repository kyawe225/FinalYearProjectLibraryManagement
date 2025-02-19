import { Component , input } from '@angular/core';

@Component({
  selector: 'app-non-admin-loading',
  imports: [],
  templateUrl: './non-admin-loading.component.html',
  styleUrl: './non-admin-loading.component.scss'
})  
export class NonAdminLoadingComponent {
  show = input(false, { alias: 'show'});
}
