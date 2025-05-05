import { Component } from '@angular/core';
import { Book } from '../../model/book';
import { News } from '../../model/news';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { author } from '../../model/author';
import { Publisher } from '../../model/publisher';
import { book_category } from '../../model/book_category';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-main-landing',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './main-landing.component.html',
  styleUrl: './main-landing.component.scss'
})
export class MainLandingComponent {
  // Featured books
  featuredBooks: Book[] = [];
  currentBookIndex = 0;

  // News items
  newsItems: News[] = [];

  // Statistics
  totalBooks = 0;
  totalMembers = 0;
  upcomingEvents = 0;
  totalBranches = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadFeaturedBooks();
    this.loadNews();
    this.loadStatistics();
  }

  /**
   * Load featured books from the API
   */
  loadFeaturedBooks(): void {
    // You would typically fetch this from your API
    // For now, using sample data
    // this.http.get<Book[]>(`${environment.apiUrl}/books/featured`)
    //   .subscribe({
    //     next: (books) => {
    //       this.featuredBooks = books;
    //     },
    //     error: (error) => {
    //       console.error('Error fetching featured books', error);
    //       // Provide fallback sample data if API fails
    //       this.loadSampleBooks();
    //     }
    //   });
  }

  /**
   * Load news items from the API
   */
  loadNews(): void {
    // this.http.get<News[]>(`${environment.apiUrl}/news`)
    //   .subscribe({
    //     next: (news) => {
    //       this.newsItems = news.slice(0, 3); // Limit to 3 most recent items
    //     },
    //     error: (error) => {
    //       console.error('Error fetching news', error);
    //       // Provide fallback sample data if API fails
    //       this.loadSampleNews();
    //     }
    //   });
  }

  /**
   * Load statistics from the API
   */
  loadStatistics(): void {
    // this.http.get<any>(`${environment.apiUrl}/statistics`)
    //   .subscribe({
    //     next: (stats) => {
    //       this.totalBooks = stats.totalBooks;
    //       this.totalMembers = stats.totalMembers;
    //       this.upcomingEvents = stats.upcomingEvents;
    //       this.totalBranches = stats.totalBranches;
    //     },
    //     error: (error) => {
    //       console.error('Error fetching statistics', error);
    //       // Provide fallback sample data if API fails
    //       this.loadSampleStatistics();
    //     }
    //   });
  }

  /**
   * Navigate to the next book in the carousel
   */
  nextBook(): void {
    if (this.currentBookIndex < this.featuredBooks.length - 1) {
      this.currentBookIndex++;
    } else {
      this.currentBookIndex = 0; // Loop back to the first book
    }
  }

  /**
   * Navigate to the previous book in the carousel
   */
  previousBook(): void {
    if (this.currentBookIndex > 0) {
      this.currentBookIndex--;
    } else {
      this.currentBookIndex = this.featuredBooks.length - 1; // Loop to the last book
    }
  }

  /**
   * Load sample book data if API fails
   */
  private loadSampleBooks(): void {
    const coverColors = [
      '#006b5e', // primary
      '#785900', // secondary
      '#9a25ae', // tertiary
      '#914a36'  // neutral
    ];

    const author1: author = {
      author_id: 'AUTH-001',
      first_name: 'Robert',
      last_name: 'Martin',
      biography: 'Robert Cecil Martin is an American software engineer, instructor, and author.',
      date_of_birth: new Date('1952-12-05')
    };

    const authorGangOfFour: author[] = [
      {
        author_id: 'AUTH-002',
        first_name: 'Erich',
        last_name: 'Gamma',
        biography: 'Computer scientist known for Design Patterns and Eclipse',
        date_of_birth: new Date('1961-03-13')
      },
      {
        author_id: 'AUTH-003',
        first_name: 'Richard',
        last_name: 'Helm',
        biography: 'Object-oriented design specialist',
        date_of_birth: new Date()
      },
      {
        author_id: 'AUTH-004',
        first_name: 'Ralph',
        last_name: 'Johnson',
        biography: 'Computer scientist at University of Illinois',
        date_of_birth: new Date('1955-11-01')
      },
      {
        author_id: 'AUTH-005',
        first_name: 'John',
        last_name: 'Vlissides',
        biography: 'Software engineer at IBM Research',
        date_of_birth: new Date('1961-08-02')
      }
    ];

    const authorPragProg: author[] = [
      {
        author_id: 'AUTH-006',
        first_name: 'Andrew',
        last_name: 'Hunt',
        biography: 'Co-author of The Pragmatic Programmer and co-founder of The Pragmatic Bookshelf',
        date_of_birth: new Date()
      },
      {
        author_id: 'AUTH-007',
        first_name: 'David',
        last_name: 'Thomas',
        biography: 'Co-author of The Pragmatic Programmer and co-founder of The Pragmatic Bookshelf',
        date_of_birth: new Date()
      }
    ];

    // Mock publisher data
    const publisher1: Publisher = {
      id: 'PUB-001',
      name: 'Addison-Wesley Professional',
      address: '1234 Publisher Lane, Boston, MA',
      phone_number: '555-123-4567',
      email: 'info@addisonwesley.com',
      description: 'A leading publisher of computer science and engineering books.',
      createdDate: new Date('2025-01-01'),
      updatedDate: new Date('2025-01-01'),
    };

    const publisher2: Publisher = {
      id: 'PUB-002',
      name: 'Pearson Education',
      address: '5678 Learning Street, New York, NY',
      phone_number: '555-987-6543',
      email: 'info@pearson.com',
      description: 'A leading publisher of computer science and engineering books.',
      createdDate: new Date('2025-01-01'),
      updatedDate: new Date('2025-01-01'),
    };

    // Mock category data
    const programmingCategory: book_category = {
      id: 'CAT-001',
      name: 'Programming',
      description: 'Books about programming languages and software development'
    };

    const webDevCategory: book_category = {
      id: 'CAT-002',
      name: 'Web Development',
      parent_category: programmingCategory,
      description: 'Books about web development technologies'
    };

    this.featuredBooks = [
      {
        book_id: 'BOOK-001',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        isbn: '9780132350884',
        publication_date: new Date('2008-08-01'),
        publisher_id: 'PUB-001',
        category_id: 'CAT-001',
        total_copies: 5,
        available_copies: 3,
        location_in_library: 'Section A, Shelf 3',
        added_date: new Date('2024-01-15'),
        status: 'Available',
        edition: 'First Edition',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way.',
        authors: [author1],
        author_names: 'Robert C. Martin',
        publisher: publisher1,
        category: programmingCategory
      },
      {
        book_id: 'BOOK-002',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        isbn: '9780201633610',
        publication_date: new Date('1994-11-10'),
        publisher_id: 'PUB-001',
        category_id: 'CAT-001',
        total_copies: 3,
        available_copies: 1,
        location_in_library: 'Section A, Shelf 4',
        added_date: new Date('2024-02-10'),
        status: 'Available',
        edition: 'First Edition',
        description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.',
        authors: authorGangOfFour,
        author_names: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        publisher: publisher1,
        category: programmingCategory
      },
      {
        book_id: 'BOOK-003',
        title: 'The Pragmatic Programmer: Your Journey to Mastery',
        isbn: '9780201616224',
        publication_date: new Date('1999-10-30'),
        publisher_id: 'PUB-002',
        category_id: 'CAT-001',
        total_copies: 4,
        available_copies: 4,
        location_in_library: 'Section A, Shelf 2',
        added_date: new Date('2024-02-15'),
        status: 'Available',
        edition: 'First Edition',
        description: 'The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process--taking a requirement and producing working, maintainable code that delights its users.',
        authors: authorPragProg,
        author_names: 'Andrew Hunt, David Thomas',
        publisher: publisher2,
        category: programmingCategory
      }
    ];
  }

  /**
   * Load sample news data if API fails
   */
  private loadSampleNews(): void {
    const currentDate = new Date().toISOString();

    this.newsItems =
      [
        {
          id: 'N_01JQNCXEG2PW7XTX75105HC82T',
          news_id: 'N_01JQNCXEG2PW7XTX75105HC82T',
          title: 'New digital resources added to library collection',
          content: 'We have added over 1,000 new e-books and digital journals to our collection, covering a wide range of topics including computer science, engineering, mathematics, and more. Students can now access these resources through our online portal.',
          publication_date: new Date('2025-04-20'),
          expiry_date: new Date('2025-05-20'),
          published_by_id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'High',
          visibility: 'Public',
          category: 'Announcement',
          image_url: '/assets/images/news/digital-resources.jpg',
        },
        {
          id: 'N_02JQNCXEG3SQ8YUY86216ID93U',
          news_id: 'N_02JQNCXEG3SQ8YUY86216ID93U',
          title: 'Extended library hours during exam period',
          content: 'The library will remain open until midnight during the upcoming examination period from May 10 to May 25. Additionally, the study rooms will be available for reservation 24 hours in advance to accommodate the increased demand.',
          publication_date: new Date('2025-04-15'),
          expiry_date: new Date('2025-05-25'),
          published_by_id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
          branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
          importance_level: 'Medium',
          visibility: 'Public',
          category: 'Service Update',
          image_url: '/assets/images/news/library-hours.jpg',
        }
      ];
  }

  /**
   * Load sample statistics if API fails
   */
  private loadSampleStatistics(): void {
    this.totalBooks = 5000;
    this.totalMembers = 1200;
    this.upcomingEvents = 5;
    this.totalBranches = 3;
  }
}
