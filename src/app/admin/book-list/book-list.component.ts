import { Component, signal } from '@angular/core';
import { Book } from '../../model/book';
import { Router } from '@angular/router';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-book-list',
  imports: [
    NgbAlertModule
  ],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  datasource = signal<Book[]>([]);
  // private modalService = inject(NgbModal);
  receivedData =signal<string>("");
  private sub: PushSubscription|null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getTodoList();

    // this.sub = this.dataService.currentData.subscribe((data) => {
    //  this.showAlert(data)
    // });
  }

  private showAlert(data : string){
    this.receivedData.set(data); // Access the shared data
    console.log('Received Data:', this.receivedData);
    setTimeout(()=>{
      this.receivedData.set("");
    },1000)
  }

  private getTodoList() {

    // let book = {
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
    // }

    // this.datasource.set([book]);
    // let sub = this.service.getAll().subscribe({
    //   next: (value) => {
    //     console.log(value);
    //     let temp = value as ResponseModel<Todo[]>
    //     this.datasource.set(temp.data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    //   complete() {
    //     sub.unsubscribe();
    //   },
    // })
  }

  clickUpdateTodo(id : string){
    this.router.navigateByUrl("/todo/update/"+id);
  }

  clickDeleteTodo(id: string) {
    // this.modalService.open(ModalDeleteComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    //   (result) => {
    //     console.log("closed")
    //     if (result) {
    //       this.deleteTodo(id);
    //       this.getTodoList();
    //     }
    //   },
    //   (reason) => {
    //     console.log("dismissed")
    //   },
    // );
    // this.deleteTodo(id);
    // this.getTodoList();
  }

  private deleteTodo(id: number) {
    // let sub = this.service.delete(id.toString()).subscribe({
    //   next: (value) => {
    //     console.log(value)
    //     this.getTodoList();
    //     this.showAlert("Delete Successfully");
    //   },
    //   error: (error) => {
    //     console.log(error)
    //   },
    //   complete: () => {
    //     sub.unsubscribe();
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
