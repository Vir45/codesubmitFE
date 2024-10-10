import { Component, AfterViewInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/apiService/api.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Order, OrdersResponse } from '../../types/types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, ReactiveFormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'status', 'total'];
  dataSource = new MatTableDataSource<Order>()
  searchControl: FormControl = new FormControl('');
  totalOrders: number = 0;
  isLoading: boolean = true;
  currentPage: number = 0;

  apiService = inject(ApiService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.setupSearch();
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((searchTerm) => {
          this.isLoading = true;
          this.currentPage = 1;
          return this.apiService.getOrders(this.currentPage, searchTerm);
        })
      )
      .subscribe({
        next: (data) => {
          this.isLoading = false;
          this.updateOrders(data)
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching orders:', error)
        }
      });
  }

  private loadOrders(searchTerm: string = '', page: number = 1): void {
    this.apiService.getOrders(page, searchTerm).subscribe({
      next: (data) => this.updateOrders(data),
      error: (error) => console.error('Error fetching orders:', error),
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private updateOrders(data: OrdersResponse): void {
    this.totalOrders = data.total;
    this.dataSource.data = data.orders;
  }

  pageChanged(event: any): void {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.loadOrders(this.searchControl.value, this.currentPage);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      default:
        return '';
    }
  }
}
