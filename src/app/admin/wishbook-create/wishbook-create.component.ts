import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleCreate } from '../../model/role';
import { WishBookCreateViewModel } from '../../model/wish-book';
import { WishbookService } from '../../service/wishbook.service';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishbook-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './wishbook-create.component.html',
  styleUrl: './wishbook-create.component.scss'
})
export class WishbookCreateComponent {
  formGroup : FormGroup;

  constructor(private formBuilder : FormBuilder, private wishbookService: WishbookService,private messageService: MessageService,private router: Router){
    this.formGroup = this.formBuilder.group({
      userId : ['', Validators.required],
      bookId : ['', Validators.required],
    });
  }

  submit(){
    if(this.formGroup.valid){
      let model : WishBookCreateViewModel = {
        userId: this.formGroup.controls['userId'].value,
        bookId: this.formGroup.controls['bookId'].value,
      }
      let sub = this.wishbookService.create(model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Wishbook Created Successfully"); 
        },
        error: (error)=>{
          console.log(error);
        },
        complete:()=>{
          sub.unsubscribe();
          this.router.navigateByUrl("/admin/wishbook/list");
        }
      })
    }
  }
}
