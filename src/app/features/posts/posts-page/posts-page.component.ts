import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

import { PostsStateService } from '../../../core/services/posts-state.service';
import { UsersService } from '../../../core/services/users.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { User } from '../../../core/models/user.model';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-posts-page',
  imports: [MatProgressSpinnerModule, PostCardComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent implements OnInit {
  private readonly postsStateService = inject(PostsStateService);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);

  private readonly users = signal<User[]>([]);

  readonly posts = this.postsStateService.posts;
  readonly loading = this.postsStateService.loading;

  ngOnInit(): void {
    this.postsStateService.loadPosts();
    this.usersService.getUsers().subscribe((users) => this.users.set(users));
  }

  getAuthor(userId: number): User | undefined {
    return this.users().find((u) => u.id === userId);
  }

  onLike(postId: number): void {
    this.postsStateService.likePost(postId);
  }

  onDelete(postId: number): void {
    this.postsStateService.deletePost(postId);
  }

  onEdit(post: Post): void {
    import('../edit-post-dialog/edit-post-dialog.component').then(
      ({ EditPostDialogComponent }) => {
        const dialogRef = this.dialog.open(EditPostDialogComponent, {
          width: '520px',
          data: post,
          panelClass: 'tweexxtter-dialog',
        });

        dialogRef
          .afterClosed()
          .subscribe((result: Partial<Post> | undefined) => {
            if (result) {
              this.postsStateService.updatePost(post.id, result);
            }
          });
      }
    );
  }
}
