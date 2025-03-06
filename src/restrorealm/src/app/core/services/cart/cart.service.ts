import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../../../shared/models/MenuItem.model';

export interface CartItem {
  menuItem: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.loadCartFromStorage());
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  private saveCartToStorage(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  removeFromCart(itemId: number): void {
    const items = this.loadCartFromStorage().filter(item => item.menuItem.id !== itemId);
    this.saveCartToStorage(items);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const items = this.loadCartFromStorage();
    const item = items.find(i => i.menuItem.id === itemId);
    
    if(item) {
      if(quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.saveCartToStorage(items);
      }
    }
  }

  clearCart(): void {
    this.saveCartToStorage([]);
  }

  getTotalItems(): number {
    return this.loadCartFromStorage().reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.loadCartFromStorage().reduce(
      (acc, item) => acc + (item.menuItem.basePrice * item.quantity), 0
    );
  }

  private loadCartFromStorage(): CartItem[] {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }
  
  addToCart(menuItem: MenuItem): void {
    if(!menuItem?.id) return;
    
    const items = this.loadCartFromStorage();
    const existingItem = items.find(item => item.menuItem.id === menuItem.id);
    
    if(existingItem) {
      existingItem.quantity++;
    } else {
      items.push({ 
        menuItem: { 
          id: menuItem.id,
          name: menuItem.name,
          basePrice: menuItem.basePrice
        }, 
        quantity: 1 
      });
    }
    
    this.saveCartToStorage(items);
  }

  getItems(): CartItem[] {
    return this.getPayload();
  }

  getPayload(): any {
    return this.loadCartFromStorage().map(item => ({
        menuItemId: item.menuItem.id,
        quantity: item.quantity
      }));
  }
}
