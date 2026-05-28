import { Component, inject, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { PostsService } from '../../../core/services/posts.service';
import { Post } from '../../../core/models/post.model';
import { PostCardComponent } from '../post-card/post-card.component';

@Component({
  selector: 'app-posts-page',
  imports: [MatProgressSpinnerModule, MatButtonModule, MatIconModule, PostCardComponent],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly dialog = inject(MatDialog);

  readonly posts = signal<Post[]>([]);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts.sort((a, b) => b.id - a.id));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onLike(postId: number): void {
    const post = this.posts().find((p) => p.id === postId);
    if (!post) return;
    this.postsService.updatePost(postId, { likes: post.likes + 1 }).subscribe((updated) => {
      this.posts.update((posts) => posts.map((p) => (p.id === postId ? { ...updated, user: p.user } : p)));
    });
  }

  onDelete(postId: number): void {
    this.postsService.deletePost(postId).subscribe(() => {
      this.posts.update((posts) => posts.filter((p) => p.id !== postId));
    });
  }

  onEdit(post: Post): void {
    import('../edit-post-dialog/edit-post-dialog.component').then(({ EditPostDialogComponent }) => {
      const dialogRef = this.dialog.open(EditPostDialogComponent, {
        width: '520px',
        data: post,
        panelClass: 'tweexxtter-dialog',
      });
      dialogRef.afterClosed().subscribe((result: Partial<Post> | undefined) => {
        if (result) {
          this.postsService.updatePost(post.id, result).subscribe((updated) => {
            this.posts.update((posts) => posts.map((p) => (p.id === post.id ? { ...updated, user: p.user } : p)));
          });
        }
      });
    });
  }

  openAddDialog(): void {
    import('../add-post-dialog/add-post-dialog.component').then(({ AddPostDialogComponent }) => {
      const dialogRef = this.dialog.open(AddPostDialogComponent, {
        width: '520px',
        panelClass: 'tweexxtter-dialog',
      });
      dialogRef.afterClosed().subscribe((result: Partial<Post> | undefined) => {
        if (result) {
          this.postsService.addPost({
            title: result.title ?? '',
            content: result.content ?? '',
            imageUrl: result.imageUrl ?? '',
            userId: 1,
            likes: 0,
          }).subscribe((newPost) => {
            this.posts.update((posts) => [newPost, ...posts]);
          });
        }
      });
    });
  }
}
