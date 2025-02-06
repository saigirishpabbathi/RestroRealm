import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
=======
import { ReactiveFormsModule, FormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth/auth.service';
import { RoleService } from '../../core/services/role/role.service';
import { validDateFormatValidator } from '../../core/guards/validators/dateValidator';
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  standalone: true,
})
export class UserListComponent implements OnInit {
<<<<<<< HEAD
  users: any[] = [];
  selectedUser: any = {}; 
  isEditModalOpen: boolean = false; 

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
=======
  userForm: FormGroup;
  imageUrl = environment.imageUrl;
  placeholderImage = 'https://cdn-icons-png.flaticon.com/128/10412/10412528.png';
  users: any[] = [];
  selectedUser: any = {}; 
  isEditModalOpen: boolean = false; 
  loading = false;
  editingUser: any = null;
  toast: {
      message: string;
      type: 'success' | 'error';
  } | null = null;
  showDialog = false;
  roles: any[] = [];
  searchTerm: any;
  filteredUsers: any;
  selectedRole: any;

  constructor(
          private userService: UserService,
          private authService: AuthService,
          private roleService: RoleService,
          private fb: FormBuilder
        ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', [validDateFormatValidator]],
      roleId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => (this.users = data),
      (error) => console.error('Error fetching users', error)
    );
  }

<<<<<<< HEAD
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
=======
  loadRoles(): void{
    this.roleService.getRoles().subscribe(
      (data) => (this.roles = data),
      (error) => console.error('Error fetching users', error)
    );
  }

  onSubmit() {
    console.log("Submit button clicked");
      if (this.userForm.invalid) return;
      this.loading = true;
      const formData = this.userForm.value;
      const request = this.editingUser
          ? this.userService.updateUser(this.editingUser.userId, formData)
          : this.userService.createUser(formData);
      request.subscribe({
          next: () => {
              this.showToast(
                  `User ${this.editingUser ? 'updated' : 'created'} successfully`,
                  'success'
              );
              this.loadUsers();
              this.closeDialog();
          },
          error: (error) => {
              console.error("API Error:", error);
              this.showToast(error.message, 'error');
          },
          complete: () => (this.loading = false)
      });
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.users = this.users.filter((user) => user.userId !== userId);
      });
    }
  }
<<<<<<< HEAD
=======

  private showToast(message: string, type: 'success' | 'error') {
      this.toast = { message, type };
      setTimeout(() => this.toast = null, 3000);
  }

  openCreateDialog() {
      this.editingUser = null;
      this.userForm.reset();
      this.showDialog = true;
  }

  openEditDialog(user: any) {
      this.editingUser = user;
      this.userForm.patchValue({
          name: user.name,
          email: user.email,
          dateOfBirth: user.dateOfBirth,
          roleId: user.role.id
      });
      this.showDialog = true;
  }

  closeDialog() {
      this.showDialog = false;
      this.editingUser = null;
      this.userForm.reset();
  }

  onSearch() {
      this.applyFilters();
  }

  filterByRole(role: any): void {
      this.selectedRole = this.selectedRole === role ? null : role;
      this.applyFilters();
  }
  
  private applyFilters(): void {
      let filtered = [...this.users];
      if (this.selectedRole) {
          filtered = filtered.filter(user => 
              user.role.id === this.selectedRole.id
          );
      }
      if (this.searchTerm) {
          const term = this.searchTerm.toLowerCase();
          filtered = filtered.filter(user =>
            user.name.toLowerCase().includes(term) ||
            user.description.toLowerCase().includes(term)
          );
      }
      this.filteredUsers = filtered;
  }
>>>>>>> 146a590 (Role Permission UI, Users list and minor bug fixes)
}
