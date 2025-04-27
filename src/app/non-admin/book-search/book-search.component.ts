import { Component } from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { Book } from '../../model/book';
import { BookDetailComponent } from "../book-detail/book-detail.component";
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { BookService } from '../../service/book.service';

@Component({
  selector: 'app-book-search',
  imports: [NgbAccordionModule, BookCardSearchComponent],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.scss'
})
export class BookSearchComponent {
  hasData = false;
  isClosedAdvancedSearch = true;
  books: Book[] | null = null;
  private service : BookService| null = null;

  constructor(service : BookService){
    this.service = service;
  }

  openAdvancedSearch() {
    this.isClosedAdvancedSearch = false;
  }

  closeAdvancedSearch() {
    this.isClosedAdvancedSearch = true;
  }

  getListBooks(){
    console.error(this.service);
    this.service?.getAll().subscribe({
      next: (data: any)=>{
        console.log("something")
      this.books = data.data;
    },
    error :(data: any)=>{
      console.log("this file")
      console.log(data);
    }
  })
  }

  searchBooks() {
    this.getListBooks();

    this.isClosedAdvancedSearch = true;

    // TODO: Implement search books and loading data
  }
}
