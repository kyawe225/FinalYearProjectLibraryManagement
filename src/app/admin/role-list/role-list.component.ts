import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../model/role';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../../service/role.service';
import { MessageService } from '../../service/message.service';
import { Subscription } from 'rxjs';
import { ResponseModel } from '../../model/response-model';

@Component({
  selector: 'app-role-list',
  imports: [
    NgbAlertModule
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent {
  datasource = signal<Role[]>([]);
  // private modalService = inject(NgbModal);
  receivedData =signal<string>("");
  private sub: Subscription|null = null;

  constructor(private router: Router, private service: RoleService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getTodoList();

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

  private getTodoList() {
    // this.datasource.set([{id:"1",name:"",description:"", createdAt : new Date() , updatedAt : new Date()}]);
    let sub = this.service.getAll().subscribe({
      next: (value) => {
        console.log(value);
        let temp = value as ResponseModel<Role[]>
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
    this.router.navigateByUrl("/admin/role/update/"+id);
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
