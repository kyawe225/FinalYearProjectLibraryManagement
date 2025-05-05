import { Component, computed, effect, input, model, output, signal, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, filter, fromEvent } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-common-material-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './common-material-table.component.html',
  styleUrl: './common-material-table.component.scss'
})
export class CommonMaterialTableComponent {
  // Input signals
  displayedColumns = input<string[]>([]);
  dataSource = input<MatTableDataSource<any>>(new MatTableDataSource<any>([]));
  title = input<string>('Data Table');
  showFilter = input<boolean>(true);
  showPaginator = input<boolean>(true);
  pageSize = input<number>(10);
  pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);
  selectable = input<boolean>(false);
  actionsColumn = input<boolean>(false);
  loading = input<boolean>(false);
  emptyStateMessage = input<string>('No data available');

  // Output signals
  rowClick = output<any>();
  editClick = output<any>();
  deleteClick = output<any>();
  viewClick = output<any>();
  selectionChange = output<any[]>();
  refresh = output<void>();

  // Two-way binding for filter
  filterValue = model<string>('');

  // Internal signals
  private _internalColumns = signal<string[]>([]);

  // Computed values
  displayColumns = computed(() => {
    const columns = [...this.displayedColumns()];

    if (this.selectable() && !columns.includes('select')) {
      columns.unshift('select');
    }

    if (this.actionsColumn() && !columns.includes('actions')) {
      columns.push('actions');
    }

    return columns;
  });

  // References
  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  // Selection model for checkboxes
  selection = new SelectionModel<any>(true, []);

  // Element references
  private filterInput: HTMLInputElement | null = null;

  constructor(private dialog: MatDialog) {
    // Handle column updates
    effect(() => {
      this._internalColumns.set(this.displayColumns());
    });

    // Handle data source changes to setup paginator and sort
    effect(() => {
      const dataSource = this.dataSource();
      const paginator = this.paginator();
      const sort = this.sort();

      if (dataSource && paginator) {
        dataSource.paginator = paginator;
      }

      if (dataSource && sort) {
        dataSource.sort = sort;
      }
    });
  }

  // After view init, set up filter input listener
  ngAfterViewInit(): void {
    // Find the filter input element
    this.filterInput = document.querySelector<HTMLInputElement>('#table-filter-input');

    if (this.filterInput && this.showFilter()) {
      // Create an observable from the input's keyup event
      fromEvent(this.filterInput, 'keyup')
        .pipe(
          takeUntilDestroyed(),
          debounceTime(150),
          distinctUntilChanged(),
          filter(() => !!this.filterInput)
        )
        .subscribe(() => {
          if (this.filterInput) {
            // Update the filter model
            this.filterValue.set(this.filterInput.value);
            // Apply filter to the data source
            this.applyFilter(this.filterInput.value);
          }
        });
    }
  }

  // Apply filter to the table data
  applyFilter(filterValue: string): void {
    const dataSource = this.dataSource();
    dataSource.filter = filterValue.trim().toLowerCase();

    if (dataSource.paginator) {
      dataSource.paginator.firstPage();
    }
  }

  // Handle row click event
  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  // Handle edit click event
  onEditClick(row: any, event: Event): void {
    event.stopPropagation();
    this.editClick.emit(row);
  }

  // Handle delete click event
  onDeleteClick(row: any, event: Event): void {
    event.stopPropagation();
    this.deleteClick.emit(row);
  }

  // Handle view click event
  onViewClick(row: any, event: Event): void {
    event.stopPropagation();
    this.viewClick.emit(row);
  }

  // Handle refresh click event
  onRefresh(): void {
    this.refresh.emit();
  }

  // Check if all rows are selected
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource().data.length;
    return numSelected === numRows;
  }

  // Toggle all rows selection
  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource().data.forEach(row => this.selection.select(row));
    }
    this.selectionChange.emit(this.selection.selected);
  }

  // Handle row selection change
  onSelectionChange(row: any): void {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  // Get tooltip text for a cell based on the content
  getCellTooltip(element: any, column: string): string {
    const value = this.getPropertyByPath(element, column);
    return value !== null && value !== undefined ? value.toString() : '';
  }

  // Helper method to get a property value from an object using a path string (e.g., 'user.address.city')
  getPropertyByPath(obj: any, path: string): any {
    if (!obj || !path) return '';

    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }
}
