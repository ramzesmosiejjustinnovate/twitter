import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../../core/models/profile.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  readonly profile = signal<Profile | null>(null);

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((p) => this.profile.set(p));
  }
}
