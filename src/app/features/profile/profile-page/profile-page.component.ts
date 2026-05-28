import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly fb = inject(FormBuilder);

  readonly user = signal<User | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly editMode = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    avatarUrl: ['', Validators.required],
    bio: ['', Validators.maxLength(200)],
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.usersService.getUser(1).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startEdit(): void {
    const u = this.user();
    if (!u) return;
    this.form.patchValue({
      name: u.name,
      avatarUrl: u.avatarUrl,
      bio: u.bio ?? '',
    });
    this.editMode.set(true);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  saveEdit(): void {
    if (this.form.invalid) return;
    const current = this.user();
    if (!current) return;

    const updated: User = {
      ...current,
      name: this.form.value.name!,
      avatarUrl: this.form.value.avatarUrl!,
      bio: this.form.value.bio ?? undefined,
    };

    this.saving.set(true);
    this.usersService.updateUser(updated).subscribe({
      next: (saved) => {
        this.user.set(saved);
        this.saving.set(false);
        this.editMode.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}
