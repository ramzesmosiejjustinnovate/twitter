import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  readonly post = input.required<Post>();

  readonly liked = output<number>();
  readonly edited = output<Post>();
  readonly deleted = output<number>();

  onLike(): void {
    this.liked.emit(this.post().id);
  }

  onEdit(): void {
    this.edited.emit(this.post());
  }

  onDelete(): void {
    this.deleted.emit(this.post().id);
  }
}
