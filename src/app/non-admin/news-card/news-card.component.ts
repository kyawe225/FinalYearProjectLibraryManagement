import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { News } from '../../model/news';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-card',
  imports: [],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsCardComponent {
  model = input<News | null>(null, { alias: 'news' });

  constructor(private router: Router) {
    console.log(this.model());
  }

  goToNewsDetail(id: string) {
    console.log(this.model());
    console.log(id);
    this.router.navigateByUrl("/news/" + id);
  }
}
