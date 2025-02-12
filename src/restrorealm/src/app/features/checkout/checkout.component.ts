import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private router = inject(Router);

  shippingInfo = {
    name: '' as string | undefined,
    address: '' as string | undefined,
    city: '' as string | undefined,
    paymentMethod: 'credit'
  };

  ngOnInit() {
    if(!this.authService.isLoggedIn$) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/checkout' } 
      });
    } else {
      const user = this.authService.getUserInfo();
      this.shippingInfo.name = user?.name;
      // this.shippingInfo.address = user?.city;
    }
  }

  submitOrder() {
    if(this.cartService.getTotalItems() === 0) {
      alert('Your cart is empty');
      return;
    }
    
    this.router.navigate(['/payment']);
  }
}
