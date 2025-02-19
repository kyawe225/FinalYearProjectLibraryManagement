import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../model/book';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { WishbookService } from '../../service/wishbook.service';
import { WishBookCreateViewModel } from '../../model/wish-book';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  bookId: string | undefined;

  book: Book | undefined;

  constructor(private route: ActivatedRoute, private authService: AuthService, private bookService: BookService, private wishBookService : WishbookService) {
    this.bookId = this.route.snapshot.params['id'];
  }
  ngOnInit() {
    this.bookService.getDetail(this.bookId!!).subscribe({
      next: (data: any) => {
        this.book = data.model;
      },
      error: (error:any)=>{
        console.log(error);
      },
      complete: ()=>{
        console.log("complete")
      }
    })
  }

  get isLoggedIn(){
    return this.authService.isAuthenticated;
  }

  addToWishBook(bookId: string) {
    let model : WishBookCreateViewModel ={
      bookId : bookId
    };
    this.wishBookService.create(model).subscribe({
      next: (data: any) => {
        this.book = data.model;
      },
      error: (error:any)=>{
        console.log(error);
      },
      complete: ()=>{
        console.log("complete")
      }
    })
  }

  borrowBook(bookId: string) {
    alert("Book borrowed successfully");
  }
}
