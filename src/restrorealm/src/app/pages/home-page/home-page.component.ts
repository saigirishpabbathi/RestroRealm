import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [ CommonModule ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {
  slideshowImages: string[] = [
    'https://dynl.mktgcdn.com/p/8KbNTqKAhClt0iXY6Ucww4Lm_bFRVE5lpOpJhp8xXwM/500x500',
    'https://twoclovesinapot.com/wp-content/uploads/2021/06/IMG_2544_jpg-500x500.jpg',
    'https://5.imimg.com/data5/SELLER/Default/2024/3/402535934/UC/JV/ZI/24519806/soft-drinks-500x500.jpg',
    'https://www.teaforturmeric.com/wp-content/uploads/2024/09/Tandoori-Chicken-Recipe-500x500.jpg',
    'https://www.between2kitchens.com/wp-content/uploads/2021/10/Pani-Puri-filling-27-of-1-500x500.jpg'
  ];
  currentSlideIndex = 0;
  slideInterval: any;
  daySpecials = [
    { name: 'Grilled Salmon', image: 'assets/images/salmon.jpg' },
    { name: 'Tandoori Chicken', image: 'assets/images/tandoori.jpg' },
    { name: 'Pasta Alfredo', image: 'assets/images/pasta.jpg' }
  ];
  menuItems = [
    { name: 'Burger', image: 'assets/images/burger.jpg' },
    { name: 'Pizza', image: 'assets/images/pizza.jpg' },
    { name: 'Pasta', image: '' },  
    { name: 'Sushi', image: 'assets/images/sushi.jpg' }
  ];
  filteredMenu: { name: string; image: string }[] = [];
  categories: { name: string; image: string }[] = [
    { name: 'Biryani', image: 'assets/images/biryani.jpg' },
    { name: 'Fast Food', image: '' }, 
    { name: 'Seafood', image: 'assets/images/seafood.jpg' }
  ];
  filteredCategories: { name: string; image: string }[] = [];

  ngOnInit() {
    this.startSlideshow();
    this.filteredMenu = this.menuItems.filter(item => item.image);
    this.filteredCategories = this.categories.filter(category => category.image);
  }

  startSlideshow() {
    this.slideInterval = setInterval(() => this.nextSlide(), 3000);
  }
  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slideshowImages.length;
  }
  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slideshowImages.length) % this.slideshowImages.length;
  }
  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }
  stopSlideshow() {
    clearInterval(this.slideInterval);
  }  

  ngOnDestroy() {
    this.stopSlideshow();
  }

  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/placeholder.jpg';
    img.alt = 'Image not available';
  }

  onImageLoad() {
    // Optional: Add any image load tracking or analytics here
  }
}