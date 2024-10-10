export interface Product {
  id: string;
  image: string;
  name: string;
}

export interface Bestseller {
  product: Product;
  revenue: number;
  units: number;
}

export interface Revenue {
  orders: number;
  total: number;
}

export interface SalesOverTimePeriod {
  [period: number]: Revenue;
}

export interface Dashboard {
  bestsellers: Bestseller[];
  sales_over_time_week: SalesOverTimePeriod;
  sales_over_time_year: SalesOverTimePeriod;
}

export interface GetDashboardDataResponse {
  dashboard: Dashboard;
}

export interface ChartData {
  x: string[];
  y: number[];
}

export interface Address {
  city: string;
  street: string;
  zipcode: string;
}

export interface Customer {
  id: string;
  name: string;
  surname: string;
  address: Address;
}

export interface OrderProduct {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  created_at: string;
  currency: string;
  status: string;
  total: number;
  customer: Customer;
  product: OrderProduct;
}

export interface OrdersResponse {
  orders: Order[];
  page: number;
  total: number;
}
