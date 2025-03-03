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
  showAgeVerification: boolean = false;
  tempBirthDate: string = '';
  private ageVerificationResolve: ((value: boolean) => void) | null = null;

  constructor(
    private menuService: MenuService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.menuService.getCategoriesNoHeaders().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => ({
          ...category,
          imageUrl: category.imageUrl || 'assets/placeholder.png'
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
      const userAge = this.calculateAge(dob);

      if (userAge === null) {
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
    this.showAgeVerification = true;
    return new Promise((resolve) => {
      this.ageVerificationResolve = resolve;
    });
  }

  confirmAge() {
    this.showAgeVerification = false;
    if (this.tempBirthDate) {
      const birthDate = new Date(this.tempBirthDate);
      const age = this.calculateAge(birthDate);
      this.ageVerificationResolve?.(age !== null && age >= 18);
    } else {
      this.ageVerificationResolve?.(false);
    }
    this.resetAgeVerification();
  }

  cancelAgeVerification() {
    this.showAgeVerification = false;
    this.ageVerificationResolve?.(false);
    this.resetAgeVerification();
  }

  private resetAgeVerification() {
    this.tempBirthDate = '';
    this.ageVerificationResolve = null;
  }

  private calculateAge(dob: string | Date | undefined): number | null {
    if (!dob) return null;
  
    const birthDate = dob instanceof Date ? dob : new Date(dob);
    if (isNaN(birthDate.getTime())) return null;
  
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || 
        (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  private redirectToMenu(categoryName: string) {
    this.router.navigate(['/menu', encodeURIComponent(categoryName)]);
  }
}
