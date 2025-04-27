import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../model/book';
import { AuthService } from '../../service/auth.service';
import { BookService } from '../../service/book.service';
import { WishbookService } from '../../service/wishbook.service';
import { WishBookCreateViewModel } from '../../model/wish-book';
import { ResponseModel } from '../../model/response-model';
import {author} from '../../model/author';

@Component({
  selector: 'app-book-detail',
  imports: [],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.scss'
})
export class BookDetailComponent implements OnInit {
  bookId: string | undefined;

  book: Book | undefined;

  // bookSample = {
  //   title: "Sample Book Title",
  //   authors: "Author Name",
  //   isbn: "123-4567890123",
  //   publisher: "Sample Publisher",
  //   publicationYear: 2025,
  //   genre: "Fiction",
  //   language: "English",
  //   pageCount: 350,
  //   coverImage: "https://example.com/cover.jpg",
  //   description: "This is a sample description of the book.",
  //   status: "Available",
  //   category: "Novel",
  //   edition: "1st Edition",
  //   format: "Hardcover",
  //   dateAdded: new Date("2025-01-06T00:00:00Z"),
  //   createdAt: new Date("2025-01-06T00:00:00Z"),
  //   updatedAt: new Date("2025-01-06T00:00:00Z"),
  //   id: "unique-book-id-12345"
  // };

  constructor(private route: ActivatedRoute, private authService: AuthService, private bookService: BookService, private wishBookService : WishbookService) {
    this.bookId = this.route.snapshot.params['id'];
  }
  ngOnInit() {
    this.bookService.getDetail(this.bookId!!).subscribe({
      next: (data: ResponseModel<Book>) => {
        console.log(data);
        this.book = data.data;
        this.book.author_names = this.book?.authors?.flatMap((i:author) => `${i?.first_name} ${i?.last_name}`).join(',') ?? "";
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
    console.log(bookId);
    let model : WishBookCreateViewModel ={
      bookId : bookId
    };
    this.wishBookService.wishCustomer(model).subscribe({
      next: (data: any) => {
        console.log("something")
        console.log(data);
        alert("Book added to wish list successfully");
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
