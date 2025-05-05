import { Injectable } from '@angular/core';
import { MenuItem } from '../model/layout/menu-item';

@Injectable({
  providedIn: 'root'
})
export class NonAdminSidebarDataService {
  private librarian_menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/librarian/dashboard',
    },
    {
      title: 'Book Management',
      icon: 'menu_book',
      expanded: false,
      children: [
        {
          title: 'All Books',
          icon: 'library_books',
          route: '/librarian/books',
        },
        {
          title: 'Add Book',
          icon: 'add_circle',
          route: '/librarian/books/add',
        },
        {
          title: 'Categories',
          icon: 'category',
          route: '/librarian/categories',
        }
      ]
    },
    {
      title: 'Circulation',
      icon: 'swap_horiz',
      expanded: false,
      children: [
        {
          title: 'Issue Book',
          icon: 'book',
          route: '/librarian/circulation/issue',
        },
        {
          title: 'Return Book',
          icon: 'assignment_return',
          route: '/librarian/circulation/return',
        },
        {
          title: 'Current Loans',
          icon: 'bookmark',
          route: '/librarian/circulation/loans',
        },
        {
          title: 'Overdue Books',
          icon: 'schedule',
          route: '/librarian/circulation/overdue',
        }
      ]
    },
    {
      title: 'Appointments',
      icon: 'event',
      route: '/librarian/appointments',
      
    },
    {
      title: 'Fines',
      icon: 'payments',
      route: '/librarian/fines',
      
    },
    {
      title: 'Members',
      icon: 'people',
      route: '/librarian/members',
      
    },
    {
      title: 'Reports',
      icon: 'assessment',
      route: '/librarian/reports',
      
    }
  ]

  private admin_menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      title: 'Books Management',
      icon: 'menu_book',
      expanded: false,
      children: [
        { title: 'Books', icon: 'book', route: '/admin/books' },
        { title: 'Categories', icon: 'category', route: '/admin/categories' },
        { title: 'Authors', icon: 'person', route: '/admin/authors' },
        { title: 'Publishers', icon: 'business', route: '/admin/publishers' }
      ]
    },
    {
      title: 'Library Operations',
      icon: 'local_library',
      expanded: false,
      children: [
        { title: 'Book Loans', icon: 'receipt_long', route: '/admin/book-loans' },
        { title: 'Reservations', icon: 'bookmark', route: '/admin/reservations' },
        { title: 'Fines', icon: 'attach_money', route: '/admin/fines' },
        { title: 'Appointments', icon: 'event', route: '/admin/appointments' }
      ]
    },
    {
      title: 'User Management',
      icon: 'people',
      expanded: false,
      children: [
        { title: 'Members', icon: 'person', route: '/admin/members' },
        { title: 'Staff', icon: 'badge', route: '/admin/staff' }
      ]
    },
    {
      title: 'Library Resources',
      icon: 'computer',
      expanded: false,
      children: [
        { title: 'Branches', icon: 'apartment', route: '/admin/branches' },
        { title: 'Computers', icon: 'computer', route: '/admin/computers' },
        { title: 'Computer Sessions', icon: 'timer', route: '/admin/computer-sessions' }
      ]
    },
    {
      title: 'Events & Activities',
      icon: 'event_note',
      expanded: false,
      children: [
        { title: 'Events', icon: 'event', route: '/admin/events' },
        // { title: 'Event Registrations', icon: 'how_to_reg', route: '/admin/event-registrations' },
        // { title: 'News', icon: 'campaign', route: '/admin/news' }
      ]
    },
    {
      title: 'User Feedback',
      icon: 'feedback',
      route: '/admin/feedback'
    },
    {
      title: 'Reports',
      icon: 'bar_chart',
      route: '/admin/reports'
    },
    // {
    //   title: 'Settings',
    //   icon: 'settings',
    //   route: '/admin/settings'
    // }
  ];

  private non_admin_menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      title: 'Book Management',
      icon: 'menu_book',
      expanded: false,
      children: [
        { title: 'All Books', icon: 'library_books', route: '/books' },
        { title: 'Add Book', icon: 'add_circle', route: '/books/add' },
        { title: 'Categories', icon: 'category', route: '/books/categories' },
        { title: 'Authors', icon: 'person', route: '/books/authors' },
        { title: 'Publishers', icon: 'business', route: '/books/publishers' }
      ]
    },
    {
      title: 'Membership',
      icon: 'people',
      expanded: false,
      children: [
        { title: 'Members', icon: 'group', route: '/members' },
        { title: 'Add Member', icon: 'person_add', route: '/members/add' }
      ]
    },
    {
      title: 'Circulation',
      icon: 'sync',
      expanded: false,
      children: [
        { title: 'Issue Books', icon: 'assignment_turned_in', route: '/circulation/issue' },
        { title: 'Return Books', icon: 'assignment_return', route: '/circulation/return' },
        { title: 'Loans', icon: 'list_alt', route: '/circulation/loans' },
        { title: 'Reservations', icon: 'bookmark', route: '/circulation/reservations' },
        { title: 'Fines', icon: 'attach_money', route: '/circulation/fines' }
      ]
    },
    {
      title: 'Appointments',
      icon: 'event',
      route: '/appointments'
    },
    {
      title: 'Computer Services',
      icon: 'computer',
      expanded: false,
      children: [
        { title: 'Computers', icon: 'important_devices', route: '/computers' },
        { title: 'Reservations', icon: 'date_range', route: '/computers/reservations' },
        { title: 'Sessions', icon: 'access_time', route: '/computers/sessions' }
      ]
    },
    {
      title: 'Events',
      icon: 'event_note',
      route: '/events'
    },
    {
      title: 'Reports',
      icon: 'assessment',
      route: '/reports'
    },
    {
      title: 'News & Announcements',
      icon: 'campaign',
      route: '/news'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/settings'
    }
  ];


  constructor() { }

  getSidebarData(type : "admin"| "non-admin" | "librarian") : MenuItem[] {
    if(type == "admin"){
      return this.admin_menuItems;
    } else if(type == "librarian"){
      return this.librarian_menuItems;
    }
    else{
      return this.non_admin_menuItems;
    }
  }
}
