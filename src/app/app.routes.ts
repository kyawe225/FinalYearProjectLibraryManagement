import { Routes } from '@angular/router';
import { PublisherListComponent } from './admin/publisher-list/publisher-list.component';
import { PublisherUpdateComponent } from './admin/publisher-update/publisher-update.component';
import { PublisherCreateComponent } from './admin/publisher-create/publisher-create.component';
import { AppComponent } from './app.component';
import { MainComponent } from './non-admin/main/main.component';
import { WishbookCreateComponent } from './admin/wishbook-create/wishbook-create.component';
import { WishbookUpdateComponent } from './admin/wishbook-update/wishbook-update.component';
import { WishbookListComponent } from './admin/wishbook-list/wishbook-list.component';
import { RoleUpdateComponent } from './admin/role-update/role-update.component';
import { RoleCreateComponent } from './admin/role-create/role-create.component';
import { RoleListComponent } from './admin/role-list/role-list.component';
import { BookCreateComponent } from './admin/book-create/book-create.component';
import { BookListComponent } from './admin/book-list/book-list.component';
import { BookUpdateComponent } from './admin/book-update/book-update.component';
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
import { WishBooksComponent } from './non-admin-loggedin/wish-books/wish-books.component';
import { ContactUsComponent } from './non-admin/contact-us/contact-us.component';
import { ProfileComponent } from './non-admin-loggedin/profile/profile.component';

export const routes: Routes = [
    {
        path: "admin",
        component: AdminComponent,
        canActivateChild: [adminGuard],
        children : [
            {
                path : "publisher/list",
                component: PublisherListComponent
            },
            {
                path: "publisher/create",
                component: PublisherCreateComponent
            },
            {
                path: "publisher/update/:id",
                component: PublisherUpdateComponent
            },
            {
                path:"wishbook/list",
                component: WishbookListComponent
            },
            {
                path:"wishbook/create",
                component: WishbookCreateComponent
            },
            {
                path:"wishbook/update/:id",
                component: WishbookUpdateComponent
            },
            {
                path:"role/list",
                component: RoleListComponent
            },
            {
                path:"role/create",
                component: RoleCreateComponent
            },
            {
                path:"role/update/:id",
                component: RoleUpdateComponent
            },
            {
                path:"book/list",
                component: BookListComponent
            },
            {
                path:"book/create",
                component: BookCreateComponent
            },
            {
                path:"book/update/:id",
                component: BookUpdateComponent
            }
        ]
    },
    {
        path:"auth/login",
        component: AuthLoginComponent,
        canActivate: [authGuard]
    },
    {
        path:"auth/register",
        component: AuthRegisterComponent,
        canActivate: [authGuard]
    },
    {
        path:"",
        component: NonAdminComponent,
        children: [
            {
                path: "",
                component: MainComponent,
                pathMatch: "full"
            },
            {
                path: "book/search",
                component: BookSearchComponent
            },
            {
                path:"book/detail/:id",
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
                path: "wishbook/list",
                component: WishBooksComponent
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
            }
        ]
    },
    {
        path: "**",
        redirectTo : "/"
    }
];
