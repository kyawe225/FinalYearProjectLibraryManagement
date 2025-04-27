import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Register } from '../../model/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss'
})
export class AuthRegisterComponent {
  formGroup : FormGroup;

  constructor(fromBuilder : FormBuilder, private authService : AuthService, private messageService: MessageService,private router: Router){
    this.formGroup = fromBuilder.group(
      {
        name : ['', Validators.required],
        password : ['', Validators.required],
        email : ['', [Validators.required,Validators.email]],
        confirmPassword : ['', Validators.required],
      }
    );
  }

  submit(){
    if(this.formGroup.valid){
      let model : Register = {
        email: this.formGroup.controls['email'].value,
        password: this.formGroup.controls['password'].value,
        confirm_password: this.formGroup.controls['confirmPassword'].value,
        name: this.formGroup.controls['name'].value,
      }
      this.authService.register(model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Register Successfully");
        },
        error: (error)=>{
          console.log(error);
        },
        complete:()=>{
          this.router.navigateByUrl("/auth/login");
        }
      })
    }
  }
}
