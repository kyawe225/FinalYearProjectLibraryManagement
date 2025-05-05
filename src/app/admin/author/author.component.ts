import { Component } from '@angular/core';
import { Author } from '../../model/author';
import { MatTableDataSource } from '@angular/material/table';
import { AuthorService } from '../../service/author.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize, of } from 'rxjs';
import { ConfirmDialogComponent } from '../../non-admin/confirm-dialog/confirm-dialog.component';
import { CrudDialogData, DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-author',
  imports: [
    CommonMaterialTableComponent,
    MatIconModule
  ],
  templateUrl: './author.component.html',
  styleUrl: './author.component.scss'
})
export class AuthorComponent {
  authors: Author[] = [];
  dataSource = new MatTableDataSource<Author>([]);
  displayedColumns: string[] = ['first_name', 'last_name', 'date_of_birth'];
  loading = false;
  
  constructor(
    private authorService: AuthorService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(): void {
    this.loading = true;
    this.authorService.getAuthors()
      .pipe(
        finalize(() => this.loading = false),
        catchError(error => {
          this.snackBar.open('Failed to load authors', 'Close', { duration: 3000 });
          console.error('Error loading authors:', error);
          return of({ success: false, data: [] });
        })
      )
      .subscribe(response => {
        if (response.success && response.data) {
          this.authors = response.data;
          this.dataSource = new MatTableDataSource(this.authors);
        }
      });
  }

  onRowClick(author: Author): void {
    this.openAuthorDialog('view', author);
  }

  onAddAuthor(): void {
    this.openAuthorDialog('add');
  }

  onEditAuthor(author: Author): void {
    this.openAuthorDialog('edit', author);
  }

  onDeleteAuthor(author: Author): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Author',
        message: `Are you sure you want to delete ${author.first_name} ${author.last_name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.authorService.deleteAuthor(author.author_id)
          .pipe(
            finalize(() => this.loading = false),
            catchError(error => {
              this.snackBar.open('Failed to delete author', 'Close', { duration: 3000 });
              console.error('Error deleting author:', error);
              return of({ success: false });
            })
          )
          .subscribe(response => {
            if (response.success) {
              this.snackBar.open('Author deleted successfully', 'Close', { duration: 3000 });
              this.loadAuthors();
            } else {
              this.snackBar.open( 'Failed to delete author', 'Close', { duration: 3000 });
            }
          });
      }
    });
  }

  openAuthorDialog(action: 'add' | 'edit' | 'view', author?: Author): void {
    let decodedAction :"view"|"create"|"update" ='view';
    if(action=='add'){
      decodedAction = 'create';
    }else if (action=='edit'){
      decodedAction = 'update';
    }
    const formFields: DialogFieldConfig[] = [
      {
        name: 'first_name',
        label: 'First Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        name: 'last_name',
        label: 'Last Name',
        type: 'text',
        required: true,
        minLength: 2,
        maxLength: 100
      },
      {
        name: 'biography',
        label: 'Biography',
        type: 'textarea'
      },
      {
        name: 'date_of_birth',
        label: 'Date of Birth',
        type: 'date'
      }
    ];

    const dialogData: CrudDialogData = {
      title: action === 'add' ? 'Add Author' : action === 'edit' ? 'Edit Author' : 'Author Details',
      formFields,
      data: author || {},
      action: decodedAction,
      submitButtonText: action === 'add' ? 'Add' : 'Save'
    };

    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action === 'submit') {
        this.loading = true;
        
        if (action === 'add') {
          this.authorService.createAuthor(result.data)
            .pipe(
              finalize(() => this.loading = false),
              catchError(error => {
                this.snackBar.open('Failed to create author', 'Close', { duration: 3000 });
                console.error('Error creating author:', error);
                return of({ success: false });
              })
            )
            .subscribe(response => {
              if (response.success) {
                this.snackBar.open('Author created successfully', 'Close', { duration: 3000 });
                this.loadAuthors();
              } else {
                this.snackBar.open( 'Failed to create author', 'Close', { duration: 3000 });
              }
            });
        } else if (action === 'edit' && author) {
          this.authorService.updateAuthor(author.author_id, result.data)
            .pipe(
              finalize(() => this.loading = false),
              catchError(error => {
                this.snackBar.open('Failed to update author', 'Close', { duration: 3000 });
                console.error('Error updating author:', error);
                return of({ success: false });
              })
            )
            .subscribe(response => {
              if (response.success) {
                this.snackBar.open('Author updated successfully', 'Close', { duration: 3000 });
                this.loadAuthors();
              } else {
                this.snackBar.open( 'Failed to update author', 'Close', { duration: 3000 });
              }
            });
        }
      }
    });
  }

  onRefresh(): void {
    this.loadAuthors();
  }
}
