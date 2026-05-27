import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Input() author: User | undefined;

  @Output() liked = new EventEmitter<number>();
  @Output() edited = new EventEmitter<Post>();
  @Output() deleted = new EventEmitter<number>();
}
