import { Component, signal } from '@angular/core';
import { WishBook } from '../../model/wish-book';
import { Router } from '@angular/router';
import { User } from '../../model/user';
import { Book } from '../../model/book';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../service/message.service';
import { WishbookService } from '../../service/wishbook.service';
import { Subscription } from 'rxjs';
import { ResponseModel } from '../../model/response-model';

@Component({
  selector: 'app-wishbook-list',
  imports: [
    NgbAlertModule
  ],
  templateUrl: './wishbook-list.component.html',
  styleUrl: './wishbook-list.component.scss'
})
export class WishbookListComponent {
  datasource = signal<WishBook[]>([]);
  // private modalService = inject(NgbModal);
  receivedData =signal<string>("");
  private sub: Subscription|null = null;

  constructor(private router: Router , private messageService: MessageService , private service: WishbookService) { }

  ngOnInit(): void {
    this.getList();

    this.sub = this.messageService.currentData.subscribe((data) => {
     this.showAlert(data)
    });
  }

  private showAlert(data : string){
    this.receivedData.set(data); // Access the shared data
    console.log('Received Data:', this.receivedData);
    setTimeout(()=>{
      this.receivedData.set("");
    },1000)
  }

  private getList() {
    let book = {
      title: "Sample Book Title",
      authors: "Author Name",
      isbn: "123-4567890123",
      publisher: "Sample Publisher",
      publicationYear: 2025,
      genre: "Fiction",
      language: "English",
      pageCount: 350,
      coverImage: "https://example.com/cover.jpg",
      description: "This is a sample description of the book.",
      status: "Available",
      category: "Novel",
      edition: "1st Edition",
      format: "Hardcover",
      dateAdded: new Date("2025-01-06T00:00:00Z"),
      createdAt: new Date("2025-01-06T00:00:00Z"),
      updatedAt: new Date("2025-01-06T00:00:00Z"),
      id: "unique-book-id-12345"
    }
    let user= {
      id: "unique-user-id-12345",
      name: "John Doe",
      email: "johndoe@example.com",
      password: "hashedPassword123",
      phone: "+1234567890",
      roleId: "role-id-67890",
      userType: "Admin",
      userStatus: "Active",
      createdAt: new Date("2025-01-06T00:00:00Z"),
      updatedAt: new Date("2025-01-06T00:00:00Z"),
      role: {
        id: "role-id-67890",
        name: "Administrator",
        description: "User with full access to all resources",
        createdAt: new Date("2025-01-06T00:00:00Z"),
        updatedAt: new Date("2025-01-06T00:00:00Z")
      }
    }
    // this.datasource.set([{id:"1" , userId : "1" , bookId : "2" , updatedAt : new Date() , createdAt : new Date(), book , user}]);
    let sub = this.service.getAll().subscribe({
      next: (value) => {
        console.log(value);
        let temp = value as ResponseModel<WishBook[]>
        this.datasource.set(temp.data);
      },
      error: (error) => {
        console.log(error);
      },
      complete() {
        sub.unsubscribe();
      },
    })
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
