import { Component, OnInit, inject } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuService } from '../../core/services/menu/menu.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToasterComponent } from "../../shared/components/toaster/toaster.component";

@Component({
    selector: 'app-menu',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToasterComponent],
    standalone: true,
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    // private readonly oidcSecurityService = inject(OidcSecurityService);
    onImageSelect($event: Event) {
    // throw new Error('Method not implemented.');
    }
    viewDetails(_t22: any) {
    // throw new Error('Method not implemented.');
    }
    menuItems: any[] = [];
    filteredMenuItems: any[] = [];
    categories: any[] = [];
    selectedCategory: any = null;
    searchTerm: string = '';
    showDialog = false;
    editingItem: any = null;
    menuForm: FormGroup;
    loading = false;
    toast: {
      message: string;
      type: 'success' | 'error';
    } | null = null;

    constructor(
        private menuService: MenuService,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.menuForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', [Validators.required, Validators.min(0)]],
            categoryId: ['', Validators.required],
            image: [null]
        });
    }

    ngOnInit() {
        this.loadMenuItems();
        this.loadCategories();
    }

    loadMenuItems() {
        this.menuService.getAllMenuItems().subscribe({
            next: (items) => {
                this.menuItems = items;
                this.filteredMenuItems = items;
            },
            error: (error) => this.showToast(error.message, 'error')
        });
    }

    loadCategories() {
        this.menuService.getCategories().subscribe({
            next: (categories) => this.categories = categories,
            error: (error) => this.showToast(error.message, 'error')
        });
    }

    openCreateDialog() {
        this.editingItem = null;
        this.menuForm.reset();
        this.showDialog = true;
    }

    openEditDialog(item: any) {
        this.editingItem = item;
        this.menuForm.patchValue({
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: item.categoryId
        });
        this.showDialog = true;
    }

    closeDialog() {
        this.showDialog = false;
        this.editingItem = null;
        this.menuForm.reset();
    }

    onSubmit() {
        if (this.menuForm.invalid) return;

        this.loading = true;
        const formData = new FormData();
        Object.keys(this.menuForm.value).forEach(key => {
            formData.append(key, this.menuForm.value[key]);
        });

        const request = this.editingItem 
            ? this.menuService.updateMenuItem(this.editingItem.id, formData)
            : this.menuService.createMenuItem(formData);

        request.subscribe({
            next: () => {
                this.showToast(
                    `Item ${this.editingItem ? 'updated' : 'created'} successfully`, 
                    'success'
                );
                this.loadMenuItems();
                this.closeDialog();
            },
            error: (error) => this.showToast(error.message, 'error'),
            complete: () => this.loading = false
        });
    }

    deleteItem(item: any) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.menuService.deleteMenuItem(item.id).subscribe({
                next: () => {
                    this.showToast('Item deleted successfully', 'success');
                    this.loadMenuItems();
                },
                error: (error) => this.showToast(error.message, 'error')
            });
        }
    }

    filterByCategory(category: any) {
        this.selectedCategory = category;
        this.applyFilters();
    }

    onSearch() {
        this.applyFilters();
    }

    private applyFilters() {
        let filtered = [...this.menuItems];
        
        if (this.selectedCategory) {
            filtered = filtered.filter(item => 
                item.categoryId === this.selectedCategory.id
            );
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        this.filteredMenuItems = filtered;
    }

    private showToast(message: string, type: 'success' | 'error') {
        this.toast = { message, type };
        setTimeout(() => this.toast = null, 3000);
    }

    hasPermission(permission: string): boolean {
        return this.authService.hasPermission(permission);
    }
}

