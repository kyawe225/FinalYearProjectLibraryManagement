import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { NewsService } from '../../service/news.service';
import { Subscription } from 'rxjs';
import { PaginationRequest } from '../../request/pagination-request';
import { News } from '../../model/news';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [
    
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit, OnDestroy {
  private service : NewsService = inject(NewsService);
  private request : PaginationRequest = {
    page : 1,
    pageSize : 4,
    keywords : new Map<string, string>(),
    filters : new Map<string, string>()
  };

  news = signal<News[]>([]);

  constructor(private router : Router){

  }

  ngOnInit(){
    let sub:Subscription= this.service.getLatest(this.request).subscribe({
      next : (data: any) => {
        console.log(data);
        this.news.set(data.data);
        this.news.set([
          {
            title: "Library Expands Digital Collection",
            content: "Our library now offers thousands of new e-books and audiobooks for members.",
            createdAt: new Date("2025-02-18T10:00:00Z"),
            user: "JohnDoe",
            userId: "user123",
            id: "news001",
            type: "announcement"
          },
        ])
      },
      error: (error:any)=>{
        console.log(error);
        this.news.set([
          {
            title: "Library Expands Digital Collection",
            content: "Our library now offers thousands of new e-books and audiobooks for members.",
            createdAt: new Date("2025-02-18T10:00:00Z"),
            user: "JohnDoe",
            userId: "user123",
            id: "news001",
            type: "announcement"
          },
        ])
      },
      complete:()=>{
        console.log("complete")
        sub.unsubscribe();
      },
    })
  }

  ngOnDestroy(){

  }

  goToSearchPage(){
    this.router.navigateByUrl("/search");
  }
}
