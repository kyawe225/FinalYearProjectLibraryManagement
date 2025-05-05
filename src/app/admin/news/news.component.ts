// src/app/admin/news/news-list/news-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { catchError, finalize, of } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { News } from '../../model/news';
import { NewsService } from '../../service/news.service';
import { ConfirmDialogComponent } from '../../non-admin/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    CommonModule, 
    CommonMaterialTableComponent, 
    MatButtonModule, 
    MatIconModule
  ],
  providers: [DatePipe],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsListComponent implements OnInit {
  newsList: News[] = [];
  dataSource = new MatTableDataSource<News>([]);
  displayedColumns: string[] = ['title', 'publication_date', 'expiry_date', 'importance_level', 'visibility'];
  loading = false;
  
  constructor(
    private newsService: NewsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.newsService.getAll()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          this.snackBar.open('Failed to load news', 'Close', { duration: 3000 });
          console.error('Error loading news:', error);
          return of({ status : "NG", data: []});
        })
      )
      .subscribe(response => {
        if (response.status == "OK" && response.data) {
          this.newsList = response.data.map(news => ({
            ...news,
          }));
          this.dataSource = new MatTableDataSource(this.newsList);
        }
      });
  }

  onRowClick(news: News): void {
    this.router.navigate(['/admin/news/view', news.news_id]);
  }

  onAddNews(): void {
    this.router.navigate(['/admin/news/create']);
  }

  onEditNews(news: News): void {
    this.router.navigate(['/admin/news/edit', news.news_id]);
  }

  onDeleteNews(news: News): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete News',
        message: `Are you sure you want to delete "${news.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.newsService.delete(news.news_id)
          .pipe(
            finalize(() => this.loading = false),
            catchError(error => {
              this.snackBar.open('Failed to delete news', 'Close', { duration: 3000 });
              console.error('Error deleting news:', error);
              return of({ status: "NG" , message:"Failed to Delete" });
            })
          )
          .subscribe(response => {
            if (response.status == "OK") {
              this.snackBar.open('News deleted successfully', 'Close', { duration: 3000 });
              this.loadNews();
            } else {
              this.snackBar.open(response.message || 'Failed to delete news', 'Close', { duration: 3000 });
            }
          });
      }
    });
  }

  onRefresh(): void {
    this.loadNews();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return this.datePipe.transform(date, 'MMM d, y') || 'N/A';
  }
}
