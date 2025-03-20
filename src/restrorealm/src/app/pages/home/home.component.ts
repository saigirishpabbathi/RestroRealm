import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  featured: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  specialItems: MenuItem[] = [];

  constructor() {}

  ngOnInit(): void {
    // Simulating menu items from a database
    const allMenuItems: MenuItem[] = [
      {
        id: 1,
        name: 'Truffle Mushroom Risotto',
        description: 'Creamy Arborio rice cooked with wild mushrooms, finished with black truffle oil and aged Parmesan cheese.',
        price: 24.95,
        imageUrl: '/api/placeholder/400/320',
        category: 'Main Course',
        featured: true
      },
      {
        id: 2,
        name: 'Seared Salmon Niçoise',
        description: 'Pan-seared Atlantic salmon served on a bed of haricots verts, cherry tomatoes, olives, and fingerling potatoes with a Dijon vinaigrette.',
        price: 28.50,
        imageUrl: '/api/placeholder/400/320',
        category: 'Seafood',
        featured: true
      },
      {
        id: 3,
        name: 'Braised Short Rib Tagliatelle',
        description: 'Slow-braised beef short rib ragu tossed with fresh tagliatelle pasta, topped with shaved pecorino and micro herbs.',
        price: 26.95,
        imageUrl: '/api/placeholder/400/320',
        category: 'Pasta',
        featured: true
      },
      {
        id: 4,
        name: 'Crispy Duck Confit',
        description: 'Duck leg confit with crispy skin, served with orange-cranberry reduction, roasted root vegetables, and wild rice pilaf.',
        price: 32.00,
        imageUrl: '/api/placeholder/400/320',
        category: 'Main Course',
        featured: true
      },
      {
        id: 5,
        name: 'Coconut Panna Cotta',
        description: 'Silky coconut milk panna cotta topped with passion fruit coulis, toasted coconut flakes, and edible flowers.',
        price: 12.95,
        imageUrl: '/api/placeholder/400/320',
        category: 'Dessert',
        featured: true
      },
      {
        id: 6,
        name: 'Grilled Vegetable Platter',
        description: 'Seasonal vegetables marinated in herbs and olive oil, grilled to perfection, and served with romesco sauce.',
        price: 18.50,
        imageUrl: '/api/placeholder/400/320',
        category: 'Appetizer',
        featured: false
      },
      {
        id: 7,
        name: 'Classic Beef Wellington',
        description: 'Prime beef tenderloin wrapped in mushroom duxelles and prosciutto, encased in golden puff pastry.',
        price: 36.95,
        imageUrl: '/api/placeholder/400/320',
        category: 'Main Course',
        featured: false
      }
    ];

    // Select 6 random menu items for the daily specials
    this.specialItems = allMenuItems.filter(item => item.featured).slice(0, 6);
  }
}
