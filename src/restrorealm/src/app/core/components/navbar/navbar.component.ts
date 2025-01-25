import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isSidebarOpen = false;
  showProfileDropdown = false;
  user = {
    name: '',
    role: '',
    profilePicture: ''
  };

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfileDropdown() {
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  onLogout() {
    console.log('User logged out');
  }

  viewProfile() {
    this.router.navigate(['/profile']).then(() => {
      console.log('Navigated to profile page');
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {
      console.log('Navigated to login page');
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']).then(() => {
      console.log('Navigated to register page');
    });
  }

  ngOnInit(): void { }
}
