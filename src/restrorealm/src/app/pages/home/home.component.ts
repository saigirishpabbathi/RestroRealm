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
        imageUrl: 'https://domesticgothess.com/wp-content/uploads/2021/02/vegan-truffled-mushroom-risotto.jpg',
        category: 'Main Course',
        featured: true
      },
      {
        id: 2,
        name: 'Seared Salmon Niçoise',
        description: 'Pan-seared Atlantic salmon served on a bed of haricots verts, cherry tomatoes, olives, and fingerling potatoes with a Dijon vinaigrette.',
        price: 28.50,
        imageUrl: 'https://wholeandheavenlyoven.com/wp-content/uploads/2016/05/Seared-Salmon-Nicoise-Salad8.jpg',
        category: 'Seafood',
        featured: true
      },
      {
        id: 3,
        name: 'Braised Short Rib Tagliatelle',
        description: 'Slow-braised beef short rib ragu tossed with fresh tagliatelle pasta, topped with shaved pecorino and micro herbs.',
        price: 26.95,
        imageUrl: 'https://assets.surlatable.com/m/32c1e22d33211384/72_dpi_webp-REC-469600_ButterBeRead.jpg',
        category: 'Pasta',
        featured: true
      },
      {
        id: 4,
        name: 'Crispy Duck Confit',
        description: 'Duck leg confit with crispy skin, served with orange-cranberry reduction, roasted root vegetables, and wild rice pilaf.',
        price: 32.00,
        imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e299a1389b39b36aa0bc6e2/2a52da47-269b-4626-9830-40d6701ce738/Duck+Confit+2020+square.jpg',
        category: 'Main Course',
        featured: true
      },
      {
        id: 5,
        name: 'Coconut Panna Cotta',
        description: 'Silky coconut milk panna cotta topped with passion fruit coulis, toasted coconut flakes, and edible flowers.',
        price: 12.95,
        imageUrl: 'https://stemandspoon.com/wp-content/uploads/2024/07/coconut-panna-cotta-featured-720x405.jpg',
        category: 'Dessert',
        featured: true
      },
      {
        id: 6,
        name: 'Grilled Vegetable Platter',
        description: 'Seasonal vegetables marinated in herbs and olive oil, grilled to perfection, and served with romesco sauce.',
        price: 18.50,
        imageUrl: 'https://www.healthygffamily.com/wp-content/uploads/2021/07/IMG_9889-scaled.jpg',
        category: 'Appetizer',
        featured: false
      },
      {
        id: 7,
        name: 'Classic Beef Wellington',
        description: 'Prime beef tenderloin wrapped in mushroom duxelles and prosciutto, encased in golden puff pastry.',
        price: 36.95,
        imageUrl: 'https://img.taste.com.au/wDW-ilIs/w720-h480-cfill-q80/taste/2020/04/may20_coconut-panna-cotta-160733-1.jpg',
        category: 'Main Course',
        featured: false
      }
    ];

    // Select 6 random menu items for the daily specials
    this.specialItems = allMenuItems.filter(item => item.featured).slice(0, 6);
  }
}
