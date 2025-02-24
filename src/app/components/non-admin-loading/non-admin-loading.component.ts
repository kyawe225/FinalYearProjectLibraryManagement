import { Component, input, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-non-admin-loading',
  imports: [
    NgxSpinnerModule
  ],
  templateUrl: './non-admin-loading.component.html',
  styleUrl: './non-admin-loading.component.scss'
})
export class NonAdminLoadingComponent implements OnInit {
  show = input<boolean>(false,{alias:'show'});

  constructor(private service : NgxSpinnerService){

  }

  ngOnInit(){
    if(this.show() === true){
      this.service.show();
    }else{
      this.service.hide();
    }
  }
}
