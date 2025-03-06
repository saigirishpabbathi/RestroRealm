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
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  userHasPermission: boolean = false; 
  imageUrl = environment.imageUrl;
  currentTime = new Date();
  showAgeVerification: boolean = false;
  tempBirthDate: string = '';
  private ageVerificationResolve: ((value: boolean) => void) | null = null;
  
  // Placeholder image path for missing images
  placeholderImagePath: string = 'assets/placeholder-food.jpg';
  
  // Category being verified for age restriction
  currentCategory: Category | null = null;
  
  // Store verified age status (set after successful age verification)
  // Using static properties to persist across page navigations
  private static userVerifiedAge: boolean = false;
  private static userDateOfBirth: string | null = null;

  constructor(
    private menuService: MenuService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
    // Keep currentTime updated
    setInterval(() => {
      this.currentTime = new Date();
    }, 60000); // Update every minute
    
    // Check if user is logged in and has DOB stored in their profile
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo.dateOfBirth) {
      CategoryPageComponent.userDateOfBirth = userInfo.dateOfBirth;
      const age = this.calculateAge(userInfo.dateOfBirth);
      if (age !== null && age >= 18) {
        CategoryPageComponent.userVerifiedAge = true;
      }
    }
  }

  fetchCategories(): void {
    this.menuService.getCategoriesNoHeaders().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => ({
          ...category,
          imageUrl: category.imageUrl || this.placeholderImagePath
        }));
        this.filteredCategories = [...this.categories];
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }
  
  // Search categories
  searchCategories(term: string): void {
    this.searchTerm = term.toLowerCase().trim();
    if (!this.searchTerm) {
      this.filteredCategories = [...this.categories];
      return;
    }
    
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(this.searchTerm)
    );
  }

  // Get category image URL with fallback
  getCategoryImageUrl(category: Category): string {
    return (category && category.imageUrl) 
      ? this.imageUrl + category.imageUrl 
      : this.placeholderImagePath;
  }

  // Check if a category is available based on time
  isCategoryAvailable(category: Category): boolean {
    if (!category || !category.availableStartTime || !category.availableEndTime) {
      return true; // If availability times aren't set, assume always available
    }

    const now = this.currentTime;
    const [startHour, startMinute] = category.availableStartTime.split(':').map(Number);
    const [endHour, endMinute] = category.availableEndTime.split(':').map(Number);
    
    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    return now >= startTime && now <= endTime;
  }

  navigateToMenu(category: Category) {
    if (!this.isCategoryAvailable(category)) {
      return; // Already disabled, but this is a safeguard
    }
  
    if (category.ageRestricted) {
      // First check if user already verified their age during this session
      if (CategoryPageComponent.userVerifiedAge) {
        this.redirectToMenu(category.name);
        return;
      }
      
      // Next check if user is logged in with DOB in profile
      const dob = this.authService.getUserInfo()?.dateOfBirth;
      const userAge = this.calculateAge(dob);

      if (userAge === null) {
        // If user already provided DOB in this session but not logged in
        if (CategoryPageComponent.userDateOfBirth) {
          const sessionAge = this.calculateAge(CategoryPageComponent.userDateOfBirth);
          if (sessionAge !== null && sessionAge >= 18) {
            CategoryPageComponent.userVerifiedAge = true;
            this.redirectToMenu(category.name);
            return;
          } else if (sessionAge !== null) {
            alert('You must be at least 18 years old to access this category');
            return;
          }
        }
        
        // Need to ask for verification
        this.currentCategory = category;
        this.verifyAge().then(verified => {
          if (verified && this.currentCategory) {
            this.redirectToMenu(this.currentCategory.name);
            this.currentCategory = null;
          }
        });
        return;
      }
      
      if (userAge < 18) {
        alert('You must be at least 18 years old to access this category');
        return;
      } else {
        // User is verified through profile
        CategoryPageComponent.userVerifiedAge = true;
      }
    }

    this.redirectToMenu(category.name);
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
      const isVerified = age !== null && age >= 18;
      
      // Store the verification status and DOB for future checks in this session
      if (isVerified) {
        CategoryPageComponent.userVerifiedAge = true;
        CategoryPageComponent.userDateOfBirth = this.tempBirthDate;
      }
      
      this.ageVerificationResolve?.(isVerified);
    } else {
      this.ageVerificationResolve?.(false);
    }
    this.resetAgeVerification();
  }

  cancelAgeVerification() {
    this.showAgeVerification = false;
    this.ageVerificationResolve?.(false);
    this.currentCategory = null;
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
