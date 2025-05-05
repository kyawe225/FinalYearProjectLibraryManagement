import { Routes } from '@angular/router';
import { MainComponent } from './non-admin/main/main.component';
import { AuthLoginComponent } from './admin/auth-login/auth-login.component';
import { AuthRegisterComponent } from './admin/auth-register/auth-register.component';
import { authGuard } from './guard/auth.guard';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './guard/admin.guard';
import { NonAdminComponent } from './non-admin/non-admin.component';
import { BookSearchComponent } from './non-admin/book-search/book-search.component';
import { BookDetailComponent } from './non-admin/book-detail/book-detail.component';
import { NewsListComponent } from './non-admin/news-list/news-list.component';
import { NewsDetailComponent } from './non-admin/news-detail/news-detail.component';
import { WishBooksComponent } from './non-admin/wish-books/wish-books.component';
import { ContactUsComponent } from './non-admin/contact-us/contact-us.component';
import { ProfileComponent } from './non-admin/profile/profile.component';
import { ReservationListComponentComponent } from './reservation-list-component/reservation-list-component.component';
import { ReservationListComponent } from './non-admin-loggedin/reservation-list/reservation-list.component';
import { MainLandingComponent } from './non-admin/main-landing/main-landing.component';
import { BorrowBooksListComponent } from './non-admin/borrow-books-list/borrow-books-list.component';
import { LibrarianComponent } from './librarian/librarian.component';
import { MainComponent as LibrarianMainLayoutComponent } from './librarian/main/main.component';
import { BookTransactionComponent } from './librarian/book-transaction/book-transaction.component';
import { AppointmentComponent } from './librarian/appointment/appointment.component';
import { AppointmentFulfillmentComponent } from './librarian/appointment-fulfillment/appointment-fulfillment.component';
import { WishManagementComponent } from './admin/wish-management/wish-management.component';
import { BookReviewManagementComponent } from './admin/bookreview-management/bookreview-management.component';
import { CategoryManagementComponent } from './admin/category-management/category-management.component';
import { ComputerManagementComponent } from './admin/computer-management/computer-management.component';
import { ComputerReservationManagementComponent } from './admin/computer-reservation-management/computer-reservation-management.component';
import { LatefeeManagementComponent } from './admin/latefee-management/latefee-management.component';
import { ReservationComponent } from './admin/reservation/reservation.component';
import { BookManagementComponent } from './admin/book-management/book-management.component';
import { BranchManagementComponent } from './admin/branch-management/branch-management.component';
import { BookLoanManagementComponent } from './admin/bookloan-management/bookloan-management.component';
import { EventManagementComponent } from './admin/event-management/event-management.component';
import { StaffManagementComponent } from './admin/staff-management/staff-management.component';
import { PublisherComponent } from './admin/publisher/publisher.component';
import { MemberManagementComponent } from './admin/member-management/member-management.component';

export const routes: Routes = [
    {
        path: "admin",
        component: AdminComponent,
        // canActivateChild: [adminGuard],
        children: [
            // Publisher
            {
                path: "publisher",
                component: PublisherComponent
            },

            // Wishbook 
            {
                path: "wishbook",
                component: WishManagementComponent
            },

            // Book Review
            {
                path: "book-review",
                component: BookReviewManagementComponent
            },

            // Category
            {
                path: "category",
                component: CategoryManagementComponent
            },

            // Computer
            {
                path: "computer",
                component: ComputerManagementComponent
            },

            // Computer Reservation
            {
                path: "computer-reservation",
                component: ComputerReservationManagementComponent
            },

            // Fine
            {
                path: "fine",
                component: LatefeeManagementComponent
            },

            // Reservation
            {
                path: "reservation",
                component: ReservationComponent
            },

            // Wish
            {
                path: "wish",
                component: WishManagementComponent
            },

            // Book
            {
                path: "book",
                component: BookManagementComponent
            },
            {
                path: "branch",
                component: BranchManagementComponent
            },
            {
                path:"book-loan",
                component: BookLoanManagementComponent
            },
            {
                path:"computer-reservation",
                component: ComputerReservationManagementComponent
            },
            {
                path:"event",
                component: EventManagementComponent
            },
            {
                path: "latefee",
                component: LatefeeManagementComponent
            },
            {
                path:"appointment",
                component: AppointmentComponent
            },
            {
                path: "staff",
                component: StaffManagementComponent
            }
        ]
    },
    {
        path: "auth/login",
        component: AuthLoginComponent,
        canActivate: [authGuard]
    },
    {
        path: "auth/register",
        component: AuthRegisterComponent,
        canActivate: [authGuard]
    },
    {
        path: "librarian",
        component: LibrarianComponent,
        children: [
            // {
            //     path:"",
            // },
            {
                path: "",
                component: LibrarianMainLayoutComponent
            },
            {
                path: "transaction",
                component: BookTransactionComponent
            },
            {
                path: "member-management",
                component: MemberManagementComponent
                // loadComponent: () => import("./librarian/member-management/member-management.component").then(m => m.MemberManagementComponent)
            },
            {
                path: "appointment/{id}",
                component: AppointmentComponent
            },
            {
                path: "appointfulfillment",
                component: AppointmentFulfillmentComponent
            }
        ],
    },
    {
        path: "",
        component: NonAdminComponent,
        children: [
            {
                path: "",
                component: MainLandingComponent,
                pathMatch: "full"
            },
            {
                path: "dashboard",
                component: MainComponent,
            },
            {
                path: "book/search",
                component: BookSearchComponent
            },
            {
                path: "book/detail/:id",
                component: BookDetailComponent
            },
            {
                path: "news/list",
                component: NewsListComponent
            },
            {
                path: "news/:id",
                component: NewsDetailComponent
            },
            {
                path: "user/borrow/list",
                component: BorrowBooksListComponent
            },
            {
                path: "contact-us",
                component: ContactUsComponent
            },
            {
                path: "user/profile",
                component: ProfileComponent
            },
            {
                path: "user/wishbook",
                component: WishBooksComponent
            },
            {
                path: "user/reserve",
                component: ReservationListComponent
            }
        ]
    },
    {
        "path": "profile",
        component: ProfileComponent
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
