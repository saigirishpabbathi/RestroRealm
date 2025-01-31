import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  standalone: true,
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = {}; 
  isEditModalOpen: boolean = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => (this.users = data),
      (error) => console.error('Error fetching users', error)
    );
  }

   openEditModal(user: any): void {
    this.selectedUser = { ...user };
    this.isEditModalOpen = true;
  }

  saveChanges(): void {
    this.userService.updateUser(this.selectedUser.userId, {
      name: this.selectedUser.name,
      email: this.selectedUser.email,
      roleName: this.selectedUser.roleName
    }).subscribe(
      () => {
        alert('User updated successfully!');
        this.isEditModalOpen = false;
        this.loadUsers(); // Refresh user list
      },
      (error) => console.error('Error updating user', error)
    );
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter((user) => user.userId !== userId);
      });
    }
  }
}
