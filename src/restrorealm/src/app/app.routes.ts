import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { MenuComponent } from './features/menu/menu.component';
import { CategoryComponent } from './features/category/category.component';
import { MenuOptionComponent } from './features/menu-option/menu-option.component';
import { RoleComponent } from './features/roles/roles.component';
import { SettingsComponent } from './core/components/settings/settings.component';
import { PermissionsComponent } from './features/permissions/permissions.component';
import { MenuAddonComponent } from './features/menu-addon/menu-addon.component';
import { CategoryPageComponent } from './pages/category-page/category-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
<<<<<<< HEAD
import { UserProfileComponent } from './features/user-profile/user-profile.component';
=======
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
import { UserListComponent } from './features/user-list/user-list.component';
import { UserProfileComponent } from './features/user-profile/user-profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
<<<<<<< HEAD
    { path: 'profile', component: ProfileComponent },
    { path: 'users', component: UserListComponent }, // Admin Panel
    { path: 'profiles', component: UserProfileComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
=======
>>>>>>> beded1a (User Module Implemented Partially)
    { path: 'categories', component: CategoryPageComponent },
    { path: 'menu/:categoryName', component: MenuPageComponent },
<<<<<<< HEAD
    { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
=======
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'settings/users', component: UserListComponent, canActivate: [AuthGuard] },
    { path: 'settings/menu', component: MenuComponent, canActivate: [AuthGuard] },
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
    { path: 'settings/category', component: CategoryComponent, canActivate: [AuthGuard] },
    { path: 'settings/role', component: RoleComponent, canActivate: [AuthGuard] },
    { path: 'settings/permission', component: PermissionsComponent, canActivate: [AuthGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
    { path: 'settings/menu-addon', component: MenuAddonComponent, canActivate: [AuthGuard] },
    { path: 'settings/menu-option', component: MenuOptionComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: UserProfileComponent, canActivate:[AuthGuard] },
    //{ path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
