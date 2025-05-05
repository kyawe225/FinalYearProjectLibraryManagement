import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  imports:[
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
  newsId: string | null = null;
  newsItem: any = null;
  staff: any = null;
  branch: any = null;
  loading: boolean = true;
  formattedContent: SafeHtml | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sanitizer: DomSanitizer
    // Inject NewsService, StaffService, BranchService when created
  ) { }

  ngOnInit(): void {
    this.newsId = this.route.snapshot.paramMap.get('id');
    if (this.newsId) {
      this.loadNewsDetails(this.newsId);
    } else {
      this.loading = false;
    }
  }

  loadNewsDetails(id: string): void {
    // This would call the NewsService.getNewsById(id) method in a real app
    // For now we'll simulate loading with sample data
    this.loading = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Sample data - would come from an API in a real app
      if (id === 'N_01JQNCXEG2PW7XTX75105HC82T') {
        this.newsItem = {
          news_id: 'N_01JQNCXEG2PW7XTX75105HC82T',
          title: 'New Books Added to Library Collection',
          content: 'We are pleased to announce that our library has added over 100 new books to our collection this month. The new additions include fiction, non-fiction, academic resources, and children\'s books.\n\nThe new titles cover a wide range of subjects including:\n\n- Contemporary fiction by award-winning authors\n- Science and technology publications\n- Historical research materials\n- Educational resources for students\n- Popular graphic novels and manga series\n\nThese books have been carefully selected to meet the diverse interests and needs of our community. Faculty members and student representatives participated in the selection process to ensure the relevance and quality of the additions.\n\nAll new books are now available for borrowing. You can browse the new collection in the "New Arrivals" section near the main entrance or search our online catalog to check availability.\n\nVisit us today to explore these exciting new titles!',
          publication_date: new Date('2025-04-03T12:51:24.885+07:00'),
          expiry_date: new Date('2025-04-15T12:51:24.885+07:00'),
          published_by: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'Normal',
          visibility: 'Public',
          category: 'Announcements',
          image_url: 'assets/images/books.jpg'
        };
        
        // Get associated staff member data
        this.staff = {
          id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          first_name: 'Kyawe',
          last_name: 'Htet',
          position: 'Supervisor',
          department: 'Marketing'
        };
        
        // Get branch data
        this.branch = {
          id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          branch_name: 'Primary Branch',
          address: 'No 96, mahar thuka street',
          phone: '09254489334',
          email: 'kyawe225@gmail.com',
          opening_hours: 'Monday to Friday: 9:00 AM - 6:00 PM, Saturday: 10:00 AM - 4:00 PM'
        };
        
        // Format content with line breaks
        this.formatContent();
      } else {
        // No news found
        this.newsItem = null;
      }
      
      this.loading = false;
    }, 1000);
  }
  
  formatContent(): void {
    if (this.newsItem?.content) {
      // Replace newlines with <br> tags and sanitize the HTML
      const formattedText = this.newsItem.content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/- /g, '• ');
      
      this.formattedContent = this.sanitizer.bypassSecurityTrustHtml('<p>' + formattedText + '</p>');
    }
  }
  
  goBack(): void {
    this.location.back();
  }
}