import { Component, OnInit, signal } from '@angular/core';
import { NewsCardComponent } from '../news-card/news-card.component';
import { NewsService } from '../../service/news.service';
import { News } from '../../model/news';

@Component({
  selector: 'app-news-list',
  imports: [
    NewsCardComponent
  ],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent implements OnInit {
  news =signal<News[] | null>(null);
  
  ngOnInit(): void {
    this.getNewsList();
  }

  constructor(private service : NewsService){

  }

  private getNewsList(){
    this.service.getAll().subscribe({
      next: (data: any) => {
        this.news.set(data.data);
      },
      error: (error:any)=>{
        console.log(error);
      },
      complete: ()=>{
        console.log("complete")
      }
    })
  }
}

