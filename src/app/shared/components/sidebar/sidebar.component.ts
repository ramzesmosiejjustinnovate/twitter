import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { PostsStateService } from '../../../core/services/posts-state.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatButtonModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly postsStateService = inject(PostsStateService);
  private readonly profileService = inject(ProfileService);

  private readonly currentProfile = signal<Profile | null>(null);

  ngOnInit(): void {
    this.profileService
      .getProfile()
      .subscribe((p) => this.currentProfile.set(p));
  }

  openAddPostDialog(): void {
    import(
      '../../../features/posts/add-post-dialog/add-post-dialog.component'
    ).then(({ AddPostDialogComponent }) => {
      const dialogRef = this.dialog.open(AddPostDialogComponent, {
        width: '520px',
        panelClass: 'tweexxtter-dialog',
      });

      dialogRef
        .afterClosed()
        .subscribe((result: Partial<Post> | undefined) => {
          if (result && this.currentProfile()) {
            this.postsStateService.addPost({
              title: result.title ?? '',
              content: result.content ?? '',
              userId: this.currentProfile()!.id,
              imageUrl: result.imageUrl ?? '',
              likes: 0,
            });
          }
        });
    });
  }
}
