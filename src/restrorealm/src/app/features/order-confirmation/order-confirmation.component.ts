import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { OrderService } from '../../core/services/orders/order.service';
import { Order } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  cartService = inject(CartService);
  orderService = inject(OrderService);

  order!: Order;
  orderId!: string;
  isLoading: boolean = true;
  estimatedDeliveryTime: Date;
  deliveryAddress!: string;

  constructor() {
    this.cartService.clearCart();
    this.estimatedDeliveryTime = this.calculateEstimatedDeliveryTime();
  }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.fetchOrderDetails();
  }

  fetchOrderDetails(): void {
    this.orderService.getOrder(this.orderId).subscribe({
      next: (orderData) => {
        this.order = orderData;
        this.deliveryAddress = this.order.street1 + ', ' + this.order.street2 + ', ' + this.order.city + ', ' + this.order.state + ' ' + this.order.postalCode + '.';
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching order details', error);
        this.isLoading = false;
      }
    });
  }

  calculateEstimatedDeliveryTime(): Date {
    const deliveryTime = new Date();
    deliveryTime.setMinutes(deliveryTime.getMinutes() + 45);
    return deliveryTime;
  }

  downloadReceipt(): void {
    // Implement receipt download functionality
    console.log('Downloading receipt for order', this.orderId);
  }

  shareOrder(): void {
    if (navigator.share) {
      navigator.share({
        title: `Order Confirmation #${this.orderId}`,
        text: `Check out my order from our restaurant!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers not supporting Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Order link copied to clipboard!'));
    }
  }
}
