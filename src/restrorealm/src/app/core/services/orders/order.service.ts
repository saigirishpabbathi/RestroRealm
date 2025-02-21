import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { OrderStatus } from '../../../shared/enum/order-status.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private currentOrderId: string | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  
  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getRefreshToken()}`,
    });
  }

  createOrder(orderData: any) {
    return this.http.post<any>(`${this.apiUrl}/orders`, {
      ...orderData,
      status: OrderStatus.PENDING
    }, {headers: this.getHeaders()}).pipe(tap(order => this.currentOrderId = order.id));
  }

  getPendingOrder() {
    return this.http.get<any>(`${this.apiUrl}/orders/${this.currentOrderId}`, {headers: this.getHeaders()});
  }

  updateOrderPayment(paymentData: any) {
    return this.http.post(`${this.apiUrl}/payments/process`, paymentData, {headers: this.getHeaders()});
  }

  getOrder(orderId: string) {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderId}`, {headers: this.getHeaders()});
  }
}