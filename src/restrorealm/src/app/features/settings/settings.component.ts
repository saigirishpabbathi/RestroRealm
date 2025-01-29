import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../core/services/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  viewMode: 'card' | 'list' = 'card';
  settings: any[] = [];
  searchTerm: string = '';
  filteredSettings: any[] = [];
  
  constructor(
      private authService: AuthService, 
  ) {}

  ngOnInit(): void {
  }

  hasPermission(permission: string): boolean {
      return this.authService.hasPermission(permission);
  }

  onSearch() {
      this.applyFilters();
  }
  
  private applyFilters(): void {
      let filtered = [...this.settings];
      if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(role =>
              role.name.toLowerCase().includes(term) 
               || role.description.toLowerCase().includes(term)
          );
      }
      this.filteredSettings = filtered;
  }
}
