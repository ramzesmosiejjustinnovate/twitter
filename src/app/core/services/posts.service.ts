import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/posts';

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?_expand=user`);
  }

  addPost(post: Omit<Post, 'id' | 'user'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  updatePost(id: number, data: Partial<Omit<Post, 'user'>>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, data);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
