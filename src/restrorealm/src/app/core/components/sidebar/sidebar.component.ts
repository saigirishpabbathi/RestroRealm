import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../../shared/models/user.model';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { from, Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
    isExpanded = false;
    user: User | null = null;
    private subscriptions: Subscription[] = [];
    logoPath = '../../../../assets/logo.png';

    constructor(
        private authService: AuthService,
        private sidebarService: SidebarService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.sidebarService.isOpen$.subscribe(
                isExpanded => this.isExpanded = isExpanded
            ),
            this.authService.user$.subscribe(
                user => this.user = user
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    closeSidebar(): void {
        this.sidebarService.close();
    }

    toggleSidebar(): void {
        this.sidebarService.toggle();
    }

    hasPermission(requiredPermissions: string[]): boolean {
        if (!this.user?.role) return false;
        
        const userRole = this.user.role.toLowerCase();
        return requiredPermissions.includes(userRole);
    }
}
