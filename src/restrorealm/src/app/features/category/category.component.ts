import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { MenuService } from '../../core/services/menu/menu.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToasterComponent } from "../../shared/components/toaster/toaster.component";

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, ToasterComponent],
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
    viewMode: 'card' | 'list' = 'card';
    categories: any[] = [];
    editCategory: boolean = false;
    createCategory: boolean = false;
    deleteSingleCategory: boolean = false;
    readSingleCategory: boolean = false;
    toast: {
        message: string;
        type: 'success' | 'error';
    } | null = null;
    searchTerm: string = '';
    filteredCategories: any[] = [];
    editingCategory: any = null;
    categoryForm: FormGroup;
    showDialog = false;
    loading = false;

    ngOnInit(): void {
        this.editCategory = this.hasPermission('UPDATE_SINGLE_CATEGORY');
        this.createCategory = this.hasPermission('CREATE_CATEGORY');
        this.deleteSingleCategory = this.hasPermission('DELETE_SINGLE_CATEGORY');
        this.readSingleCategory = this.hasPermission('READ_SINGLE_CATEGORY');
        this.loadCategories();

    }

    constructor(
        private fb: FormBuilder, 
        private authService: AuthService, 
        private menuService: MenuService
    ) {
        const time = new Date();
        this.categoryForm = this.fb.group({
            name: ['', Validators.required],
            description: [''],
            ageRestricted: [false, Validators.required],
            availableStartTime: [time, Validators.required],
            availableEndTime: [time, Validators.required],
        });
    }

    loadCategories() {
        this.menuService.getCategories().subscribe({
            next: (categories) => {
                this.categories = categories
                this.filteredCategories = categories;
            },
            error: (error) => this.showToast(error.message, 'error')
        });
    }

    private showToast(message: string, type: 'success' | 'error') {
        this.toast = { message, type };
        setTimeout(() => this.toast = null, 3000);
    }

    hasPermission(permission: string): boolean {
        return this.authService.hasPermission(permission);
    }

    onSearch() {
        this.applyFilters();
    }
    
    private applyFilters(): void {
        let filtered = [...this.categories];
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(term) 
                // || category.description.toLowerCase().includes(term)
            );
        }
        this.filteredCategories = filtered;
    }

    openCreateDialog() {
        this.editingCategory = null;
        this.categoryForm.reset();
        this.showDialog = true;
    }

    viewDetails(category: any) {
        console.log('Viewing details for:', category);
        alert(`Details for ${category.name}:\n${category.description}\nPrice: $${category.basePrice}`);
    }

    openEditDialog(category: any) {
        this.editingCategory = category;
        this.categoryForm.patchValue({
            name: category.name,
            description: category.description,
            ageRestricted: category.ageRestricted,
            availableStartTime: category.availableStartTime,
            availableEndTime: category.availableEndTime,
        });
        this.showDialog = true;
    }

    deleteCategory(category: any) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.menuService.deleteCategory(category.id).subscribe({
                next: () => {
                    this.showToast('Category deleted successfully', 'success');
                    this.loadCategories();
                },
                error: (error) => this.showToast(error.message, 'error')
            });
        }
    }

    onSubmit() {
        if (this.categoryForm.invalid) return;

        this.loading = true;
        const categoryData = this.categoryForm.value;

        if(categoryData.availableStartTime >= categoryData.availableEndTime) {
            this.showToast('Start time must be less than end time', 'error');
            this.loading = false;
            return;
        }

        const request = this.editingCategory
            ? this.menuService.updateCategory(this.editingCategory.id, categoryData)
            : this.menuService.createCategory(categoryData);

        request.subscribe({
            next: () => {
                this.showToast(
                    `Category ${this.editingCategory ? 'updated' : 'created'} successfully`,
                    'success'
                );
                this.loadCategories();
                this.closeDialog();
            },
            error: (error) => this.showToast(error.message, 'error'),
            complete: () => this.loading = false
        });
    }

    closeDialog() {
        this.showDialog = false;
        this.editingCategory = null;
        this.categoryForm.reset();
    }
}
