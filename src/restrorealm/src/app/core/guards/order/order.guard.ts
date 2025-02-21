import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { Router } from "@angular/router";
import { Observable, of, map, catchError, tap } from "rxjs";
import { OrderService } from "../../services/orders/order.service";
import { AuthService } from "../../services/auth/auth.service";
import { OrderStatus } from "../../../shared/enum/order-status.enum";

@Injectable({ providedIn: 'root' })
export class OrderGuard implements CanActivate {
  constructor(
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const orderId = route.queryParamMap.get('orderId');
    
    console.log('OrderGuard checking orderId:', orderId);

    if (!orderId) {
      console.warn('No orderId in URL');
      this.router.navigate(['/checkout']);
      return of(false);
    }

    return this.orderService.getOrder(orderId).pipe(
      tap(order => console.log('Order found:', order)),
      map(order => {
        if (order.status !== OrderStatus.PENDING) {
          console.warn('Order not pending. Status:', order.status);
          this.router.navigate(['/checkout']);
          return false;
        }
        
        if (this.authService.getUserInfo()?.id !== order.userId) {
          console.warn('User not authorized for this order');
          this.router.navigate(['/checkout']);
          return false;
        }
        
        return true;
      }),
      catchError(error => {
        console.error('OrderGuard error:', error);
        this.router.navigate(['/checkout']);
        return of(false);
      })
    );
  }
}