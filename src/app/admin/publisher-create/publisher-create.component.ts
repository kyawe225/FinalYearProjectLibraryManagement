import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { PublisherCreate } from '../../model/publisher';
import { MessageService } from '../../service/message.service';
import { PublisherService } from '../../service/publisher.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-publisher-create',
  imports: [ReactiveFormsModule],
  templateUrl: './publisher-create.component.html',
  styleUrl: './publisher-create.component.scss'
})
export class PublisherCreateComponent {
  formGroup : FormGroup;

  constructor(fromBuilder : FormBuilder, private publisherService : PublisherService, private messageService: MessageService,private router: Router){
    this.formGroup = fromBuilder.group(
      {
        name : ['', Validators.required],
        description : ['', Validators.required],
        phoneNumber : ['', Validators.required],
        email : ['', [Validators.required,Validators.email]],
        address : ['', Validators.required],
      }
    );
  }

  submit(){
    if(this.formGroup.valid){
      let model : PublisherCreate = {
        name: this.formGroup.controls['name'].value,
        description: this.formGroup.controls['description'].value,
        phone_number: this.formGroup.controls['phoneNumber'].value,
        email: this.formGroup.controls['email'].value,
        address: this.formGroup.controls['address'].value,
      }
      let sub = this.publisherService.create(model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Publisher Created Successfully");
        },
        error: (error)=>{
          console.log(error);
        },
        complete:()=>{
          sub.unsubscribe();
          this.router.navigateByUrl("/admin/publisher/list");
        }
      })
    }
  }

}
