import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  standalone: true,
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  selectedFile: File | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (data) => (this.user = data),
      (error) => console.error('Error fetching user', error)
    );
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadProfileImage(): void {
    if (this.selectedFile) {
      this.userService.uploadProfileImage(this.selectedFile).subscribe(
        (imageUrl) => {
          this.user.profileImageUrl = imageUrl;
          alert('Profile image updated successfully!');
        },
        (error) => console.error('Error uploading image', error)
      );
    }
  }

  saveChanges(): void {
    this.userService.updateCurrentUser({ name: this.user.name, email: this.user.email }).subscribe(
      (updatedUser) => {
        this.user = updatedUser;
        alert('Profile updated successfully!');
      },
      (error) => console.error('Error updating profile', error)
    );
  }
}
