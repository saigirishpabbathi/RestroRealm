import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MenuComponent } from './features/menu/menu.component';
import { CategoryComponent } from './features/category/category.component';
import { MenuOptionComponent } from './features/menu-option/menu-option.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
    { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
    { path: 'menu-option', component: MenuOptionComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
