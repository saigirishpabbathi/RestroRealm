import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { OrderStatus } from '../../shared/enum/order-status.enum';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/orders/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  newOrders: Set<number> = new Set<number>();
  OrderStatus = OrderStatus; // expose enum to template
  private ordersSubscription: Subscription;
  private newOrdersSubscription: Subscription;
  
  // For filtering options
  statusFilter: OrderStatus | 'ALL' = 'ALL';
  filteredOrders: Order[] = [];

  constructor(private orderService: OrderService) { 
    this.ordersSubscription = new Subscription();
    this.newOrdersSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe();
    
    this.ordersSubscription = this.orderService.orders$.subscribe(orders => {
      this.orders = orders;
      this.applyFilters();
    });
    
    this.newOrdersSubscription = this.orderService.newOrders$.subscribe(newOrders => {
      this.newOrders = newOrders;
    });
  }
  
  ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
    if (this.newOrdersSubscription) {
      this.newOrdersSubscription.unsubscribe();
    }
  }
  
  isNewOrder(orderId: number): boolean {
    return this.newOrders.has(orderId);
  }
  
  clearNewFlag(orderId: number): void {
    this.orderService.clearNewOrderFlag(orderId);
  }
  
  updateOrderStatus(order: Order, status: OrderStatus): void {
    this.orderService.updateOrderStatus(order.orderId, status).subscribe();
  }
  
  filterByStatus(status: OrderStatus | 'ALL'): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  private applyFilters(): void {
    this.filteredOrders = this.statusFilter === 'ALL' 
      ? this.orders 
      : this.orders.filter(order => order.status === this.statusFilter);
  }
  
  getOrderStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'badge-warning';
      case OrderStatus.CONFIRMED:
        return 'badge-info';
      case OrderStatus.IN_PROGRESS:
      case OrderStatus.PREPARING:
        return 'badge-primary';
      case OrderStatus.COMPLETED:
      case OrderStatus.READY_FOR_PICKUP:
      case OrderStatus.PAYMENT_SUCCESSFUL:
        return 'badge-success';
      case OrderStatus.REJECTED:
      case OrderStatus.CANCELLED:
      case OrderStatus.PAYMENT_FAILED:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }
}