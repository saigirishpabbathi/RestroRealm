<<<<<<< HEAD
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
=======
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../environments/environment';
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)

@Injectable({
  providedIn: 'root',
})
export class UserService {
<<<<<<< HEAD
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
=======
  baseUrl = environment.apiUrl + '/user';

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

  private getHeadersNoJson() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getRefreshToken()}`,
    });
  }
  
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`,{ headers: this.getHeaders() });
  }

<<<<<<< HEAD
  // ✅ Get user by ID (Admin only)
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }

<<<<<<< HEAD
  // ✅ Get logged-in user details
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/me`,{ headers: this.getHeaders() });
  }

<<<<<<< HEAD
  // ✅ Update user details (Admin)
=======
  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, userData,{ headers: this.getHeaders() });
  }

>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  updateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, userData,{ headers: this.getHeaders() });
  }

<<<<<<< HEAD
  // ✅ Update logged-in user profile
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  updateCurrentUser(userData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/me`, userData,{ headers: this.getHeaders() });
  }

<<<<<<< HEAD
  // ✅ Upload profile image
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.put(`${this.baseUrl}/me/profile-image`, formData,{ headers: this.getHeadersNoJson() });
  }

<<<<<<< HEAD
  // ✅ Delete user (Admin)
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }
}

