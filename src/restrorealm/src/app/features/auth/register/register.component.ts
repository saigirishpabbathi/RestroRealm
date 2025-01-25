import { Component } from '@angular/core';
import { ToasterComponent } from "../../../shared/components/toaster/toaster.component";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ToasterComponent, 
    ReactiveFormsModule, 
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  toast: { message: string; type: 'success' | 'error' } | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async handleRegister() {
    if (this.registerForm.invalid) return;
    
    this.loading = true;
    try {
      this.toast = {
        message: 'Registration successful!',
        type: 'success'
      };
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.router.navigate(['/login']);
    } catch (error) {
      this.toast = {
        message: 'Registration failed. Please try again.',
        type: 'error'
      };
    } finally {
      this.loading = false;
    }
  }
}
