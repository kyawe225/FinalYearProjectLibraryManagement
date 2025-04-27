import { Component, OnInit, signal } from '@angular/core';
import { WishBook } from '../../model/wish-book';
import { WishbookService } from '../../service/wishbook.service';
import { BookCardSearchComponent } from '../../non-admin/book-card-search/book-card-search.component';

@Component({
  selector: 'app-wish-books',
  imports: [
    BookCardSearchComponent
  ],
  templateUrl: './wish-books.component.html',
  styleUrl: './wish-books.component.scss'
})
export class WishBooksComponent implements OnInit {
  wishBooks = signal<WishBook[] | null>(null);

  constructor( private service : WishbookService){

  }

  ngOnInit(): void {
    this.service.getAll().subscribe((data: any) => {
      this.wishBooks.set(data.data);
    });
  }

  
}
