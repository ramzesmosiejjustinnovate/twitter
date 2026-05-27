import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';
import { ProfileViewComponent } from '../profile-view/profile-view.component';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';

@Component({
  selector: 'app-profile-page',
  imports: [MatProgressSpinnerModule, ProfileViewComponent, ProfileEditComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly snackBar = inject(MatSnackBar);

  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(false);
  readonly isEditing = signal(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.profileService.getProfile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
      },
    });
  }

  onEdit(): void {
    this.isEditing.set(true);
  }

  onSave(updatedProfile: Profile): void {
    this.profileService.updateProfile(updatedProfile).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.isEditing.set(false);
        this.snackBar.open('Profile saved successfully ✓', 'Close', {
          duration: 3000,
        });
      },
      error: () => {
        this.snackBar.open('Failed to save profile', 'Close', { duration: 3000 });
      },
    });
  }

  onCancel(): void {
    this.isEditing.set(false);
  }
}
