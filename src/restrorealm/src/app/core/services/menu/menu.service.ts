import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = environment.apiUrl;
  private readonly categoriesSubject = new BehaviorSubject<any[]>([]);
  private readonly menuItemsSubject = new BehaviorSubject<any[]>([]);
  private readonly categories$ = this.categoriesSubject.asObservable();
  private readonly menuItems$ = this.menuItemsSubject.asObservable();
  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) private platformId: Object 
    ) {
      this.getCategories();
      this.getAllMenuItems();
    }

    getCategories(): Observable<any[]> {
      this.http.get<any[]>(`${this.apiUrl}/menu/categories`)
        .subscribe({
          next: (categories) => {
            this.categoriesSubject.next(categories);
          },
          error: (err) => {
            console.error('Error fetching categories:', err);
          }
        });
      
      return this.categories$;
    }
  
  getAllMenuItems(): Observable<any[]> {
      this.http.get<any[]>(`${this.apiUrl}/menu/`)
        .subscribe({
          next: (menuItems) => {
            this.menuItemsSubject.next(menuItems);
          },
          error: (err) => {
            console.error('Error fetching menu items:', err);
          }
        });

      return this.menuItems$;
  }
  
  getMenuItemsByCategory(categoryId: string) {
    
  }
  getMenuItemById(itemId: string) {
    
  }
  createMenuItem(item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/menu/`, item);
  }
  updateMenuItem(itemId: number, item: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/menu/${itemId}`, item);
  }
  deleteMenuItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/menu/${itemId}`);
  }
  
}
