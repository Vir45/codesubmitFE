import { Component, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.css'
})
export class RevenueChartComponent {
  @Input() chartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [] }] };
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  public barChartType = 'bar' as const;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.updateChart();
    }
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.update();
    }
  }
}
