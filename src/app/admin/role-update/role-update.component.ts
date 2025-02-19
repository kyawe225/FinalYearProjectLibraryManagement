import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { RoleCreate } from '../../model/role';

@Component({
  selector: 'app-role-update',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './role-update.component.html',
  styleUrl: './role-update.component.scss'
})
export class RoleUpdateComponent {
  formGroup : FormGroup;

  constructor(fromBuilder : FormBuilder, private roleService: RoleService,private messageService: MessageService,private router: Router){
    this.formGroup = fromBuilder.group(
      {
        name : ['', Validators.required],
        description : ['', Validators.required],
      }
    );
  }

  submit(){
    if(this.formGroup.valid){
      let model : RoleCreate = {
        name: this.formGroup.controls['name'].value,
        description: this.formGroup.controls['description'].value,
      }
      let sub = this.roleService.create(model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Role Updated Successfully"); 
        },
        error: (error)=>{
          console.log(error);
        },
        complete:()=>{
          sub.unsubscribe();
          this.router.navigateByUrl("/admin/role/list");
        }
      })
    }
  }
}
