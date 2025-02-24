import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { NonAdminLoadingComponent } from './components/non-admin-loading/non-admin-loading.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxSpinnerModule, NonAdminLoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librarymanagementfe';
  show = signal(true);

  constructor(service: NgxSpinnerService){
    setTimeout(()=>{
      service.hide();
    })
  }
}
