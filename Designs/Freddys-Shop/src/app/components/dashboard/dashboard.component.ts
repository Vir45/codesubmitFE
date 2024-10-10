import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../services/apiService/api.service';
import { Bestseller, ChartData, SalesOverTimePeriod, Dashboard } from '../../types/types';
import { BestsellersTableComponent } from '../bestsellers-table/bestsellers-table.component';
import { RevenueChartComponent } from '../revenue-chart/revenue-chart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { getLastMonth, getCurrentWeekDayNumber, calculateTotals } from '../../utils/utils';

enum ViewType {
  Weekly = 'weekly',
  Yearly = 'yearly'
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BestsellersTableComponent, RevenueChartComponent, MatButtonToggleModule, FormsModule, ReactiveFormsModule, CardComponent, MatProgressSpinnerModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  dashboardData!: Dashboard;
  chartData: ChartData = { x: [], y: [] };
  viewType: ViewType = ViewType.Weekly;
  bestsellersTableData: Bestseller[] = [];
  apiService = inject(ApiService);
  public ViewType = ViewType;
  todayCard: { title: string; content: string } = { title: '', content: '' };
  lastWeekCard: { title: string; content: string } = { title: '', content: '' };
  lastMonthCard: { title: string; content: string } = { title: '', content: '' };
  isLoading: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data.dashboard;
        this.setChartData(this.dashboardData.sales_over_time_week);
        this.bestsellersTableData = this.dashboardData.bestsellers;
        this.calculateCardsData();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  setChartData(salesOverTime: SalesOverTimePeriod): void {
    const newChartData: ChartData = { x: [], y: [] };
    Object.entries(salesOverTime).forEach(([period, revenueData]) => {
      newChartData.x.push(period);
      newChartData.y.push(revenueData.total);
    });
    this.chartData = newChartData;
  }

  onToggleView(event: MatButtonToggleChange): void {
    const salesData = this.viewType === ViewType.Weekly
      ? this.dashboardData.sales_over_time_week
      : this.dashboardData.sales_over_time_year;

    this.setChartData(salesData);
  }

  calculateCardsData(): void {
    this.calculateTodayCardData();
    this.calculateLastWeekCardData();
    this.calculateLastMonthData();
  }

  calculateTodayCardData() {
    const todayData = this.dashboardData.sales_over_time_week[getCurrentWeekDayNumber()];
    this.todayCard = {
      title: 'Today',
      content: this.createCardContent(String(todayData.total), String(todayData.orders))
    };;
  }

  calculateLastWeekCardData() {
    const data = calculateTotals(this.dashboardData.sales_over_time_week);
    this.lastWeekCard = {
      title: 'Last Week',
      content: this.createCardContent(String(data.total), String(data.orders))
    }
  }

  calculateLastMonthData() {
    const data = this.dashboardData.sales_over_time_year[getLastMonth()];
    this.lastMonthCard = {
      title: 'Last Month',
      content: this.createCardContent(String(data.total), String(data.orders))
    }
  }

  createCardContent(total: string, orders: string) {
    return `$${total}$ / ${orders} orders`
  }
}
