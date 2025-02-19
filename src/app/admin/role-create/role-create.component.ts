import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { PublisherCreate } from '../../model/publisher';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';
import { RoleService } from '../../service/role.service';
import { RoleCreate } from '../../model/role';

@Component({
  selector: 'app-role-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent {
  formGroup : FormGroup;

  constructor(fromBuilder : FormBuilder , private messageService : MessageService, private router: Router , private roleService: RoleService){
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
          this.messageService.updateData("Role Created Successfully"); 
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
