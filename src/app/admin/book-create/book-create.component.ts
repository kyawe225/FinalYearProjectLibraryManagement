import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../service/book.service';
import { BookCreate } from '../../model/book';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-create',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './book-create.component.html',
  styleUrl: './book-create.component.scss'
})
export class BookCreateComponent {
  formGroup : FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService, private bookService: BookService, private router: Router){
    this.formGroup = this.fb.group(
      {
        title: ['', Validators.required],
        authors: ['', Validators.required],
        isbn: ['', Validators.required],
        publisher: ['', Validators.required],
        publicationYear: [null, [Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear())]],
        genre: ['', Validators.required],
        language: ['', Validators.required],
        pageCount: [null, [Validators.required, Validators.min(1)]],
        coverImage: ['', Validators.required],
        description: ['', Validators.required],
        status: ['', Validators.required],
        category: ['', Validators.required],
        edition: ['', Validators.required],
        format: ['', Validators.required],
        dateAdded: [new Date(), Validators.required],
        createdAt: [new Date(), Validators.required],
        updatedAt: [new Date(), Validators.required],
        id: ['', Validators.required]
      }
    )
  }

  onSubmit(){
    if(this.formGroup.valid){
      // let model : BookCreate = {
      //   title: this.formGroup.controls['title'].value,
      //   authors: this.formGroup.controls['authors'].value,
      //   isbn: this.formGroup.controls['isbn'].value,
      //   publisher: this.formGroup.controls['publisher'].value,
      //   publicationYear: this.formGroup.controls['publicationYear'].value,
      //   genre: this.formGroup.controls['genre'].value,
      //   language: this.formGroup.controls['language'].value,
      //   pageCount: this.formGroup.controls['pageCount'].value,
      //   coverImage: this.formGroup.controls['coverImage'].value,
      //   description: this.formGroup.controls['description'].value,
      //   status: this.formGroup.controls['status'].value,
      //   category: this.formGroup.controls['category'].value,
      //   edition: this.formGroup.controls['edition'].value,
      //   format: this.formGroup.controls['format'].value,
      //   dateAdded: this.formGroup.controls['dateAdded'].value,
      // }
      // let sub = this.bookService.create(model).subscribe({
      //   next : (value)=> {
      //     console.log(value);
      //     this.messageService.updateData("Book Created Successfully"); 
      //   },
      //   error: (error)=>{
      //     console.log(error);
      //   },
      //   complete:()=>{
      //     sub.unsubscribe();
      //     this.router.navigateByUrl("/todo/list");
      //   }
      // })
    }
  }
}
