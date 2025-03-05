import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { switchMap, catchError, take } from 'rxjs/operators';
import { of, Subscription, lastValueFrom } from 'rxjs';
import { OrderService } from '../../core/services/orders/order.service';
import { environment } from '../../../environments/environment';
import { OrderStatus } from '../../shared/enum/order-status.enum';
interface PaymentResponse {
  status: string;
  amount: number;
  paymentId: string;
  orderId: number;
  error?: string;
  orderNumber?: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cardElement') cardElementRef!: ElementRef;
  @ViewChild('paypalButtonContainer', { static: false }) paypalButtonContainerRef!: ElementRef;

  paymentForm: FormGroup;
  stripe: any;
  cardElement: any;
  paypalButton: any;
  orderId!: number;
  orderDetails: any;
  paymentMethod: string | null = null;
  isProcessing = false;
  errorMessage = '';
  stripeElementLoaded = false;
  paypalLoaded = false;
  price = 0;
  private subscriptions = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private orderService: OrderService
  ) {
    this.paymentForm = this.fb.group({
      cardholderName: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  ngOnInit() {
    const routeSub = this.route.queryParams.pipe(
      switchMap(params => {
        this.paymentMethod = params['method'];
        this.orderId = params['orderId'];
        
        if (!this.orderId || !this.paymentMethod) {
          this.router.navigate(['/checkout']);
          return of(null);
        }

        return this.orderService.getOrder(this.orderId).pipe(
          catchError(() => {
            this.router.navigate(['/checkout']);
            return of(null);
          })
        );
      })
    ).subscribe(order => {
      if (!order) return;
      this.orderDetails = order;
      if (order.payment?.status === 'succeeded' || order.payment?.status === 'CASHIER_PENDING') {
        this.router.navigate(['/order-confirmation', order.orderId]);
        return;
      }

      this.initializePayment();
    });
    this.price = this.cartService.getTotalPrice();
    this.subscriptions.add(routeSub);
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.cardElement) this.cardElement.destroy();
    if (this.paypalButton) this.paypalButton.close();
  }

  private initializePayment() {
    switch (this.paymentMethod) {
      case 'cash':
        break;
      case 'credit':
      case 'debit':
        this.initializeStripe();
        break;
      case 'paypal':
        this.initializePayPal();
        break;
      default:
        this.router.navigate(['/checkout']);
    }
  }

  private async initializeStripe() {
    try {
      await this.loadStripeScript();
      
      this.stripe = (window as any).Stripe(environment.stripeKey);
      const elements = this.stripe.elements();
      
      this.cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#32325d',
          }
        }
      });

      if (this.cardElementRef?.nativeElement) {
        this.cardElement.mount(this.cardElementRef.nativeElement);
        
        this.cardElement.on('ready', () => {
          this.stripeElementLoaded = true;
          this.cdRef.detectChanges();
        });
      }
    } catch (error) {
      console.error('Stripe initialization error:', error);
      this.errorMessage = 'Card payment unavailable. Please try another method.';
      this.cdRef.detectChanges();
    }
  }

  private async initializePayPal() {
    try {
      await this.loadPayPalScript();
      
      this.paypalLoaded = true;
      this.cdRef.detectChanges();

      this.paypalButton = (window as any).paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'blue',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.orderDetails.total.toFixed(2),
                currency_code: 'USD'
              }
            }]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const captureResult = await actions.order.capture();
            await this.processPaymentResult('paypal', {
              id: captureResult.id,
              success: captureResult.status === 'COMPLETED'
            });
          } catch (error) {
            this.handlePaymentError(error);
          }
        },
        onError: (error: any) => this.handlePaymentError(error)
      });

      if (this.paypalButtonContainerRef?.nativeElement) {
        this.paypalButton.render(this.paypalButtonContainerRef.nativeElement);
      }
    } catch (error) {
      this.handlePaymentError(error);
    }
  }

  private async loadStripeScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).Stripe) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Stripe script failed to load'));
      document.head.appendChild(script);
    });
  }

  private async loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) return resolve();
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=USD`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('PayPal script failed to load'));
      document.head.appendChild(script);
    });
  }

  async processPayment() {
    if (!this.paymentForm.valid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    try {
      const { error, paymentMethod } = await this.stripe.createPaymentMethod({
        type: 'card',
        card: this.cardElement,
        billing_details: {
          name: this.paymentForm.value.cardholderName
        }
      });

      if (error) throw error;

      await this.processPaymentResult(this.paymentMethod!, {
        id: paymentMethod.id,
        success: true
      });
    } catch (error) {
      this.handlePaymentError(error);
    }
  }

  confirmCashPayment() {
    this.isProcessing = true;
    this.processPaymentResult('cash', { id: `cash-${Date.now()}`, success: true })
      .catch(error => this.handlePaymentError(error));
  }

  private handlePaymentError(error: any) {
    console.error('Payment Error:', error);
    this.errorMessage = error.message || 'Payment processing failed. Please try again.';
    this.isProcessing = false;
    this.cdRef.detectChanges();
  }

  get f() {
    return this.paymentForm.controls;
  }

  private async processPaymentResult(method: string, paymentResult: any) {
    this.isProcessing = true;
    try {
      const paymentData = {
        orderId: this.orderId,
        amount: this.cartService.getTotalPrice(),
        currency: 'USD',
        paymentMethodId: paymentResult.id
      }
      console.log(paymentData);
      const response = await lastValueFrom(
        this.orderService.updateOrderPayment(paymentData)
      ) as PaymentResponse;
  
      if (response.status === 'succeeded' || response.status === 'CASHIER_PENDING') {
        if(response.status === 'CASHIER_PENDING'){
          this.orderService.updateOrderStatus(this.orderId, OrderStatus.CASHIER_PENDING).subscribe();
        } else {
          this.orderService.updateOrderStatus(this.orderId, OrderStatus.PAYMENT_SUCCESSFUL).subscribe();
        }
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', this.orderDetails.orderId]);
      } else {
        throw new Error(response.error || 'Payment failed');
      }
    } catch (error) {
      this.handlePaymentError(error);
    } finally {
      this.isProcessing = false;
    }
  }  
}
