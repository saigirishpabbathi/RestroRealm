import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToasterComponent } from '../../../shared/components/toaster/toaster.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToasterComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  toast: { 
    message: string; 
    type: 'success' | 'error' 
  } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  navigate(route: string) {
    this.router.navigate([route]).then(() => {
      console.log('Navigated to login page');
    });
  }

  handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      if (
        this.loginForm.value.email === 'test@example.com' &&
        this.loginForm.value.password === 'password'
      ) {
        this.toast = { message: 'Login successful!', type: 'success' };
      } else {
        this.toast = { message: 'Invalid credentials.', type: 'error' };
      }

      setTimeout(() => (this.toast = null), 3000);
    }, 2000);
  }
}
