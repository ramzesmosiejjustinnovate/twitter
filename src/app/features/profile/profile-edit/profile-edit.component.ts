import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-profile-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) profile!: Profile;
  @Output() saved = new EventEmitter<Profile>();
  @Output() cancelled = new EventEmitter<void>();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    avatarUrl: [
      '',
      [Validators.pattern(/^(https?:\/\/).+/)],
    ],
    bio: ['', [Validators.maxLength(300)]],
  });

  ngOnInit(): void {
    this.form.patchValue({
      name: this.profile.name,
      avatarUrl: this.profile.avatarUrl,
      bio: this.profile.bio ?? '',
    });
  }

  save(): void {
    if (this.form.valid) {
      const { name, avatarUrl, bio } = this.form.value;
      this.saved.emit({
        ...this.profile,
        name: name!,
        avatarUrl: avatarUrl || this.profile.avatarUrl,
        bio: bio || undefined,
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
