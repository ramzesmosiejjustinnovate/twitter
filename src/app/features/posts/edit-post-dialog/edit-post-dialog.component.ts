import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-edit-post-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-post-dialog.component.html',
  styleUrl: './edit-post-dialog.component.scss',
})
export class EditPostDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EditPostDialogComponent>);
  readonly post = inject<Post>(MAT_DIALOG_DATA);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', [Validators.required, Validators.maxLength(500)]],
    imageUrl: [''],
  });

  ngOnInit(): void {
    this.form.patchValue({
      title: this.post.title,
      content: this.post.content,
      imageUrl: this.post.imageUrl ?? '',
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
