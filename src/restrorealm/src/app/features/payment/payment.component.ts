import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  paymentForm: FormGroup;
  isProcessing = false;
  orderId: string | null = null;

  constructor() {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiration: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', Validators.required]
    });
  }

  get f() {
    return this.paymentForm.controls;
  }

  processPayment() {
    if (this.paymentForm.invalid) return;
    
    this.isProcessing = true;
    
    // Simulate API call
    setTimeout(() => {
      this.orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      this.cartService.clearCart();
      this.router.navigate(['/order-confirmation', this.orderId]);
      this.isProcessing = false;
    }, 2000);
  }
}