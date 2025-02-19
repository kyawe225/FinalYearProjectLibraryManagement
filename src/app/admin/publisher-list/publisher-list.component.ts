import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Publisher } from '../../model/publisher';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../service/message.service';
import { Subscription } from 'rxjs';
import { PublisherService } from '../../service/publisher.service';
import { ResponseModel } from '../../model/response-model';

@Component({
  selector: 'app-publisher-list',
  imports: [
    NgbAlertModule
  ],
  templateUrl: './publisher-list.component.html',
  styleUrl: './publisher-list.component.scss'
})
export class PublisherListComponent {
  datasource = signal<Publisher[]>([]);
  // private modalService = inject(NgbModal);
  receivedData =signal<string>("");
  private sub: Subscription|null = null;

  constructor(private router: Router, private messageService : MessageService, private service : PublisherService) { }

  ngOnInit(): void {
    this.getPublisherList();

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

  private getPublisherList() {
    let sub = this.service.getAll().subscribe({
      next: (value) => {
        console.log(value);
        let temp = value as ResponseModel<Publisher[]>
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
