import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../../shared/models/order.model';
import { OrderStatus } from '../../shared/enum/order-status.enum';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/orders/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.css'
})
export class AllOrdersComponent implements OnInit, OnDestroy {
  // Order data
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  displayedOrders: Order[] = [];
  newOrders: Set<number> = new Set<number>();
  selectedOrders: Set<number> = new Set<number>();
  orderDetails: Order | null = null;
  
  // Enum reference for template
  OrderStatus = OrderStatus;
  
  // Subscriptions
  private ordersSubscription: Subscription;
  private newOrdersSubscription: Subscription;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  totalPages: number = 1;
  
  // Sorting
  sortBy: 'orderDate' | 'orderNumber' | 'totalAmount' = 'orderDate';
  sortDirection: 'asc' | 'desc' = 'desc';
  
  // Filtering
  statusFilters: Set<OrderStatus> = new Set<OrderStatus>();
  showStatusFilterDropdown: boolean = false;
  searchQuery: string = '';
  dateRange = {
    start: '',
    end: ''
  };
  
  constructor(private orderService: OrderService) { 
    this.ordersSubscription = new Subscription();
    this.newOrdersSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe();
    
    this.ordersSubscription = this.orderService.orders$.subscribe(orders => {
      // Filter out orders with pending payment
      this.orders = orders.filter(order => order.status !== OrderStatus.PAYMENT_PENDING);
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
  
  // Order status management
  updateOrderStatus(order: Order, status: OrderStatus, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.orderService.updateOrderStatus(order.orderId, status).subscribe();
  }
  
  updateSelectedOrdersStatus(status: OrderStatus): void {
    if (this.selectedOrders.size === 0) return;
    
    this.selectedOrders.forEach(orderId => {
      this.orderService.updateOrderStatus(orderId, status).subscribe();
    });
    
    // Clear selections after update
    this.selectedOrders.clear();
  }
  
  // Order selection
  toggleOrderSelection(orderId: number, event: Event): void {
    event.stopPropagation();
    
    if (this.selectedOrders.has(orderId)) {
      this.selectedOrders.delete(orderId);
    } else {
      this.selectedOrders.add(orderId);
    }
  }
  
  isOrderSelected(orderId: number): boolean {
    return this.selectedOrders.has(orderId);
  }
  
  selectAllDisplayedOrders(): void {
    if (this.areAllDisplayedOrdersSelected()) {
      // Deselect all if all are already selected
      this.displayedOrders.forEach(order => {
        this.selectedOrders.delete(order.orderId);
      });
    } else {
      // Select all currently displayed orders
      this.displayedOrders.forEach(order => {
        this.selectedOrders.add(order.orderId);
      });
    }
  }
  
  areAllDisplayedOrdersSelected(): boolean {
    return this.displayedOrders.length > 0 && 
           this.displayedOrders.every(order => this.selectedOrders.has(order.orderId));
  }
  
  clearAllSelections(): void {
    this.selectedOrders.clear();
  }
  
  // New order indicators
  isNewOrder(orderId: number): boolean {
    return this.newOrders.has(orderId);
  }
  
  clearNewFlag(orderId: number): void {
    this.orderService.clearNewOrderFlag(orderId);
  }
  
  // Filtering
  toggleStatusFilter(status: OrderStatus): void {
    if (this.statusFilters.has(status)) {
      this.statusFilters.delete(status);
    } else {
      this.statusFilters.add(status);
    }
    this.applyFilters();
  }
  
  isStatusFilterActive(status: OrderStatus): boolean {
    return this.statusFilters.has(status);
  }
  
  toggleStatusFilterDropdown(event: Event): void {
    event.stopPropagation();
    this.showStatusFilterDropdown = !this.showStatusFilterDropdown;
  }
  
  clearFilters(): void {
    this.statusFilters.clear();
    this.searchQuery = '';
    this.dateRange.start = '';
    this.dateRange.end = '';
    this.applyFilters();
  }
  
  applySearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  applyDateFilter(): void {
    this.currentPage = 1;
    this.applyFilters();
  }
  
  private applyFilters(): void {
    let result = [...this.orders];
    
    // Apply status filters if any are selected
    if (this.statusFilters.size > 0) {
      result = result.filter(order => this.statusFilters.has(order.status));
    }
    
    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(order => 
        order.orderNumber.toString().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.orderItems.some(item => item.menuItemName.toLowerCase().includes(query))
      );
    }
    
    // Apply date range filter
    if (this.dateRange.start && this.dateRange.end) {
      const startDate = new Date(this.dateRange.start);
      const endDate = new Date(this.dateRange.end);
      endDate.setHours(23, 59, 59); // Include the entire end day
      
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    
    // Apply sorting
    result = this.sortOrders(result);
    
    this.filteredOrders = result;
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    
    // Reset to first page if current page is now invalid
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    
    // Apply pagination
    this.updateDisplayedOrders();
  }
  
  // Sorting
  setSorting(sortField: 'orderDate' | 'orderNumber' | 'totalAmount'): void {
    if (this.sortBy === sortField) {
      // Toggle direction if clicking the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortField;
      // Default to descending for dates, ascending for others
      this.sortDirection = sortField === 'orderDate' ? 'desc' : 'asc';
    }
    
    this.applyFilters();
  }
  
  private sortOrders(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'orderDate':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'orderNumber':
          comparison = Number(a.orderNumber) - Number(b.orderNumber);
          break;
        case 'totalAmount':
          comparison = a.totalAmount - b.totalAmount;
          break;
      }
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }
  
  getSortIndicator(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }
  
  // Pagination
  updateDisplayedOrders(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.filteredOrders.length);
    this.displayedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }
  
  changeItemsPerPage(): void {
    this.currentPage = 1;
    this.updateDisplayedOrders();
  }
  
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedOrders();
  }
  
  getPaginationArray(): number[] {
    const maxButtons = 5;
    const pages: number[] = [];
    
    // Always include first and last page
    if (this.totalPages <= maxButtons) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      // Calculate start and end based on current page
      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, start + 2);
      
      // Adjust start if end is maxed out
      start = Math.max(2, end - 2);
      
      // Add ellipsis before start if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add pages between start and end
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis after end if needed
      if (end < this.totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }
  
  // Order details
  viewOrderDetails(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.orderDetails = order;
  }
  
  closeOrderDetails(): void {
    this.orderDetails = null;
  }
  
  // Styling helpers
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
  getMinValue(arg0: number,arg1: number) {
    return Math.min(arg0, arg1);
  }
}