import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MenuService } from '../../core/services/menu/menu.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../core/services/cart/cart.service';
import { ToasterComponent } from "../../shared/components/toaster/toaster.component";
import { environment } from '../../../environments/environment';

interface MenuItem {
  id: number;
  image: any;
  name: string;
  description: string;
  basePrice: number;
  calories: number;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, ToasterComponent],
  standalone: true,
})
export class MenuPageComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categoryName: string = '';
  toast: {
    message: string;
    type: 'success' | 'error';
  } | null = null;
  imageUrl = environment.imageUrl;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName') || '';
      this.fetchMenuItems();
    });
  }

  fetchMenuItems(): void {
    if(!this.categoryName) {
      this.categoryName = "All";
      this.menuService.getAllMenuItems().subscribe({
        next: (menuItems) => {
          this.menuItems = menuItems.map(item => ({
            ...item,
            calories: item.calories || 0,
          }));
        },
        error: (err) => {
          console.error('Error fetching menu items:', err);
        }
      });
    } else {
        this.menuService.getMenuItemsByCategoryName(this.categoryName).subscribe({
          next: (menuItems) => {
            this.menuItems = menuItems.map(item => ({
              ...item,
              calories: item.calories || 0
            }));
          },
          error: (err) => {
            console.error('Error fetching menu items:', err);
          }
        });
      }
  }

  addToCart(menuItem: MenuItem): void {
    this.cartService.addToCart(menuItem);
    this.showToast("Added "+ menuItem.name +" to cart", "success")
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.toast = { message, type };
    setTimeout(() => this.toast = null, 3000);
  }
}
