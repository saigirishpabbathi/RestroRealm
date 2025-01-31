import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users'; // Update with your actual backend URL

  constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object, 
        private authService: AuthService
      ) {
        this.getHeaders();
      }
  
      private getHeaders() {
        return new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authService.getRefreshToken()}`,
        });
      }

  // ✅ Get all users (Admin only)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`,{ headers: this.getHeaders() });
  }

  // ✅ Get user by ID (Admin only)
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }

  // ✅ Get logged-in user details
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`,{ headers: this.getHeaders() });
  }

  // ✅ Update user details (Admin)
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, userData,{ headers: this.getHeaders() });
  }

  // ✅ Update logged-in user profile
  updateCurrentUser(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, userData,{ headers: this.getHeaders() });
  }

  // ✅ Upload profile image
  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put(`${this.baseUrl}/me/profile-image`, formData,{ headers: this.getHeaders() });
  }

  // ✅ Delete user (Admin)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }
}

