import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { OrderService } from '../../core/services/orders/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  shippingInfo = {
    customerName: '' as string | undefined,
    street1: '' as string | undefined,
    street2: '' as string | undefined,
    city: '' as string | undefined,
    state: '' as string | undefined,
    postalCode: 0 as number | undefined,
    paymentMethod: 'credit'
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
  ) {

  }

  ngOnInit() {
    if(!this.authService.isLoggedIn$) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
    } else {
      const user = this.authService.getUserInfo();
      this.shippingInfo.customerName = user?.name;
      this.shippingInfo.street1 = user?.street1;
      this.shippingInfo.street2 = user?.street2;
      this.shippingInfo.city = user?.city;
      this.shippingInfo.state = user?.state;
      this.shippingInfo.postalCode = user?.postalCode;
    }
  }
  
  submitOrder() {
    if (this.cartService.getTotalItems() === 0) {
      alert('Your cart is empty');
      return;
    }
  
    const orderData = {
      ...this.shippingInfo,
      orderItems: this.cartService.getItems(),
      total: this.cartService.getTotalPrice(),
      orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        console.log('Order created:', order);
        this.router.navigate(['/payment'], { 
          queryParams: { orderId: order.orderId, method: this.shippingInfo.paymentMethod } 
        }).then(navigationResult => {
          if (!navigationResult) {
            console.error('Navigation to payment failed');
            alert('Could not proceed to payment');
          }
        });
      },
      error: (error) => {
        alert('Failed to create order: ' + error.message);
      }
    });
  }
}
