import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WishBookCreateViewModel } from '../../model/wish-book';
import { WishbookService } from '../../service/wishbook.service';
import { MessageService } from '../../service/message.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wishbook-update',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './wishbook-update.component.html',
  styleUrl: './wishbook-update.component.scss'
})
export class WishbookUpdateComponent {
  formGroup : FormGroup;
  private id : string = "";

  constructor(private formBuilder : FormBuilder, private wishbookService: WishbookService,private messageService: MessageService,private router: Router,private route: ActivatedRoute){
    this.formGroup = this.formBuilder.group({
      userId : ['', Validators.required],
      bookId : ['', Validators.required],
    });
    this.id = this.route.snapshot.params['id'];
  }

  submit(){
    if(this.formGroup.valid){
      let model : WishBookCreateViewModel = {
        userId: this.formGroup.controls['userId'].value,
        bookId: this.formGroup.controls['bookId'].value,
      }
      let sub = this.wishbookService.update(this.id,model).subscribe({
        next : (value)=> {
          console.log(value);
          this.messageService.updateData("Wishbook Updated Successfully"); 
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
