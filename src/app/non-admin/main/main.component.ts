import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookCardSearchComponent } from '../book-card-search/book-card-search.component';
import { NewsService } from '../../service/news.service';
import { Subscription } from 'rxjs';
import { PaginationRequest } from '../../request/pagination-request';
import { News } from '../../model/news';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { author } from '../../model/author';
import { ReservationAdmin } from '../../model/reservation';
import { BookLoan } from '../../model/book-loan';
import { Appointment } from '../../model/appointment';
import { Book } from '../../model/book';
import { EventInfo } from '../../model/event-info';
import { Staff } from '../../model/auth';
import { Branch } from '../../model/branch';
import { Publisher } from '../../model/publisher';
import { book_category } from '../../model/book_category';
import { MatButtonModule } from '@angular/material/button';

export interface NotificationInfo {
  id: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

@Component({
  selector: 'app-main',
  imports: [
    MatCardModule,
    MatIconModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  userName: string = '';
  todayDate: Date = new Date();
  
  // Quick stats
  borrowedBooks: BookLoan[] = [];
  reservedBooks: ReservationAdmin[] = [];
  upcomingAppointments: Appointment[] = [];
  dueBooks: BookLoan[] = [];
  
  // Featured books
  featuredBooks: Book[] = [];
  
  // Upcoming events
  upcomingEvents: EventInfo[] = [
    {
      id: '1',
      name: 'Book Club Meeting: Modern Programming',
      date: '2025-05-02T14:00:00',
      description: 'Join us for a discussion on modern programming paradigms and techniques.'
    },
    {
      id: '2',
      name: 'Workshop: Introduction to Data Science',
      date: '2025-05-10T10:00:00',
      description: 'Learn the basics of data science and analytics in this hands-on workshop.'
    }
  ];
  
  // Notifications
  notifications: NotificationInfo[] = [
    {
      id: '1',
      message: 'Your book "Clean Code" is due in 2 days.',
      date: '2025-04-27T09:30:00',
      type: 'warning',
      read: false
    },
    {
      id: '2',
      message: 'Your appointment with the librarian is confirmed for May 1st at 2:00 PM.',
      date: '2025-04-26T14:20:00',
      type: 'success',
      read: false
    },
    {
      id: '3',
      message: 'The book "JavaScript: The Good Parts" you requested is now available.',
      date: '2025-04-25T11:15:00',
      type: 'info',
      read: true
    }
  ];
  
  // Recent news
  recentNews: News[] = [];

  constructor() { }

  ngOnInit(): void {
    // In a real app, this would come from an authentication service
    this.userName = 'Kyaw Zin Htet';
    
    // Load mock data
    this.loadMockData();
  }
  
  private loadMockData(): void {
    // Mock staff data
    const librarian: Staff = {
      id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
      first_name: 'Kyawe',
      last_name: 'Htet',
      position: 'Librarian',
      department: 'Reference',
      email: 'kyawe@gmail.com',
      phone: '1234561200',
      date_hired: new Date('2025-03-06'),
      username: 'kyawe',
      status: 'active'
    };
    
    // Mock branch data
    const mainBranch: Branch = {
      id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
      branch_name: 'Primary Branch',
      address: 'No 96, mahar thuka street',
      phone: '09254489334',
      email: 'kyawe225@gmail.com',
      manager_id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
      opening_hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
      manager: librarian
    };
    
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
    
    // Mock author data
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
    
    // Mock book data
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
    
    // Mock BookLoan data
    this.borrowedBooks = [
      {
        loan_id: 'LOAN-001',
        book_id: 'BOOK-001',
        member_id: 'MEM_01JQAB6PDRDGY6KRG9R9964GW4',
        date_borrowed: new Date('2025-04-10'),
        due_date: new Date('2025-04-30'),
        date_returned: null,
        status: 'Active',
        fine_amount: 0,
        book: this.featuredBooks[0]
      },
      {
        loan_id: 'LOAN-002',
        book_id: 'BOOK-002',
        member_id: 'MEM_01JQAB6PDRDGY6KRG9R9964GW4',
        date_borrowed: new Date('2025-04-15'),
        due_date: new Date('2025-05-05'),
        date_returned: null,
        status: 'Active',
        fine_amount: 0,
        book: this.featuredBooks[1]
      }
    ];
    
    // Due books (books due within 3 days)
    this.dueBooks = this.borrowedBooks.filter(loan => {
      const dueDate = new Date(loan.due_date);
      const today = new Date();
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0;
    });
    
    // Mock Reservation data
    // this.reservedBooks = [
    //   {
    //     id : 'RES-001',
    //     book_id: 'BOOK-003',
    //     user_id: 'MEM_01JQAB6PDRDGY6KRG9R9964GW4',
    //     Appoint_date: new Date('2025-04-20'),
    //     Approved_date: new Date('2025-04-21'),
    //     Approver: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
    //     Status: 'Approved',
        
    //     // status: 'Active',
    //     // book: this.featuredBooks[2]
    //   }
    // ];
    
    // Mock Appointment data
    this.upcomingAppointments = [
      {
        appointment_id: 'APP-001',
        member_id: 'MEM_01JQAB6PDRDGY6KRG9R9964GW4',
        staff_id: '01JNYJR3PMYKB5ZX7NCS05ZXR3',
        appointment_date: new Date('2025-05-01'),
        start_time: '14:00:00',
        end_time: '14:30:00',
        purpose: 'Research Assistance',
        notes: 'Need help finding resources for my computing project',
        status: 'Scheduled',
        branch_id: 'BR_01JQJHDW6V7J7F8EQCD09628ZA',
        created_date: new Date('2025-04-26'),
        modified_date: new Date('2025-04-26'),
        staff: librarian,
        branch: mainBranch
      }
    ];
    
    // Mock News data
    this.recentNews = [
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
        published_by: librarian,
        branch: mainBranch
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
        published_by: librarian,
        branch: mainBranch
      }
    ];
  }
  
  markAsRead(notification: NotificationInfo): void {
    notification.read = true;
  }
  
  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }
  
  getUnreadCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }
  
  formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  getBorrowedCount(): number {
    return this.borrowedBooks.length;
  }
  
  getReservedCount(): number {
    return this.reservedBooks.length;
  }
  
  getAppointmentsCount(): number {
    return this.upcomingAppointments.length;
  }
  
  getDueSoonCount(): number {
    return this.dueBooks.length;
  }
  
  getAuthorsDisplayName(book: Book): string {
    if (book.author_names) {
      return book.author_names;
    } else if (book.authors && book.authors.length > 0) {
      return book.authors.map(author => `${author.first_name} ${author.last_name}`).join(', ');
    }
    return 'Unknown Author';
  }
  
  getBookCoverUrl(book: Book): string {
    // In a real application, you would have proper book cover images
    // For now, we'll generate a placeholder based on the book ID
    const id = parseInt(book.book_id.replace('BOOK-', ''));
    return `/assets/images/books/cover-${id}.jpg`;
  }
}
