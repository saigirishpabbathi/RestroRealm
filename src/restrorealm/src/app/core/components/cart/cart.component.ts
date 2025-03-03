import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  private cartService = inject(CartService);
  cartItems$ = this.cartService.cartItems$;
  totalPrice = this.cartService.getTotalPrice();
  removingItemId: number | null = null;

  updateQuantity(item: CartItem, quantity: number) {
    this.cartService.updateQuantity(item.menuItem.id, quantity);
    this.totalPrice = this.cartService.getTotalPrice();
  }
  async removeItem(itemId: number) {
    this.removingItemId = itemId;
    await new Promise(resolve => setTimeout(resolve, 300));
    this.cartService.removeFromCart(itemId);
    this.removingItemId = null;
    this.totalPrice = this.cartService.getTotalPrice();
  }
}