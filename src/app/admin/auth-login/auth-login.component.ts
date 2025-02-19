import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublisherService } from '../../service/publisher.service';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { Login } from '../../model/auth';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-auth-login',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss'
})
export class AuthLoginComponent {
  formGroup : FormGroup;

  constructor(fromBuilder : FormBuilder, private authService : AuthService, private messageService: MessageService,private router: Router){
    this.formGroup = fromBuilder.group(
      {
        password: ['',Validators.required],
        email : ['', [Validators.required,Validators.email]],
      }
    );
  }

  submit(){
    console.log(this.formGroup.value);
    console.log(this.formGroup.valid);
    if(this.formGroup.valid){
      let model : Login = {
        email: this.formGroup.controls['email'].value,
        password: this.formGroup.controls['password'].value,
      }
      let sub = this.authService.login(model).subscribe({
        next : (value)=> {
          console.log(value);
          this.authService.updateToken(value.data.token);
          this.authService.updateExpireTime(value.data.expires);
          this.messageService.updateData("Login Successfully"); 
        },
        error: (error)=>{
          console.log(error);
        },
        complete:()=>{
          sub.unsubscribe();
          this.router.navigateByUrl("/admin/book/list");
        }
      })
    }
  }
}
