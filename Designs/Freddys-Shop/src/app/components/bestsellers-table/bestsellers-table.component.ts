import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { Bestseller } from '../../types/types';

@Component({
  selector: 'app-bestsellers-table',
  imports: [MatTableModule],
  standalone: true,
  templateUrl: './bestsellers-table.component.html',
  styleUrls: ['./bestsellers-table.component.scss']
})

export class BestsellersTableComponent {
  @Input() bestsellers: Bestseller[] = [];
  displayedColumns: string[] = ['Product name', 'Price', '#Units sold', 'Revenue'];
}
