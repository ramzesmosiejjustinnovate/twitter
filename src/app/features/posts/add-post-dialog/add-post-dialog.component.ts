import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-post-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-post-dialog.component.html',
  styleUrl: './add-post-dialog.component.scss',
})
export class AddPostDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<AddPostDialogComponent>);

  readonly form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    content: ['', [Validators.required, Validators.maxLength(500)]],
    imageUrl: [''],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
