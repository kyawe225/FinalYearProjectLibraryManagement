import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublisherCreate } from '../../model/publisher';
import { PublisherService } from '../../service/publisher.service';
import { MessageService } from '../../service/message.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-publisher-update',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './publisher-update.component.html',
  styleUrl: './publisher-update.component.scss'
})
export class PublisherUpdateComponent {
  formGroup : FormGroup;
  private id : string = "";

  constructor(fromBuilder : FormBuilder, private publisherService : PublisherService,private messageService: MessageService,private router: Router,private route: ActivatedRoute){
    this.formGroup = fromBuilder.group(
      {
        name : ['', Validators.required],
        description : ['', Validators.required],
        phoneNumber : ['', Validators.required],
        email : ['', [Validators.required,Validators.email]],
        address : ['', Validators.required],
      }
    );

    this.id= this.route.snapshot.params['id'];
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
      let sub = this.publisherService.update(this.id,model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Publisher Updated Successfully");
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
