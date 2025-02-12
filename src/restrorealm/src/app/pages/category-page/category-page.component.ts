import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../core/services/menu/menu.service';
import { Category } from '../../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-category',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  standalone: true,
})
export class CategoryPageComponent implements OnInit {
  categories: Category[] = [];
  userHasPermission: boolean = false; 
  imageUrl = environment.imageUrl;
  currentTime = new Date();

  constructor(
    private menuService: MenuService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.menuService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => ({
          ...category,
          imageUrl: category.imageUrl || 'assets/placeholder.png' // Default image until backend supports it
        }));
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  navigateToMenu(category: Category) {
    if (!this.isCategoryAvailable(category)) {
      alert(`This category is only available between ${category.availableStartTime} and ${category.availableEndTime}`);
      return;
    }

    if (category.ageRestricted) {
      const dob = this.authService.getUserInfo()?.dateOfBirth;

      const userAge = this.calculateUserAge(dob);
      
      if (!userAge) {
        this.verifyAge().then(verified => {
          if (verified) this.redirectToMenu(category.name);
        });
        return;
      }
      
      if (userAge < 18) {
        alert('You must be at least 18 years old to access this category');
        return;
      }
    }

    this.redirectToMenu(category.name);
  }

  calculateUserAge(dob: any) {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
  
  private isCategoryAvailable(category: Category): boolean {
    const now = this.currentTime;
    const [startHour, startMinute] = category.availableStartTime.split(':').map(Number);
    const [endHour, endMinute] = category.availableEndTime.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHour, startMinute);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute);

    return now >= startTime && now <= endTime;
  }

  private verifyAge(): Promise<boolean> {
    return new Promise((resolve) => {
      // const dialogRef = this.dialog.open(AgeVerificationDialogComponent, {
      //   width: '400px',
      //   disableClose: true
      // });

      // dialogRef.afterClosed().subscribe(result => {
      //   if (result) {
      //     this.userService.storeUserAge(result.age);
      //     resolve(result.age >= 18);
      //   }
      //   resolve(false);
      // });
    });
  }

  private redirectToMenu(categoryName: string) {
    this.router.navigate(['/menu', categoryName]);
  }
}
