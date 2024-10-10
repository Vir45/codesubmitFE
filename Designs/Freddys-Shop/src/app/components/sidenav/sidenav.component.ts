import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { OrdersComponent } from '../orders/orders.component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, DashboardComponent, OrdersComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  selectedComponent: 'dashboard' | 'orders' = 'dashboard';

  selectComponent(component: 'dashboard' | 'orders'): void {
    this.selectedComponent = component;
  }

}
