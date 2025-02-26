import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  formGroup : FormGroup;

  constructor(formBuilder : FormBuilder){
    this.formGroup = formBuilder.group(
      {
        name: [{value: '', disabled: true},Validators.required],
        email: [{value: '', disabled: true},Validators.required],
        phone: [{value: '', disabled: true},Validators.required],
        status: [{value: '', disabled: true},Validators.required],
        role: [{value: '', disabled: true},Validators.required]
      }
    );
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      name:"john Doe",
      email: "hello@email.com",
      phone: "123456789",
      status: "Active",
      role: "Admin"
    })
    this.formGroup.enable();
    this.formGroup.disable();
  }
}
