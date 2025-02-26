import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackService } from '../../service/feedback.service';
import { Feedback } from '../../model/feedback';

@Component({
  selector: 'app-contact-us',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  form !: FormGroup;
  successMessage : string = "";
  error : boolean = false;

  constructor(formBuilder : FormBuilder , private service : FeedbackService){
    this.form = formBuilder.group({
      name: formBuilder.control("", [Validators.required]),
      email: formBuilder.control("",[Validators.required,Validators.email]),
      feedback : formBuilder.control("",[Validators.required])
    });
  }

  save(){
    if(this.form.valid){
      let feedback : Feedback = {
        name: this.form.controls['name'].value,
        email: this.form.controls['email'].value,
        feedback: this.form.controls['feedback'].value,
      }
      this.service.save(feedback).subscribe({
        next : (data : any)=>{
          this.successMessage = data.message;
          this.error=false;
          setTimeout(()=>{
            this.successMessage = ""
            this.error = false;
          }, 3000);
          this.form.patchValue({name : "", email : "", feedback : ""});
          this.form.markAsUntouched();
        },
        error: (err : any) => {
          this.successMessage = "something wrong";
          this.error = true;
          setTimeout(()=>{
            this.successMessage = ""
            this.error = false;
          }, 3000);
        }
      })
    }
  }
}
