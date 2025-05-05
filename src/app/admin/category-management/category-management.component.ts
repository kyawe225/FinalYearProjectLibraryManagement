// src/app/admin/categories/category-management.component.ts

import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { DialogFieldConfig } from '../../model/crud-dialog-field-config';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { CommonMaterialTableComponent } from '../share/common-material-table/common-material-table.component';
import { book_category } from '../../model/book_category';
import { CategoryService } from '../../service/category.service';
import { CommonDialogTableComponent } from '../share/common-dialog-table/common-dialog-table.component';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [
    CommonModule,
    CommonMaterialTableComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss']
})
export class CategoryManagementComponent implements OnInit {
  dataSource = signal<MatTableDataSource<book_category>>(new MatTableDataSource<book_category>([]));
  displayedColumns = signal<string[]>([
    'category_id',
    'category_name',
    'parent_category_name',
    'description'
  ]);
  
  loading = signal<boolean>(false);
  categories = signal<book_category[]>([]);
  
  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.loading.set(true);
    
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories.set(categories.data);
        
        // Enhance categories with parent category names
        const enhancedCategories = categories.data.map(category => {
          if (category.parent_category) {
            const parentCategory = categories.data.find(c => c.id === category.parent_category?.id);
            return {
              ...category,
              parent_category_name: parentCategory ? parentCategory.name : 'None'
            };
          }
          return {
            ...category,
          };
        });
        
        this.dataSource.set(new MatTableDataSource(enhancedCategories));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
        this.snackBar.open('Error loading categories. Please try again later.', 'Close', {
          duration: 3000
        });
      }
    });
  }
  
  handleRefresh(): void {
    this.loadCategories();
  }
  
  handleRowClick(category: book_category): void {
    this.openCategoryDialog('view', category);
  }
  
  handleAddClick(): void {
    this.openCategoryDialog('add');
  }
  
  handleEditClick(category: book_category): void {
    this.openCategoryDialog('edit', category);
  }
  
  handleDeleteClick(category: book_category): void {
    this.openCategoryDialog('delete', category);
  }
  
  openCategoryDialog(action: 'add' | 'edit' | 'view' | 'delete', category?: book_category): void {
    const formFields: DialogFieldConfig[] = [
      {
        name: 'category_name',
        label: 'Category Name',
        type: 'text',
        required: true,
        maxLength: 100,
        errorMessage: 'Category name is required'
      },
      {
        name: 'parent_category_id',
        label: 'Parent Category',
        type: 'select',
        required: false,
        options: [
          { value: '', label: 'None' },
          ...this.categories()
            .filter(c => category ? c.id !== category.id : true) // Prevent selecting self as parent
            .map(c => ({
              value: c.id,
              label: c.name
            }))
        ]
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: false
      }
    ];
    
    let dialogTitle = '';
    let submitButtonText = '';
    
    switch (action) {
      case 'add':
        dialogTitle = 'Add New Category';
        submitButtonText = 'Add';
        break;
      case 'edit':
        dialogTitle = 'Edit Category';
        submitButtonText = 'Update';
        break;
      case 'view':
        dialogTitle = 'View Category Details';
        submitButtonText = 'Close';
        break;
      case 'delete':
        dialogTitle = 'Delete Category';
        submitButtonText = 'Delete';
        break;
    }
    
    const dialogRef = this.dialog.open(CommonDialogTableComponent, {
      width: '600px',
      data: {
        title: dialogTitle,
        submitButtonText: submitButtonText,
        formFields: formFields,
        data: category || {},
        action: action
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result || result.action === 'cancel') {
        return;
      }
      
      let operation: Observable<any>;
      
      switch (action) {
        case 'add':
          operation = this.categoryService.create(result.data);
          break;
        case 'edit':
          operation = this.categoryService.update(
            category?.id ||'',
            result.data
          );
          break;
        case 'delete':
          operation = this.categoryService.delete(category?.id || '');
          break;
        default:
          return;
      }
      
      this.loading.set(true);
      
      operation.subscribe({
        next: () => {
          this.loading.set(false);
          
          const message = action === 'add' ? 'Category added successfully' :
                          action === 'edit' ? 'Category updated successfully' :
                          'Category deleted successfully';
          
          this.snackBar.open(message, 'Close', {
            duration: 3000
          });
          
          this.loadCategories();
        },
        error: (error) => {
          console.error(`Error ${action} category:`, error);
          this.loading.set(false);
          
          this.snackBar.open(`Error ${action === 'add' ? 'adding' : 
                               action === 'edit' ? 'updating' : 
                               'deleting'} category. Please try again.`, 'Close', {
            duration: 3000
          });
        }
      });
    });
  }
}