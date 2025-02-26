import { Component, input, InputSignal } from '@angular/core';
import { Book } from '../../model/book';
import { BookService } from '../../service/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-card-search',
  imports: [],
  templateUrl: './book-card-search.component.html',
  styleUrl: './book-card-search.component.scss'
})
export class BookCardSearchComponent {
  book : InputSignal<Book> = input.required<Book>();

  constructor(private router : Router){
    
  }

  goToDetailLink(id : string){
    this.router.navigateByUrl("/book/detail/"+id);
  }
}
