import { CommonModule } from '@angular/common';
import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { CartService } from '../../services/cart/cart.service';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, SidebarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})
@Injectable({
  providedIn: 'root',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isSidebarOpen = true;
  showProfileDropdown = false;
  user: User | null = null;
  cartCount = 0;
  private cartSubscription?: Subscription;
  private authSubscription?: Subscription;
  private sidebarSubscription?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sidebarService: SidebarService,
    private cartService : CartService
  ) {}

  toggleSidebar() {
    this.sidebarService.toggle();
  }
  closeSidebar() {
    this.sidebarService.close();
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showProfileDropdown = false;
  }

  viewProfile() {
    this.router.navigate(['/profile']).then(() => {
      this.showProfileDropdown = false;
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {
      this.showProfileDropdown = false;
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']).then(() => {
      this.showProfileDropdown = false;
    });
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    });
    this.authSubscription = this.authService.isLoggedIn$.subscribe({
      next: (isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      },
      error: (error) => {
        console.error('Auth subscription error:', error);
        this.isLoggedIn = false;
      }
    });
  
    this.sidebarSubscription = this.sidebarService.isOpen$.subscribe({
      next: (isOpen) => {
        this.isSidebarOpen = isOpen;
      },
      error: (error) => {
        console.error('Sidebar subscription error:', error);
      }
    });
  
    this.user = this.authService.getUserInfo();
  }

  ngOnDestroy(): void {
    this.isSidebarOpen = false;
    this.showProfileDropdown = false;
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.sidebarSubscription) {
      this.sidebarSubscription.unsubscribe();
    }
  }
}
