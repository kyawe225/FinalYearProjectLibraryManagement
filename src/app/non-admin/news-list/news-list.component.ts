import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  imports:[
    CommonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    RouterModule
  ],
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {
  // Dummy data for preview
  allNews: any[] = [];
  filteredNews: any[] = [];
  categories: string[] = [];
  
  // UI state
  loading: boolean = true;
  searchText: string = '';
  selectedCategory: string = '';
  sortOption: string = 'newest';
  
  // Pagination
  pageSize: number = 10;
  currentPage: number = 0;
  totalItems: number = 0;

  constructor(
    // Inject NewsService here when created
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    // This would call the NewsService.getNews() method in a real app
    // For now we'll simulate loading
    this.loading = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Sample data - would come from an API in a real app
      this.allNews = [
        {
          news_id: 'N_01JQNCXEG2PW7XTX75105HC82T',
          title: 'New Books Added to Library Collection',
          content: 'We are pleased to announce that our library has added over 100 new books to our collection this month. The new additions include fiction, non-fiction, academic resources, and children\'s books. Visit us today to check out these exciting new titles!',
          publication_date: new Date('2025-04-03T12:51:24.885+07:00'),
          expiry_date: new Date('2025-04-15T12:51:24.885+07:00'),
          published_by: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'Normal',
          visibility: 'Public',
          category: 'Announcements',
          image_url: 'assets/images/books.jpg'
        },
        {
          news_id: 'N_02JQNCXEG2PW7XTX75105HC82T',
          title: 'Library Hours Extended During Exam Period',
          content: 'To support students during the upcoming exam period, our library will extend its opening hours. From May 1st to May 30th, we will be open from 7:00 AM to 11:00 PM, Monday through Saturday, and 9:00 AM to 9:00 PM on Sundays.',
          publication_date: new Date('2025-04-01T10:30:00.000+07:00'),
          expiry_date: new Date('2025-05-30T23:59:59.000+07:00'),
          published_by: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'Strong',
          visibility: 'Public',
          category: 'Hours',
          image_url: 'assets/images/library-hours.jpg'
        },
        {
          news_id: 'N_03JQNCXEG2PW7XTX75105HC82T',
          title: 'New Research Database Access',
          content: 'We\'re excited to announce that our library now provides access to the ScienceDirect and JSTOR research databases. These resources offer extensive collections of academic journals, books, and primary sources. Students and faculty can access these databases using their library credentials.',
          publication_date: new Date('2025-03-20T14:15:00.000+07:00'),
          expiry_date: null,
          published_by: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'Normal',
          visibility: 'Public',
          category: 'Resources',
          image_url: 'assets/images/database.jpg'
        }
      ];
      
      // Extract categories for filter
      this.categories = Array.from(new Set(this.allNews.map(news => news.category))).filter(Boolean);
      
      // Apply initial filters
      this.applyFilters();
      
      this.loading = false;
    }, 1000);
  }
  
  applyFilters(): void {
    let filtered = [...this.allNews];
    
    // Apply search filter
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchLower) || 
        news.content.toLowerCase().includes(searchLower) ||
        (news.category && news.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(news => news.category === this.selectedCategory);
    }
    
    // Apply sorting
    if (this.sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
    } else if (this.sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.publication_date).getTime() - new Date(b.publication_date).getTime());
    } else if (this.sortOption === 'importance') {
      const importanceOrder = { 'Strong': 0, 'Normal': 1, 'Low': 2 };
      // filtered.sort((a, b) => {
      //   const importanceA = importanceOrder[a.importance_level] || 999;
      //   const importanceB = importanceOrder[b.importance_level] || 999;
      //   return importanceA - importanceB;
      // });
    }
    
    // Update pagination
    this.totalItems = filtered.length;
    
    // Apply pagination
    const startIndex = this.currentPage * this.pageSize;
    this.filteredNews = filtered.slice(startIndex, startIndex + this.pageSize);
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.applyFilters();
  }
}