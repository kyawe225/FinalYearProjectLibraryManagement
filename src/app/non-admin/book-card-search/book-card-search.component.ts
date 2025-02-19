import { Component, input, InputSignal } from '@angular/core';
import { Book } from '../../model/book';

@Component({
  selector: 'app-book-card-search',
  imports: [],
  templateUrl: './book-card-search.component.html',
  styleUrl: './book-card-search.component.scss'
})
export class BookCardSearchComponent {
  book : InputSignal<Book> = input.required<Book>();
}
