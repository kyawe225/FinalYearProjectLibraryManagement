import { AfterViewInit, Component, ElementRef, Input, input, OnInit, signal, ViewChild } from '@angular/core';
import { News } from '../../model/news';
import { NewsService } from '../../service/news.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-detail',
  imports: [],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit , AfterViewInit {
  news: News| undefined;
  id = signal<string>('');
  @ViewChild('content')
  content !: ElementRef<HTMLDivElement>;

  constructor(private service : NewsService, private route: ActivatedRoute){

  }

  ngOnInit(){
    
  }

  private getNewsDetail(){
    console.log(this.id())
    this.service.getDetail(this.id()).subscribe({
      next: (data: any) => {
        this.news = data.data;
        this.content.nativeElement.innerHTML = this.news?.content ?? "";
      },
      error: (error:any)=>{
        console.log(error);
      },
      complete: ()=>{
        console.log("complete")
      }
    })
  }
  
  ngAfterViewInit(): void {
    this.id.set(this.route.snapshot.params['id']);
    this.getNewsDetail();
  }
}
