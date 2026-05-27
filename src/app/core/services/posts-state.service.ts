import { Injectable, inject, signal, computed } from '@angular/core';

import { PostsService } from './posts.service';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsStateService {
  private readonly postsService = inject(PostsService);

  private readonly _posts = signal<Post[]>([]);
  private readonly _loading = signal(false);

  readonly posts = computed(() =>
    [...this._posts()].sort((a, b) => b.id - a.id)
  );
  readonly loading = this._loading.asReadonly();

  loadPosts(): void {
    this._loading.set(true);
    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this._posts.set(posts);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  addPost(data: Omit<Post, 'id'>): void {
    this.postsService.addPost(data).subscribe((newPost) => {
      this._posts.update((posts) => [...posts, newPost]);
    });
  }

  likePost(id: number): void {
    const post = this._posts().find((p) => p.id === id);
    if (!post) return;
    this.postsService
      .updatePost(id, { likes: post.likes + 1 })
      .subscribe((updated) => {
        this._posts.update((posts) =>
          posts.map((p) => (p.id === id ? updated : p))
        );
      });
  }

  deletePost(id: number): void {
    this.postsService.deletePost(id).subscribe(() => {
      this._posts.update((posts) => posts.filter((p) => p.id !== id));
    });
  }

  updatePost(id: number, data: Partial<Post>): void {
    this.postsService.updatePost(id, data).subscribe((updated) => {
      this._posts.update((posts) =>
        posts.map((p) => (p.id === id ? updated : p))
      );
    });
  }
}
